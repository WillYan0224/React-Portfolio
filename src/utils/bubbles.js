export const BASE_HERO_BUBBLES = [
  { left: "8%", size: 10, duration: 10, delay: 0 },
  { left: "16%", size: 16, duration: 14, delay: 1.5 },
  { left: "24%", size: 8, duration: 11, delay: 3 },
  { left: "36%", size: 14, duration: 16, delay: 2 },
  { left: "48%", size: 20, duration: 18, delay: 0.5 },
  { left: "60%", size: 9, duration: 12, delay: 4 },
  { left: "72%", size: 18, duration: 17, delay: 1 },
  { left: "84%", size: 11, duration: 13, delay: 2.8 },
  { left: "92%", size: 15, duration: 15, delay: 5 },
];

export const EXTRA_HERO_BUBBLES = [
  { left: "6%", size: 7, duration: 13, delay: 0.8 },
  { left: "13%", size: 12, duration: 16, delay: 2.3 },
  { left: "22%", size: 9, duration: 15, delay: 4.8 },
  { left: "29%", size: 6, duration: 11, delay: 3.2 },
  { left: "41%", size: 13, duration: 18, delay: 1.3 },
  { left: "53%", size: 8, duration: 14, delay: 5.2 },
  { left: "66%", size: 10, duration: 16, delay: 0.4 },
  { left: "78%", size: 14, duration: 17, delay: 2.7 },
  { left: "88%", size: 9, duration: 12, delay: 6.1 },
  { left: "96%", size: 6, duration: 10, delay: 1.9 },
];

export const SECTION_BUBBLES_ALT = [
  { left: "10%", size: 11, duration: 13, delay: 0.4 },
  { left: "21%", size: 15, duration: 17, delay: 2.1 },
  { left: "33%", size: 8, duration: 12, delay: 4.4 },
  { left: "51%", size: 18, duration: 19, delay: 1.2 },
  { left: "69%", size: 10, duration: 15, delay: 3.8 },
  { left: "87%", size: 14, duration: 16, delay: 5.1 },
];

export const SECTION_BUBBLES_ALT_EXTRA = [
  { left: "6%", size: 8, duration: 14, delay: 1.1 },
  { left: "17%", size: 6, duration: 11, delay: 3.2 },
  { left: "28%", size: 10, duration: 15, delay: 5.4 },
  { left: "44%", size: 7, duration: 12, delay: 2.5 },
  { left: "58%", size: 12, duration: 17, delay: 0.9 },
  { left: "76%", size: 9, duration: 14, delay: 4.2 },
  { left: "93%", size: 7, duration: 13, delay: 6.2 },
];

export const repeatArray = (arr, times = 1) =>
  Array.from({ length: times }, (_, groupIndex) =>
    arr.map((item, itemIndex) => ({
      ...item,
      id: `${groupIndex}-${itemIndex}`,
      left: `${Math.min(96, parseFloat(item.left) + groupIndex * 3)}%`,
      delay: item.delay + groupIndex * 0.8,
    })),
  ).flat();

export const densityOffsets = {
  even: [0, 0, 0, 0, 0, 0],
  leftHeavy: [-4, -3, -2, 0, 1, 2],
  rightHeavy: [2, 1, 0, -2, -3, -4],
  centerHeavy: [2, 1, -2, -2, 1, 2],
};

export const applyDensityProfile = (arr, profile = "even") => {
  const offsets = densityOffsets[profile] || densityOffsets.even;
  return arr.map((item, i) => ({
    ...item,
    left: `${Math.max(
      4,
      Math.min(96, parseFloat(item.left) + (offsets[i % offsets.length] || 0)),
    )}%`,
  }));
};

export const makeBubbleBackground = ({
  fresnel,
  fillOpacity,
  borderOpacity,
  centerTransparency,
}) => {
  if (!fresnel) {
    return `rgba(255,255,255,${fillOpacity})`;
  }

  const centerAlpha = Math.max(0, fillOpacity * (1 - centerTransparency));

  return `
    radial-gradient(
      circle at 50% 50%,
      rgba(255,255,255,${centerAlpha}) 0%,
      rgba(255,255,255,${centerAlpha * 0.55}) 36%,
      rgba(170,235,255,${fillOpacity * 0.22}) 56%,
      rgba(210,245,255,${borderOpacity * 0.82}) 74%,
      rgba(255,255,255,${borderOpacity}) 86%,
      rgba(255,255,255,0.00) 100%
    )
  `;
};

export const makeBubbleMotion = (bubble, isExtra = false) => {
  const durationJitter = 0.82 + Math.random() * 0.42; // 0.82 ~ 1.24
  const endDriftX = -18 + Math.random() * 36; // -18px ~ +18px
  const startDriftX = -4 + Math.random() * 8; // -4px ~ +4px
  const riseDistance = 105 + Math.random() * 42; // 105vh ~ 147vh
  const scaleEnd = 1.02 + Math.random() * 0.16;
  const scaleStart = 0.82 + Math.random() * 0.16;
  const peakOpacityMul = isExtra
    ? 0.78 + Math.random() * 0.22
    : 0.88 + Math.random() * 0.2;

  return {
    animationDuration: `${(bubble.duration * durationJitter).toFixed(2)}s`,
    animationDelay: `${(bubble.delay + Math.random() * 1.4).toFixed(2)}s`,
    "--bubble-drift-start-x": `${startDriftX.toFixed(1)}px`,
    "--bubble-drift-end-x": `${endDriftX.toFixed(1)}px`,
    "--bubble-rise-distance": `${riseDistance.toFixed(1)}vh`,
    "--bubble-scale-start": `${scaleStart.toFixed(2)}`,
    "--bubble-scale-end": `${scaleEnd.toFixed(2)}`,
    "--bubble-opacity-peak": `${peakOpacityMul.toFixed(2)}`,
  };
};
