import "./App.css";
import HeroWaterCanvas from "./components/HeroWaterCanvas";
import React, { useState, useEffect, useRef } from "react";
import { AppContext, useAppContext } from "./context/AppContext";
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
import { THEME_PRESETS } from "./data/themePresets";
import AmbientBubbles from "./components/fx/AmbientBubbles";

// --- 3. UI COMPONENTS ---
const Navbar = () => {
  const { language, setLanguage, t, theme } = useAppContext();
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    const sectionIds = ["about", "work", "contact"];

    const updateActiveSection = () => {
      let current = null;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        const triggerTop = window.innerHeight * 0.28;

        if (rect.top <= triggerTop && rect.bottom >= triggerTop) {
          current = id;
          break;
        }
      }

      setActiveSection(current);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
    };
  }, []);

  const navItems = [
    { id: "about", label: t.nav.about },
    { id: "work", label: t.nav.work },
    { id: "contact", label: t.nav.contact },
  ];

  return (
    <nav className="fixed top-4 left-0 right-0 z-[100] px-4 md:px-6">
      <div className="mx-auto max-w-[1440px]">
        <div className="relative flex items-center justify-between rounded-[1.75rem] border border-white/10 px-5 md:px-7 py-3 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.28)] overflow-hidden bg-[#04131d]/65">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />
          <div className="absolute inset-x-0 top-0 h-px bg-white/20" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at top, ${theme.accent}18, transparent 55%)`,
            }}
          />

          <div className="relative z-10 flex items-center gap-6">
            <a
              href="#"
              className="text-2xl font-black tracking-tighter text-white"
            >
              PORTFOLIO.
            </a>
          </div>

          <div className="relative z-10 hidden md:flex items-center rounded-full border border-white/10 bg-white/[0.04] p-1.5 backdrop-blur-xl">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;

              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="relative px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.28em] transition-colors"
                >
                  {isActive && (
                    <motion.span
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 rounded-full"
                      style={{
                        border: `1px solid ${theme.accent}33`,
                        background: `${theme.accent}18`,
                        boxShadow: `0 0 24px ${theme.accent}22`,
                      }}
                    />
                  )}

                  <span
                    className="relative z-10"
                    style={{
                      color: isActive
                        ? theme.accentMuted
                        : "rgba(255,255,255,0.68)",
                    }}
                  >
                    {item.label}
                  </span>
                </a>
              );
            })}
          </div>

          <div className="relative z-10 flex items-center gap-3 md:gap-4">
            <div className="hidden md:flex items-center rounded-full border border-white/10 bg-white/[0.05] p-1">
              <button
                onClick={() => setLanguage("en")}
                className="rounded-full px-3 py-1.5 text-[11px] font-bold tracking-[0.18em] transition-all"
                style={{
                  background:
                    language === "en" ? `${theme.accent}22` : "transparent",
                  color:
                    language === "en"
                      ? theme.accentMuted
                      : "rgba(255,255,255,0.45)",
                  boxShadow:
                    language === "en"
                      ? `inset 0 0 0 1px ${theme.accent}44`
                      : "none",
                }}
              >
                EN
              </button>

              <button
                onClick={() => setLanguage("jp")}
                className="rounded-full px-3 py-1.5 text-[11px] font-bold tracking-[0.18em] transition-all"
                style={{
                  background:
                    language === "jp" ? `${theme.accent}22` : "transparent",
                  color:
                    language === "jp"
                      ? theme.accentMuted
                      : "rgba(255,255,255,0.45)",
                  boxShadow:
                    language === "jp"
                      ? `inset 0 0 0 1px ${theme.accent}44`
                      : "none",
                }}
              >
                JP
              </button>
            </div>

            <a
              href="#contact"
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full p-[1px]"
              style={{
                background: `linear-gradient(135deg, ${theme.accent}88, rgba(255,255,255,0.10), ${theme.accent}44)`,
                boxShadow: `0 0 28px ${theme.accent}22`,
              }}
            >
              <span
                className="relative inline-flex h-full items-center justify-center rounded-full px-6 text-[12px] font-bold tracking-[0.12em] text-white backdrop-blur-xl transition-all duration-300"
                style={{
                  background: "rgba(3,10,18,0.78)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${theme.accent}22, transparent 65%)`,
                  }}
                />
                <span className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)] -translate-x-[140%] group-hover:translate-x-[140%] transition-transform duration-1000" />
                <span className="relative z-10">{t.nav.btn}</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

