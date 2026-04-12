import React, { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const HERO_THEMES = {
  ocean: {
    topColor: [0.58, 0.88, 0.92],
    upperColor: [0.04, 0.32, 0.59],
    lowerColor: [0.05, 0.29, 0.52],
    flareColor: [0.88, 0.98, 0.92],
    shaftColor: [0.9, 1.0, 0.88],
    topTransparency: 0.78,
  },
  forest: {
    topColor: [0.56, 0.86, 0.7],
    upperColor: [0.22, 0.56, 0.34],
    lowerColor: [0.05, 0.22, 0.18],
    flareColor: [0.92, 1.0, 0.82],
    shaftColor: [0.9, 0.98, 0.8],
    topTransparency: 0.8,
  },
  desert: {
    topColor: [0.95, 0.82, 0.56],
    upperColor: [0.71, 0.48, 0.22],
    lowerColor: [0.28, 0.17, 0.1],
    flareColor: [1.0, 0.92, 0.7],
    shaftColor: [1.0, 0.92, 0.72],
    topTransparency: 0.84,
  },
};

const fragmentShader = `

uniform vec3 uTopColor;
uniform vec3 uUpperColor;
uniform vec3 uLowerColor;
uniform vec3 uFlareColor;
uniform vec3 uShaftColor;
uniform float uTopTransparency;

precision highp float;

uniform float uTime;
uniform float uScroll;
uniform vec2 uResolution;

varying vec2 vUv;

float hash(vec2 p) {
  return 0.5 * (
    sin(dot(p, vec2(271.319, 413.975)) + 1217.13 * p.x * p.y)
  ) + 0.5;
}

float noise(vec2 p) {
  vec2 w = fract(p);
  w = w * w * (3.0 - 2.0 * w);
  p = floor(p);
  return mix(
    mix(hash(p + vec2(0.0, 0.0)), hash(p + vec2(1.0, 0.0)), w.x),
    mix(hash(p + vec2(0.0, 1.0)), hash(p + vec2(1.0, 1.0)), w.x),
    w.y
  );
}

float fbm(vec2 n) {
  float total = 0.0;
  float amplitude = 1.0;
  for (int i = 0; i < 5; i++) {
    total += noise(n) * amplitude;
    n += n;
    amplitude *= 0.4;
  }
  return total;
}

float map_octave(vec2 uv) {
  uv = (uv + noise(uv)) / 2.5;
  uv = vec2(uv.x * 0.6 - uv.y * 0.8, uv.x * 0.8 + uv.y * 0.6);
  vec2 uvsin = 1.0 - abs(sin(uv));
  vec2 uvcos = abs(cos(uv));
  uv = mix(uvsin, uvcos, uvsin);
  float val = 1.0 - pow(uv.x * uv.y, 0.65);
  return val;
}

float map(vec3 p) {
  vec2 uv = p.xz + uTime / 2.0;
  float amp = 0.6;
  float freq = 2.0;
  float val = 0.0;

  for (int i = 0; i < 3; ++i) {
    val += map_octave(uv) * amp;
    amp *= 0.3;
    uv *= freq;
  }

  uv = p.xz - 1000.0 - uTime / 2.0;
  amp = 0.6;
  freq = 2.0;

  for (int i = 0; i < 3; ++i) {
    val += map_octave(uv) * amp;
    amp *= 0.3;
    uv *= freq;
  }

  return val + 3.0 - p.y;
}

vec3 getNormal(vec3 p) {
  float eps = 1.0 / uResolution.x;
  vec3 px = p + vec3(eps, 0.0, 0.0);
  vec3 pz = p + vec3(0.0, 0.0, eps);
  return normalize(vec3(map(px), eps, map(pz)));
}

float raymarch(vec3 ro, vec3 rd, out vec3 outP, out float outT) {
  float l = 0.0;
  float r = 26.0;
  float dist = 1000000.0;

  for (int i = 0; i < 14; ++i) {
    float mid = (r + l) * 0.5;
    float mapmid = map(ro + rd * mid);
    dist = min(dist, abs(mapmid));

    if (mapmid > 0.0) {
      l = mid;
    } else {
      r = mid;
    }

    if (r - l < 1.0 / uResolution.x) break;
  }

  outP = ro + rd * l;
  outT = l;
  return dist;
}

float lightShafts(vec2 st, float angle) {
  vec2 original = st;
  float t = uTime / 16.0;

  st = vec2(
    st.x * cos(angle) - st.y * sin(angle),
    st.x * sin(angle) + st.y * cos(angle)
  );

  float val = fbm(vec2(st.x * 2.0 + 200.0 + t, st.y / 4.0));
  val += fbm(vec2(st.x * 2.0 + 200.0 - t, st.y / 4.0));
  val = val / 3.0;

  float mask = pow(clamp(1.0 - abs(original.y - 0.15), 0.0, 1.0) * 0.49 + 0.5, 2.0);
  mask *= clamp(1.0 - abs(original.x + 0.2), 0.0, 1.0) * 0.49 + 0.5;

  return pow(val * mask, 2.0);
}

vec2 bubble(vec2 uv, float scale) {
  if (uv.y > 0.2) return vec2(0.0);

  float t = uTime / 4.0;
  vec2 st = uv * scale;
  vec2 cell = floor(st);
  vec2 bias = vec2(0.0, 4.0 * sin(cell.x * 128.0 + t));
  float mask = smoothstep(0.1, 0.2, -cos(cell.x * 128.0 + t));

  st += bias;
  vec2 movedCell = floor(st);
  st = fract(st);

  float size = noise(movedCell) * 0.07 + 0.01;
  vec2 pos = vec2(noise(vec2(t, movedCell.y * 64.1)) * 0.8 + 0.1, 0.5);

  if (length(st.xy - pos) < size) {
    return (st + pos) * vec2(0.1, 0.2) * mask;
  }

  return vec2(0.0);
}

float lensFlare(vec2 uv, vec2 pos, float angle, float strength) {
  vec2 p = uv - pos;

  float ca = cos(angle);
  float sa = sin(angle);
  p = vec2(ca * p.x - sa * p.y, sa * p.x + ca * p.y);

  float core = exp(-length(p * vec2(2.0, 5.0)) * 6.0);
  float streak = exp(-abs(p.y) * 28.0) * exp(-abs(p.x) * 2.2);
  float halo = exp(-length(p) * 3.5);

  return (core * 1.2 + streak * 0.55 + halo * 0.25) * strength;
}

void main() {
  vec2 fragCoord = vUv * uResolution.xy;

  vec2 uv = (-uResolution.xy + 2.0 * fragCoord) / uResolution.y;
  uv.y *= 0.5;
  uv.x *= 0.45;

  // make the water ceiling move upward gradually as user scrolls down
  float dive = uScroll * 0.18;
  uv.y -= dive;

  // shadertoy-style shader bubbles
  uv += bubble(uv, 12.0) + bubble(uv, 24.0);

  vec3 ro = vec3(0.0, -uScroll * 0.28, 2.0);
  vec3 rd = normalize(vec3(uv, -1.0));

  vec3 hitPos;
  float hitT;
  vec3 seaColor = uLowerColor;

  float dist = raymarch(ro, rd, hitPos, hitT);
  vec3 normal = getNormal(hitPos);

 float diffuse = dot(normal, rd) * 0.5 + 0.5;
  vec3 color = mix(uLowerColor, uUpperColor, diffuse);

  // upper water gets more verdant green
  float upperMask = smoothstep(-0.18, 0.28, uv.y);
  color = mix(color, uUpperColor, upperMask * 0.32);

  // top water becomes lighter / more transparent-feeling
  float topMask = smoothstep(0.02, 0.42, uv.y);
  color = mix(color, uTopColor, topMask * (1.0 - uTopTransparency) * 0.55);

  color += pow(diffuse, 12.0) * 0.18;

  vec3 ref = normalize(refract(hitPos - vec3(8.0, 3.0, -3.0), normal, 0.05));
  float refraction = clamp(dot(ref, rd), 0.0, 1.0);
  color += uFlareColor * 0.45 * pow(refraction, 1.5);

  vec3 col = mix(color, seaColor, pow(clamp(dist, 0.0, 1.0), 0.2));

  float shaftAngle = mix(-0.10, -0.22, uScroll);
  col += uShaftColor * lightShafts(uv, shaftAngle) * 0.7;

  // mild underwater depth tint only, no beam
  float depthFog = smoothstep(0.12, -1.0, uv.y);
  col = mix(col, uLowerColor, depthFog * 0.20);

  // keep lens flare subtle
  float flareAngle = mix(0.18, 0.55, uScroll);
  float flare = lensFlare(uv, vec2(-0.22, 0.42), flareAngle, 0.38);
  col += uFlareColor * flare * 0.32;

  vec2 q = vUv;
  col *= 0.76 + 0.24 * pow(16.0 * q.x * q.y * (1.0 - q.x) * (1.0 - q.y), 0.2);

  col = (col * col + sin(col)) / vec3(1.8, 1.8, 1.9);

  gl_FragColor = vec4(col, 1.0);
}
`;

function WaterPlane({ scroll = 0, theme = "ocean" }) {
  const materialRef = useRef();
  const { size, gl } = useThree();
  const themeValues = HERO_THEMES[theme] || HERO_THEMES.ocean;

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uTopColor: { value: new THREE.Vector3(...themeValues.topColor) },
      uUpperColor: { value: new THREE.Vector3(...themeValues.upperColor) },
      uLowerColor: { value: new THREE.Vector3(...themeValues.lowerColor) },
      uFlareColor: { value: new THREE.Vector3(...themeValues.flareColor) },
      uShaftColor: { value: new THREE.Vector3(...themeValues.shaftColor) },
      uTopTransparency: { value: themeValues.topTransparency },
    }),
    [],
  );

  useEffect(() => {
    if (!materialRef.current) return;

    const u = materialRef.current.uniforms;

    u.uTopColor.value.set(...themeValues.topColor);
    u.uUpperColor.value.set(...themeValues.upperColor);
    u.uLowerColor.value.set(...themeValues.lowerColor);
    u.uFlareColor.value.set(...themeValues.flareColor);
    u.uShaftColor.value.set(...themeValues.shaftColor);
    u.uTopTransparency.value = themeValues.topTransparency;

    materialRef.current.needsUpdate = true;
  }, [theme, themeValues]);

  useFrame((state) => {
    if (!materialRef.current) return;

    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uScroll.value = scroll;
    materialRef.current.uniforms.uResolution.value.set(
      size.width * gl.getPixelRatio(),
      size.height * gl.getPixelRatio(),
    );
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        key={theme}
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}

export default function HeroWaterCanvas({ scroll = 0, theme = "ocean" }) {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        orthographic
        dpr={[1, 1]}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 1], zoom: 1 }}
      >
        <WaterPlane scroll={scroll} theme={theme} />
      </Canvas>
    </div>
  );
}
