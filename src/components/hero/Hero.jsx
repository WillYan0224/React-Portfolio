import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { useAppContext } from "../../context/AppContext";
import HeroWaterCanvas from "../HeroWaterCanvas";
import AmbientBubbles from "../fx/AmbientBubbles";

export default function Hero() {
  const { t, heroTheme, theme } = useAppContext();
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
      <div className="sticky top-0 h-screen overflow-hidden">
        <HeroWaterCanvas scroll={shaderScroll} theme={heroTheme} />

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
            <div
              className="backdrop-blur-xl p-10 md:p-16 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
              style={{
                background: theme.cardBg,
                border: `1px solid ${theme.cardBorder}`,
              }}
            >
              <div className="relative z-[2]">
                <h2
                  className="text-xl md:text-2xl font-mono mb-6 flex items-center gap-2 whitespace-nowrap"
                  style={{ color: theme.accentSoft }}
                >
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
                  <span
                    className="text-transparent bg-clip-text"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${theme.titleFrom}, ${theme.titleTo})`,
                    }}
                  >
                    {t.hero.title_highlight}
                  </span>
                </h1>

                <p className="text-blue-50 text-lg md:text-xl max-w-xl mb-10 leading-relaxed font-medium opacity-90">
                  {t.hero.desc}
                </p>

                <a
                  href="#work"
                  className="inline-flex h-16 items-center justify-center rounded-2xl px-12 text-sm font-black text-white transition-all shadow-xl uppercase tracking-widest"
                  style={{
                    backgroundColor: theme.buttonBg,
                    boxShadow: `0 10px 30px ${theme.buttonBg}33`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#ffffff";
                    e.currentTarget.style.color = theme.buttonHoverText;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = theme.buttonBg;
                    e.currentTarget.style.color = "#ffffff";
                  }}
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
}