const ThemeDock = () => {
  const { heroTheme, setHeroTheme } = useAppContext();
  const { scrollY } = useScroll();

  const dockYRaw = useTransform(scrollY, [0, 1400], [110, 190]);
  const dockY = useSpring(dockYRaw, {
    stiffness: 120,
    damping: 22,
    mass: 0.5,
  });

  const items = [
    {
      id: "ocean",
      label: "Ocean",
      preview: ["#67e8f9", "#60a5fa", "#001933"],
      glow: "#67e8f9",
    },
    {
      id: "forest",
      label: "Forest",
      preview: ["#86efac", "#34d399", "#081711"],
      glow: "#86efac",
    },
    {
      id: "desert",
      label: "Desert",
      preview: ["#fde68a", "#fdba74", "#1f1208"],
      glow: "#fde68a",
    },
  ];

  return (
    <motion.div
      style={{ y: dockY }}
      className="hidden md:flex fixed left-4 lg:left-6 top-0 z-[96] flex-col gap-3"
    >
      <div className="rounded-[1.5rem] border border-white/10 bg-[#04131d]/60 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.28)] p-2">
        {items.map((item) => {
          const isActive = heroTheme === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setHeroTheme(item.id)}
              className="group relative w-full flex items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all duration-300"
              style={{
                background: isActive ? "rgba(255,255,255,0.07)" : "transparent",
                boxShadow: isActive
                  ? "inset 0 0 0 1px rgba(255,255,255,0.08)"
                  : "none",
                transform: isActive ? "translateX(4px)" : "translateX(0px)",
              }}
            >
              {/* B. glow bar */}
              <span
                className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: item.glow,
                  boxShadow: `0 0 24px ${item.glow}`,
                  opacity: isActive ? 1 : undefined,
                }}
              />

              {/* preview colors */}
              <div className="flex h-8 w-8 shrink-0 overflow-hidden rounded-xl border border-white/10">
                <span
                  className="w-1/3 h-full"
                  style={{ background: item.preview[0] }}
                />
                <span
                  className="w-1/3 h-full"
                  style={{ background: item.preview[1] }}
                />
                <span
                  className="w-1/3 h-full"
                  style={{ background: item.preview[2] }}
                />
              </div>

              <div className="flex flex-col">
                <span
                  className="text-[11px] font-bold uppercase tracking-[0.18em] transition-colors"
                  style={{
                    color: isActive
                      ? "rgba(255,255,255,0.95)"
                      : "rgba(255,255,255,0.55)",
                  }}
                >
                  {item.label}
                </span>

                <span
                  className="text-[10px] uppercase tracking-[0.14em]"
                  style={{
                    color: isActive
                      ? "rgba(255,255,255,0.42)"
                      : "rgba(255,255,255,0.28)",
                  }}
                >
                  Theme
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};

const Hero = () => {
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
};

const TechMarquee = () => {
  const { theme } = useAppContext();

  return (
    <div
      className="py-20 backdrop-blur-md overflow-hidden relative border-y border-white/10 flex flex-col gap-20"
      style={{ background: theme.sectionSurface }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-32 z-10"
        style={{
          background: `linear-gradient(to right, ${theme.sectionEdge}, transparent)`,
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-32 z-10"
        style={{
          background: `linear-gradient(to left, ${theme.sectionEdge}, transparent)`,
        }}
      />

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
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 transition-colors duration-300">
                <img
                  src={skill.icon}
                  alt={skill.name}
                  className={`w-7 h-7 object-contain opacity-70 group-hover:opacity-100 ${
                    skill.invert ? "invert brightness-0" : ""
                  }`}
                />
              </div>
              <span
                className="text-xl font-bold uppercase tracking-tight"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
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
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 transition-colors duration-300">
                <img
                  src={devtool.icon}
                  alt={devtool.name}
                  className={`w-7 h-7 object-contain opacity-70 group-hover:opacity-100 ${
                    devtool.invert ? "invert brightness-0" : ""
                  }`}
                />
              </div>
              <span
                className="text-xl font-bold uppercase tracking-tight"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {devtool.name}
              </span>
            </div>
          ))}
      </motion.div>
    </div>
  );
};

const About = () => {
  const { t, theme } = useAppContext();

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
          <h2
            className="font-mono mb-4 uppercase tracking-[0.5em] text-xs font-bold"
            style={{ color: theme.accent }}
          >
            {t.about.title}
          </h2>

          <h3 className="text-5xl md:text-6xl font-black mb-8 text-white tracking-tighter leading-tight">
            {t.about.headline_word1}{" "}
            <span style={{ color: theme.accent }}>
              {t.about.headline_word2}
            </span>
          </h3>

          <p
            className="text-blue-50 text-lg mb-10 leading-relaxed border-l-4 pl-8 opacity-80"
            style={{ borderColor: `${theme.accent}55` }}
          >
            {t.about.bio1}
          </p>

          <div className="flex gap-12 border-t border-white/10 pt-10">
            <div>
              <h4 className="text-5xl font-black text-white tracking-tighter">
                4+
              </h4>
              <p
                className="text-xs uppercase font-bold tracking-widest mt-2"
                style={{ color: theme.accent }}
              >
                Years Exp
              </p>
            </div>

            <div>
              <h4 className="text-5xl font-black text-white tracking-tighter">
                15+
              </h4>
              <p
                className="text-xs uppercase font-bold tracking-widest mt-2"
                style={{ color: theme.accent }}
              >
                Projects
              </p>
            </div>
          </div>
        </motion.div>

        <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/5] border border-white/10 shadow-2xl">
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
  const { t, theme } = useAppContext();
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
              <span
                style={{ color: theme.accent }}
                className="text-shadow-glow"
              >
                Works
              </span>
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
                  <span
                    className="font-mono text-sm tracking-[0.4em] uppercase font-bold"
                    style={{ color: theme.accent }}
                  >
                    {project.tag}
                  </span>

                  <h3 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-tight">
                    {project.title}
                  </h3>

                  <p
                    className="text-blue-50/70 leading-relaxed text-xl border-l-4 pl-8"
                    style={{ borderColor: `${theme.accent}33` }}
                  >
                    {project.desc}
                  </p>

                  <div className="flex gap-6 pt-4">
                    <button
                      onClick={() => setActiveProject(project)}
                      className="px-12 py-5 rounded-2xl font-black transition-all uppercase text-sm tracking-widest shadow-xl text-white"
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
                      Preview
                    </button>

                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="p-5 border rounded-2xl text-white transition-colors"
                      style={{
                        borderColor: "rgba(255,255,255,0.10)",
                        background: "rgba(255,255,255,0.02)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `${theme.accent}14`;
                        e.currentTarget.style.borderColor = `${theme.accent}44`;
                        e.currentTarget.style.color = theme.accentSoft;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.02)";
                        e.currentTarget.style.borderColor =
                          "rgba(255,255,255,0.10)";
                        e.currentTarget.style.color = "#ffffff";
                      }}
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
                className="absolute -top-16 right-0 text-white transition-colors"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = theme.accentSoft;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#ffffff";
                }}
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
  const { t, theme } = useAppContext();
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

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, transparent, ${theme.sectionEdge}26, ${theme.rootTo}66)`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at top, ${theme.accent}12, transparent 60%)`,
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6">
        <div className="flex justify-between items-end mb-16 px-2">
          <h2 className="text-5xl font-black text-white tracking-tighter">
            Projects
          </h2>

          <div className="flex gap-4">
            <button
              onClick={() => scroll("left")}
              className="p-4 border rounded-full text-white transition-all shadow-lg"
              style={{
                borderColor: "rgba(255,255,255,0.10)",
                background: "rgba(255,255,255,0.02)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme.buttonBg;
                e.currentTarget.style.borderColor = `${theme.accent}55`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
              }}
              aria-label="Scroll Left"
            >
              <ChevronLeft />
            </button>

            <button
              onClick={() => scroll("right")}
              className="p-4 border rounded-full text-white transition-all shadow-lg"
              style={{
                borderColor: "rgba(255,255,255,0.10)",
                background: "rgba(255,255,255,0.02)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme.buttonBg;
                e.currentTarget.style.borderColor = `${theme.accent}55`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
              }}
              aria-label="Scroll Right"
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="grid grid-rows-2 grid-flow-col gap-8 overflow-x-auto pb-8 no-scrollbar"
        >
          {PROJECTS.map((project, index) => {
            const projectText = t.projects.list[index];

            return (
              <motion.a
                key={project.id}
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.45 }}
                className="group relative w-[320px] md:w-[400px] rounded-[2rem] overflow-hidden border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-2xl flex flex-col h-full"
              >
                <div className="relative aspect-video overflow-hidden">
                  {project.video !== "null" ? (
                    <video
                      src={project.video}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={project.image}
                      alt={projectText.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  <span
                    className="absolute top-4 left-4 text-[10px] px-3 py-1.5 rounded-lg font-black uppercase tracking-widest"
                    style={{
                      color: theme.accentMuted,
                      border: `1px solid ${theme.accent}44`,
                      background: `${theme.accent}16`,
                    }}
                  >
                    {project.category}
                  </span>
                </div>

                <div className="p-6 md:p-7 flex flex-col flex-1 min-h-[240px]">
                  <h3 className="text-2xl font-black text-white tracking-tight mb-3 min-h-[72px]">
                    {projectText.title}
                  </h3>

                  <p className="text-blue-100/65 leading-relaxed text-sm md:text-base min-h-[72px]">
                    {projectText.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-6">
                    <span
                      className="text-[11px] font-bold uppercase tracking-[0.2em]"
                      style={{ color: theme.accent }}
                    >
                      View Project
                    </span>

                    <div className="flex items-center gap-3">
                      <span
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full border text-white transition-all"
                        style={{
                          borderColor: `${theme.accent}44`,
                          background: `${theme.accent}10`,
                        }}
                      >
                        <ExternalLink size={18} />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const { t, theme } = useAppContext();
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
            <span style={{ color: theme.accent }} className="text-shadow-glow">
              In
            </span>
          </h2>

          <p
            className="text-xl font-medium"
            style={{ color: "rgba(219,234,254,0.40)" }}
          >
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-16">
          <div className="space-y-12">
            <div>
              <h4
                className="font-mono text-xs uppercase tracking-widest mb-4 font-black"
                style={{ color: theme.accent }}
              >
                Message me
              </h4>

              <a
                href="mailto:hal.chung.chingyan.2025@gmail.com"
                className="text-xl font-bold transition-colors break-words"
                style={{ color: "#ffffff" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = theme.accentSoft;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#ffffff";
                }}
              >
                hal.chung.chingyan.2025@gmail.com
              </a>
            </div>

            <div>
              <h4
                className="font-mono text-xs uppercase tracking-widest mb-4 font-black"
                style={{ color: theme.accent }}
              >
                Socials
              </h4>

              <a
                href="https://github.com/WillYan0224"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center w-12 h-12 rounded-2xl transition-all"
                style={{
                  color: "#ffffff",
                  border: `1px solid ${theme.accent}33`,
                  background: `${theme.accent}10`,
                  boxShadow: `0 0 18px ${theme.accent}18`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = theme.accentSoft;
                  e.currentTarget.style.background = `${theme.accent}18`;
                  e.currentTarget.style.boxShadow = `0 0 24px ${theme.accent}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#ffffff";
                  e.currentTarget.style.background = `${theme.accent}10`;
                  e.currentTarget.style.boxShadow = `0 0 18px ${theme.accent}18`;
                }}
              >
                <Github size={24} />
              </a>
            </div>
          </div>

          <div
            className="md:col-span-2 p-10 md:p-16 rounded-[3rem] border border-white/10 backdrop-blur-2xl shadow-2xl"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <form ref={form} onSubmit={sendEmail} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <input
                  required
                  name="user_name"
                  placeholder={t.contact.name}
                  className="w-full bg-white/5 border-b p-4 focus:outline-none text-white text-lg transition-colors placeholder:text-white/20"
                  style={{ borderColor: `${theme.accent}44` }}
                />

                <input
                  required
                  name="user_email"
                  type="email"
                  placeholder={t.contact.email}
                  className="w-full bg-white/5 border-b p-4 focus:outline-none text-white text-lg transition-colors placeholder:text-white/20"
                  style={{ borderColor: `${theme.accent}44` }}
                />
              </div>

              <textarea
                required
                name="message"
                rows="4"
                placeholder="Briefly describe your idea."
                className="w-full bg-white/5 border-b p-4 focus:outline-none text-white text-lg transition-colors placeholder:text-white/20"
                style={{ borderColor: `${theme.accent}44` }}
              />

              <button
                className="w-full text-white font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-widest"
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
  const [heroTheme, setHeroTheme] = useState("ocean");

  const t = TRANSLATIONS[language];
  const theme = THEME_PRESETS[heroTheme];

  return (
    <AppContext.Provider
      value={{ language, setLanguage, t, heroTheme, setHeroTheme, theme }}
    >
      <div
        className="min-h-screen text-white selection:text-black"
        style={{
          background: `linear-gradient(to bottom, ${theme.rootFrom}, ${theme.rootTo})`,
          ["--selectionColor"]: theme.accent,
        }}
      >
        <Navbar />
        <ThemeDock />
        <main className="relative z-10">
          <Hero />
          <TechMarquee />
          <About />
          <FeaturedProjects />
          <ProjectList />
          <Contact />

          <footer
            className="py-16 text-center text-xs border-t border-white/5 backdrop-blur-md"
            style={{
              color: "rgba(255,255,255,0.22)",
              background: "rgba(0,0,0,0.28)",
            }}
          >
            © {new Date().getFullYear()} Yan. Deep Dive Graphics Portfolio.
          </footer>
        </main>
      </div>
    </AppContext.Provider>
  );
}

export default App;
