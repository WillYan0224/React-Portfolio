import "./App.css";
import HeroWaterCanvas from "./components/HeroWaterCanvas";
import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import {
  Github,
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";
import emailjs from "@emailjs/browser";

import { SKILLS_DATA, DEVTOOL_DATA } from "./data/skills";
import { PROJECTS } from "./data/porjects";
import { TRANSLATIONS } from "./data/translations";

// --- 1. CONTEXT SETUP ---
const LanguageContext = createContext();
const useLanguage = () => useContext(LanguageContext);

// --- 2. LIGHTWEIGHT FX COMPONENTS ---
const BASE_HERO_BUBBLES = [
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

const EXTRA_HERO_BUBBLES = [
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

const SECTION_BUBBLES_ALT = [
  { left: "10%", size: 11, duration: 13, delay: 0.4 },
  { left: "21%", size: 15, duration: 17, delay: 2.1 },
  { left: "33%", size: 8, duration: 12, delay: 4.4 },
  { left: "51%", size: 18, duration: 19, delay: 1.2 },
  { left: "69%", size: 10, duration: 15, delay: 3.8 },
  { left: "87%", size: 14, duration: 16, delay: 5.1 },
];

const SECTION_BUBBLES_ALT_EXTRA = [
  { left: "6%", size: 8, duration: 14, delay: 1.1 },
  { left: "17%", size: 6, duration: 11, delay: 3.2 },
  { left: "28%", size: 10, duration: 15, delay: 5.4 },
  { left: "44%", size: 7, duration: 12, delay: 2.5 },
  { left: "58%", size: 12, duration: 17, delay: 0.9 },
  { left: "76%", size: 9, duration: 14, delay: 4.2 },
  { left: "93%", size: 7, duration: 13, delay: 6.2 },
];

const repeatArray = (arr, times = 1) =>
  Array.from({ length: times }, (_, groupIndex) =>
    arr.map((item, itemIndex) => ({
      ...item,
      id: `${groupIndex}-${itemIndex}`,
      left: `${Math.min(96, parseFloat(item.left) + groupIndex * 3)}%`,
      delay: item.delay + groupIndex * 0.8,
    })),
  ).flat();

const densityOffsets = {
  even: [0, 0, 0, 0, 0, 0],
  leftHeavy: [-4, -3, -2, 0, 1, 2],
  rightHeavy: [2, 1, 0, -2, -3, -4],
  centerHeavy: [2, 1, -2, -2, 1, 2],
};

const applyDensityProfile = (arr, profile = "even") => {
  const offsets = densityOffsets[profile] || densityOffsets.even;
  return arr.map((item, i) => ({
    ...item,
    left: `${Math.max(
      4,
      Math.min(96, parseFloat(item.left) + (offsets[i % offsets.length] || 0)),
    )}%`,
  }));
};

const makeBubbleBackground = ({
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

const makeBubbleMotion = (bubble, isExtra = false) => {
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

const AmbientBubbles = ({
  extraDensity = 0,
  scale = 1,
  className = "",
  variant = "hero",
  baseOpacity = 0.42,
  extraOpacityBase = 0.08,
  extraOpacityGain = 0.38,
  borderOpacity = 0.2,
  fillOpacity = 0.05,
  blurPx = 0.35,
  glow = false,
  countMultiplier = 1,
  densityProfile = "even",
  fresnel = false,
  centerTransparency = 0.9,
}) => {
  const rawPrimary =
    variant === "section" ? SECTION_BUBBLES_ALT : BASE_HERO_BUBBLES;
  const rawSecondary =
    variant === "section" ? SECTION_BUBBLES_ALT_EXTRA : EXTRA_HERO_BUBBLES;

  const primarySet = repeatArray(
    applyDensityProfile(rawPrimary, densityProfile),
    countMultiplier,
  );

  const secondarySet = repeatArray(
    applyDensityProfile(rawSecondary, densityProfile),
    countMultiplier,
  );

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {primarySet.map((bubble, i) => {
        const motion = makeBubbleMotion(bubble, false);

        return (
          <span
            key={`base-${variant}-${bubble.id ?? i}`}
            className="absolute bottom-[-10%] rounded-full bubble-float"
            style={{
              left: bubble.left,
              width: `${bubble.size * scale}px`,
              height: `${bubble.size * scale}px`,
              ...motion,
              filter: glow
                ? `blur(${blurPx}px) drop-shadow(0 0 8px rgba(180,240,255,0.16))`
                : `blur(${blurPx}px)`,
              opacity: baseOpacity,
              background: makeBubbleBackground({
                fresnel,
                fillOpacity,
                borderOpacity,
                centerTransparency,
              }),
              border: fresnel
                ? "none"
                : `1px solid rgba(224,242,254,${borderOpacity})`,
              boxShadow: glow
                ? `0 0 10px rgba(180,240,255,0.12), inset 0 0 10px rgba(255,255,255,0.04)`
                : "none",
            }}
          />
        );
      })}

      {secondarySet.map((bubble, i) => {
        const motion = makeBubbleMotion(bubble, true);

        return (
          <span
            key={`extra-${variant}-${bubble.id ?? i}`}
            className="absolute bottom-[-10%] rounded-full bubble-float"
            style={{
              left: bubble.left,
              width: `${bubble.size * scale}px`,
              height: `${bubble.size * scale}px`,
              ...motion,
              filter: glow
                ? `blur(${blurPx + 0.15}px) drop-shadow(0 0 8px rgba(180,240,255,0.12))`
                : `blur(${blurPx + 0.15}px)`,
              opacity: extraOpacityBase + extraDensity * extraOpacityGain,
              background: makeBubbleBackground({
                fresnel,
                fillOpacity: fillOpacity * 0.8,
                borderOpacity: borderOpacity * 0.8,
                centerTransparency,
              }),
              border: fresnel
                ? "none"
                : `1px solid rgba(224,242,254,${borderOpacity * 0.8})`,
              boxShadow: glow
                ? `0 0 8px rgba(180,240,255,0.10), inset 0 0 8px rgba(255,255,255,0.03)`
                : "none",
            }}
          />
        );
      })}
    </div>
  );
};

const UnderwaterDivider = () => {
  return (
    <section className="relative h-[28vh] overflow-hidden pointer-events-none">
      <AmbientBubbles
        variant="section"
        scale={1.05}
        extraDensity={0.3}
        baseOpacity={0.14}
        extraOpacityBase={0.04}
        className="z-0"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[#061a2d]/0 via-[#082847]/55 to-[#082847]/90" />
      <div className="absolute inset-x-0 top-[24%] h-[90px]">
        <div className="waterline-drift-track absolute inset-0 opacity-45">
          <svg
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[240%] h-[100px]"
            viewBox="0 0 1440 180"
            preserveAspectRatio="none"
          >
            <path
              d="M0,92
                 C60,38 120,146 180,92
                 C240,38 300,146 360,92
                 C420,38 480,146 540,92
                 C600,38 660,146 720,92
                 C780,38 840,146 900,92
                 C960,38 1020,146 1080,92
                 C1140,38 1200,146 1260,92
                 C1320,58 1380,66 1440,92"
              fill="none"
              stroke="rgba(180,240,255,0.34)"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(90,220,255,0.08),transparent_55%)]" />
      <div className="light-shaft shaft-1 opacity-20" />
      <div className="light-shaft shaft-2 opacity-14" />
    </section>
  );
};

// --- 3. UI COMPONENTS ---
const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <nav className="fixed top-0 w-full px-8 py-5 grid grid-cols-3 items-center z-[100] bg-[#0a0a0a]/90 backdrop-blur-3xl border-b border-white/10 text-white shadow-2xl">
      <div className="justify-self-start text-2xl font-black tracking-tighter">
        PORTFOLIO.
      </div>

      <div className="justify-self-center hidden md:flex gap-12 font-bold text-sm uppercase tracking-[0.2em] text-gray-300">
        <a href="#about" className="hover:text-cyan-400 transition-all">
          {t.nav.about}
        </a>
        <a href="#work" className="hover:text-cyan-400 transition-all">
          {t.nav.work}
        </a>
        <a href="#contact" className="hover:text-cyan-400 transition-all">
          {t.nav.contact}
        </a>
      </div>

      <div className="justify-self-end flex items-center gap-6">
        <div className="flex gap-4 items-center border-l border-white/10 pl-6">
          <button
            onClick={() => setLanguage("en")}
            className={`text-sm font-bold ${
              language === "en" ? "text-cyan-400" : "text-gray-500"
            }`}
          >
            EN
          </button>

          <button
            onClick={() => setLanguage("jp")}
            className={`text-sm font-bold ${
              language === "jp" ? "text-cyan-400" : "text-gray-500"
            }`}
          >
            JP
          </button>
        </div>

        <a
          href="#contact"
          className="relative hidden md:inline-flex h-12 overflow-hidden rounded-full p-[2px] focus:outline-none group"
        >
          <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#22d3ee_0%,#3b82f6_50%,#22d3ee_100%)]" />
          <span className="relative inline-flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-black/90 px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl transition-colors duration-500 ease-out group-hover:text-white">
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out opacity-60 bg-[conic-gradient(from_90deg_at_50%_50%,#22d3ee_0%,#3b82f6_50%,#22d3ee_100%)] blur-lg" />
            <span className="relative z-10">{t.nav.btn}</span>
          </span>
        </a>
      </div>
    </nav>
  );
};

const Hero = () => {
  const { t } = useLanguage();
  const [roleIndex, setRoleIndex] = useState(0);
  const [shaderScroll, setShaderScroll] = useState(0);
  const [extraBubbleDensity, setExtraBubbleDensity] = useState(0);
  const heroRef = useRef(null);
  const ROLES = t.hero.roles;

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [ROLES]);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const bubbleMapped = Math.max(0, Math.min(1, (latest - 0.2) / 0.5));
    setExtraBubbleDensity(bubbleMapped);

    const shaderMapped = Math.max(0, Math.min(1, latest));
    setShaderScroll(shaderMapped);
  });

  const bubblesOpacity = useTransform(scrollYProgress, [0.15, 0.8], [0.18, 1]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 72]);
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.72, 1],
    [1, 0.92, 0.05],
  );
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.97]);

  return (
    <section ref={heroRef} className="relative h-[165vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-[#004c99]">
        <HeroWaterCanvas scroll={shaderScroll} />

        <motion.div
          style={{ opacity: bubblesOpacity }}
          className="absolute inset-0 pointer-events-none z-[2]"
        >
          <AmbientBubbles
            variant="hero"
            extraDensity={extraBubbleDensity}
            scale={1.95}
            baseOpacity={0.32}
            extraOpacityBase={0.05}
            extraOpacityGain={0.16}
            borderOpacity={0.18}
            fillOpacity={0.025}
            blurPx={0.14}
            glow
            fresnel
            centerTransparency={0.92}
            countMultiplier={1}
            densityProfile="even"
          />
        </motion.div>

        <motion.div
          style={{
            y: contentY,
            opacity: contentOpacity,
            scale: contentScale,
          }}
          className="relative z-10 flex h-full items-center px-6 md:px-20"
        >
          <div className="max-w-[74rem] w-full translate-x-4 translate-y-6 md:translate-x-10 md:translate-y-32">
            <div className="backdrop-blur-xl bg-black/20 border border-white/10 p-10 md:p-16 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <div className="relative z-[2]">
                <h2 className="text-xl md:text-2xl text-cyan-300 font-mono mb-6 flex items-center gap-2 whitespace-nowrap">
                  <span>{t.hero.greeting}</span>

                  <div className="relative ml-2 h-8 w-[20rem] md:w-[28rem] flex items-center overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={ROLES[roleIndex]}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute font-bold text-white uppercase tracking-tight whitespace-nowrap"
                      >
                        {ROLES[roleIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </h2>

                <h1 className="text-6xl md:text-7xl font-black leading-[0.9] mb-8 text-white tracking-tighter drop-shadow-2xl">
                  {t.hero.title_start}{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
                    {t.hero.title_highlight}
                  </span>
                </h1>

                <p className="text-blue-50 text-lg md:text-xl max-w-xl mb-10 leading-relaxed font-medium opacity-90">
                  {t.hero.desc}
                </p>

                <a
                  href="#work"
                  className="inline-flex h-16 items-center justify-center rounded-2xl bg-cyan-500 px-12 text-sm font-black text-white hover:bg-white hover:text-cyan-600 transition-all shadow-xl shadow-cyan-500/20 uppercase tracking-widest"
                >
                  {t.hero.cta}
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const TechMarquee = () => {
  return (
    <div className="py-20 bg-[#082847]/80 backdrop-blur-md overflow-hidden relative border-y border-white/10 flex flex-col gap-20">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#082847] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#082847] to-transparent z-10" />

      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: [0, -1035] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
      >
        {[...SKILLS_DATA, ...SKILLS_DATA, ...SKILLS_DATA, ...SKILLS_DATA].map(
          (skill, index) => (
            <div
              key={`row1-${index}`}
              className="mx-4 flex items-center gap-4 group cursor-default"
            >
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-cyan-400/50 group-hover:bg-white/10 transition-colors duration-300">
                <img
                  src={skill.icon}
                  alt={skill.name}
                  className={`w-7 h-7 object-contain opacity-70 group-hover:opacity-100 ${
                    skill.invert ? "invert brightness-0" : ""
                  }`}
                />
              </div>
              <span className="text-xl font-bold text-cyan-100/35 group-hover:text-cyan-100 transition-colors uppercase tracking-tight">
                {skill.name}
              </span>
            </div>
          ),
        )}
      </motion.div>

      <motion.div
        className="flex whitespace-nowrap"
        initial={{ x: -1035 }}
        animate={{ x: [-1035, 0] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
      >
        {[...DEVTOOL_DATA, ...DEVTOOL_DATA, ...DEVTOOL_DATA, ...DEVTOOL_DATA]
          .reverse()
          .map((devtool, index) => (
            <div
              key={`row2-${index}`}
              className="mx-4 flex items-center gap-4 group cursor-default"
            >
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-cyan-400/50 group-hover:bg-white/10 transition-colors duration-300">
                <img
                  src={devtool.icon}
                  alt={devtool.name}
                  className={`w-7 h-7 object-contain opacity-70 group-hover:opacity-100 ${
                    devtool.invert ? "invert brightness-0" : ""
                  }`}
                />
              </div>
              <span className="text-xl font-bold text-cyan-100/35 group-hover:text-cyan-100 transition-colors uppercase tracking-tight">
                {devtool.name}
              </span>
            </div>
          ))}
      </motion.div>
    </div>
  );
};

const About = () => {
  const { t } = useLanguage();

  return (
    <section
      id="about"
      className="py-32 px-6 md:px-20 relative overflow-hidden"
    >
      <AmbientBubbles
        variant="section"
        scale={1.4}
        extraDensity={0.32}
        baseOpacity={0.22}
        extraOpacityBase={0.07}
        extraOpacityGain={0.2}
        borderOpacity={0.2}
        fillOpacity={0.028}
        blurPx={0.16}
        glow
        fresnel
        centerTransparency={0.95}
        countMultiplier={1}
        densityProfile="leftHeavy"
        className="z-0"
      />

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-cyan-400 font-mono mb-4 uppercase tracking-[0.5em] text-xs font-bold">
            {t.about.title}
          </h2>

          <h3 className="text-5xl md:text-6xl font-black mb-8 text-white tracking-tighter leading-tight">
            {t.about.headline_word1}{" "}
            <span className="text-cyan-400">{t.about.headline_word2}</span>
          </h3>

          <p className="text-blue-50 text-lg mb-10 leading-relaxed border-l-4 border-cyan-500/30 pl-8 opacity-80">
            {t.about.bio1}
          </p>

          <div className="flex gap-12 border-t border-white/10 pt-10">
            <div>
              <h4 className="text-5xl font-black text-white tracking-tighter">
                4+
              </h4>
              <p className="text-xs text-cyan-500 uppercase font-bold tracking-widest mt-2">
                Years Exp
              </p>
            </div>

            <div>
              <h4 className="text-5xl font-black text-white tracking-tighter">
                15+
              </h4>
              <p className="text-xs text-cyan-500 uppercase font-bold tracking-widest mt-2">
                Projects
              </p>
            </div>
          </div>
        </motion.div>

        <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/5] border border-white/10 shadow-2xl rotate-2">
          <img
            src="/photos/HKport_001.jpg"
            alt="About"
            className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001933]/60 to-transparent" />
        </div>
      </div>
    </section>
  );
};

// --- FEATURED PROJECTS ---
const TiltCard = ({ children }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["1deg", "-1deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-1deg", "1deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="w-full md:w-[65%] relative cursor-pointer"
    >
      {children}
    </motion.div>
  );
};

const FeaturedProjects = () => {
  const { t } = useLanguage();
  const [activeProject, setActiveProject] = useState(null);
  const videoRef = useRef(null);

  return (
    <>
      <section
        id="work"
        className="py-32 px-6 md:px-20 relative overflow-hidden"
      >
        <AmbientBubbles
          variant="section"
          scale={2.52}
          extraDensity={0.28}
          baseOpacity={0.14}
          extraOpacityBase={0.045}
          extraOpacityGain={0.18}
          borderOpacity={0.56}
          fillOpacity={0.82}
          blurPx={0.14}
          glow
          fresnel
          centerTransparency={0.96}
          countMultiplier={2}
          densityProfile="centerHeavy"
          className="z-0"
        />
        <div className="relative z-10">
          <div className="max-w-[90rem] mx-auto mb-24">
            <h2 className="w-fit md:-ml-12 text-7xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
              Selected{" "}
              <span className="text-cyan-500 text-shadow-glow">Works</span>
            </h2>
          </div>

          <div className="max-w-[90rem] mx-auto space-y-72">
            {t.featured.map((project, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } items-center gap-16 md:gap-24`}
              >
                <TiltCard>
                  <div
                    onClick={() => setActiveProject(project)}
                    className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 bg-white/5 shadow-2xl group"
                  >
                    <video
                      src={project.video}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="p-8 bg-white text-black rounded-full shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                        <Play fill="currentColor" size={40} />
                      </div>
                    </div>
                  </div>
                </TiltCard>

                <div className="w-full md:w-[35%] space-y-8">
                  <span className="text-cyan-400 font-mono text-sm tracking-[0.4em] uppercase font-bold">
                    {project.tag}
                  </span>

                  <h3 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-tight">
                    {project.title}
                  </h3>

                  <p className="text-blue-50/70 leading-relaxed text-xl border-l-4 border-cyan-500/20 pl-8">
                    {project.desc}
                  </p>

                  <div className="flex gap-6 pt-4">
                    <button
                      onClick={() => setActiveProject(project)}
                      className="bg-white text-black px-12 py-5 rounded-2xl font-black hover:bg-cyan-500 hover:text-white transition-all uppercase text-sm tracking-widest shadow-xl"
                    >
                      Preview
                    </button>

                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="p-5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-colors"
                    >
                      <Github size={28} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeProject && (
          <motion.div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveProject(null)}
          >
            <div
              className="relative w-full max-w-7xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveProject(null)}
                className="absolute -top-16 right-0 text-white hover:text-cyan-400 transition-colors"
              >
                <X size={40} />
              </button>

              <video
                ref={videoRef}
                className="w-full h-full rounded-3xl shadow-2xl border border-white/10"
                controls
                autoPlay
              >
                <source src={activeProject.modalVideo} type="video/mp4" />
              </video>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const ProjectList = () => {
  const { t } = useLanguage();
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    const amount = window.innerWidth >= 768 ? 404 * 3 : 324 * 2;
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative py-32 overflow-hidden">
      <AmbientBubbles
        variant="section"
        scale={1.82}
        extraDensity={0.44}
        baseOpacity={0.73}
        extraOpacityBase={0.54}
        extraOpacityGain={0.58}
        borderOpacity={0.55}
        fillOpacity={0.52}
        blurPx={0.73}
        glow
        fresnel
        centerTransparency={0.97}
        countMultiplier={2}
        densityProfile="centerHeavy"
        className="z-0"
      />

      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#082847]/15 to-[#061a2d]/45" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.06),transparent_60%)]" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6">
        <div className="flex justify-between items-end mb-16 px-2">
          <h2 className="text-5xl font-black text-white tracking-tighter">
            Projects
          </h2>

          <div className="flex gap-4">
            <button
              onClick={() => scroll("left")}
              className="p-4 border border-white/10 rounded-full hover:bg-cyan-500 text-white transition-all shadow-lg"
              aria-label="Scroll Left"
            >
              <ChevronLeft />
            </button>

            <button
              onClick={() => scroll("right")}
              className="p-4 border border-white/10 rounded-full hover:bg-cyan-500 text-white transition-all shadow-lg"
              aria-label="Scroll Right"
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="grid grid-rows-2 grid-flow-col gap-8 overflow-x-auto pb-8 no-scrollbar snap-x snap-mandatory"
        >
          {PROJECTS.map((project, i) => {
            const trans = t.projects.list[i] || t.projects.list[0];

            return (
              <motion.div
                key={project.id || i}
                className="w-[320px] md:w-[400px] snap-start group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="relative aspect-video overflow-hidden rounded-[2rem] mb-6 border border-white/10 bg-white/5 shadow-xl">
                  {project.video ? (
                    <video
                      src={project.video}
                      poster={project.image}
                      className="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
                      muted
                      loop
                      autoPlay
                      playsInline
                    />
                  ) : (
                    <img
                      src={project.image || "/photos/placeholder.jpg"}
                      alt={trans.title}
                      className="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
                    />
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <a
                      href={project.gitUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-4 bg-white text-black rounded-full hover:scale-110 hover:bg-cyan-500 hover:text-white transition-all shadow-2xl"
                    >
                      <Github size={24} />
                    </a>

                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-4 bg-white text-black rounded-full hover:scale-110 hover:bg-cyan-500 hover:text-white transition-all shadow-2xl"
                      >
                        <ExternalLink size={24} />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex justify-between px-2 items-start">
                  <div className="max-w-[70%]">
                    <h3 className="font-black text-lg text-white group-hover:text-cyan-400 transition-colors truncate">
                      {trans.title}
                    </h3>

                    <p className="text-xs text-blue-100/40 line-clamp-2 mt-1 font-medium leading-relaxed">
                      {trans.description}
                    </p>
                  </div>

                  <span className="text-[10px] h-fit border border-cyan-500/30 px-3 py-1.5 rounded-lg text-cyan-400 font-black uppercase tracking-widest whitespace-nowrap bg-cyan-500/5">
                    {project.category}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const { t } = useLanguage();
  const form = useRef();
  const [status, setStatus] = useState("");

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus("sending");

    emailjs
      .sendForm(
        import.meta.env.VITE_SERVICE_ID,
        import.meta.env.VITE_TEMPLATE_ID,
        form.current,
        import.meta.env.VITE_PUBLIC_KEY,
      )
      .then(() => {
        setStatus("success");
        e.target.reset();
        setTimeout(() => setStatus(""), 3000);
      })
      .catch(() => {
        setStatus("error");
        setTimeout(() => setStatus(""), 3000);
      });
  };

  return (
    <section id="contact" className="py-32 px-6 bg-black/40 backdrop-blur-3xl">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-6xl md:text-8xl font-black mb-6 text-white tracking-tighter">
            Let's Dive{" "}
            <span className="text-cyan-500 text-shadow-glow">In</span>
          </h2>
          <p className="text-xl text-blue-100/40 font-medium">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-16">
          <div className="space-y-12">
            <div>
              <h4 className="text-cyan-500 font-mono text-xs uppercase tracking-widest mb-4 font-black">
                Message me
              </h4>
              <a
                href="mailto:hal.chung.chingyan.2025@gmail.com"
                className="text-xl font-bold hover:text-cyan-400 transition-colors break-words"
              >
                hal.chung.chingyan.2025@gmail.com
              </a>
            </div>

            <div>
              <h4 className="text-cyan-500 font-mono text-xs uppercase tracking-widest mb-4 font-black">
                Socials
              </h4>
              <a
                href="https://github.com/WillYan0224"
                target="_blank"
                rel="noreferrer"
                className="text-white hover:text-cyan-400 transition-colors inline-block"
              >
                <Github size={40} />
              </a>
            </div>
          </div>

          <div className="md:col-span-2 bg-white/5 p-10 md:p-16 rounded-[3rem] border border-white/10 backdrop-blur-2xl shadow-2xl">
            <form ref={form} onSubmit={sendEmail} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <input
                  required
                  name="user_name"
                  placeholder={t.contact.name}
                  className="w-full bg-white/5 border-b border-white/20 p-4 focus:outline-none focus:border-cyan-500 text-white text-lg transition-colors placeholder:text-white/20"
                />

                <input
                  required
                  name="user_email"
                  type="email"
                  placeholder={t.contact.email}
                  className="w-full bg-white/5 border-b border-white/20 p-4 focus:outline-none focus:border-cyan-500 text-white text-lg transition-colors placeholder:text-white/20"
                />
              </div>

              <textarea
                required
                name="message"
                rows="4"
                placeholder="Briefly describe your idea."
                className="w-full bg-white/5 border-b border-white/20 p-4 focus:outline-none focus:border-cyan-500 text-white text-lg transition-colors placeholder:text-white/20"
              />

              <button className="w-full bg-cyan-500 hover:bg-white hover:text-cyan-600 text-white font-black py-6 rounded-2xl transition-all shadow-xl shadow-cyan-500/20 uppercase tracking-widest">
                {status === "sending"
                  ? "Sending..."
                  : status === "success"
                    ? "Message Sent!"
                    : t.contact.btn_send}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- MAIN APP ---
function App() {
  const [language, setLanguage] = useState("en");
  const t = TRANSLATIONS[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div className="min-h-screen text-white selection:bg-cyan-400 selection:text-black bg-gradient-to-b from-[#004C99] to-[#001933]">
        <Navbar />

        <main className="relative z-10">
          <Hero />
          <TechMarquee />
          <About />
          <FeaturedProjects />
          <ProjectList />
          <Contact />

          <footer className="py-16 text-center text-blue-100/20 text-xs border-t border-white/5 bg-black/40 backdrop-blur-md">
            © {new Date().getFullYear()} Yan. Deep Dive Graphics Portfolio.
          </footer>
        </main>
      </div>
    </LanguageContext.Provider>
  );
}

export default App;
