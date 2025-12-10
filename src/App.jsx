import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  createContext,
  useContext,
} from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, ContactShadows, Edges } from "@react-three/drei";
import * as THREE from "three";
import {
  Github,
  Linkedin,
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight,
  Play, // Added Play just in case, though not used in new video card
} from "lucide-react";
import emailjs from "@emailjs/browser";

// --- 1. CONTEXT SETUP ---
const LanguageContext = createContext();
const useLanguage = () => useContext(LanguageContext);

// --- 2. DATA CONSTANTS ---
import { SKILLS_DATA, DEVTOOL_DATA } from "./data/skills";
import { PROJECTS } from "./data/porjects";
import { TRANSLATIONS } from "./data/translations";
// ** ADDED MISSING PROJECTS DATA **

// --- COMPONENTS ---

// 1. Navigation
const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  return (
    <nav className="sticky top-0 w-full p-6 flex justify-between items-center z-50 bg-black/20 backdrop-blur-md text-white">
      <div className="text-2xl font-bold tracking-tighter">PORTFOLIO.</div>
      <div className="hidden md:flex gap-8 font-medium items-center">
        <a href="#work" className="hover:text-primary transition-colors">
          {t.nav.work}
        </a>
        <a href="#about" className="hover:text-primary transition-colors">
          {t.nav.about}
        </a>
        <a href="#contact" className="hover:text-primary transition-colors">
          {t.nav.contact}
        </a>
      </div>
      <div className="hidden md:flex items-center gap-6">
        <div className="flex items-center gap-2 border-l border-white/20 pl-6 ml-2">
          <button
            onClick={() => setLanguage("en")}
            className={`text-sm font-bold transition-colors ${
              language === "en"
                ? "text-white"
                : "text-gray-500 hover:text-white"
            }`}
          >
            EN
          </button>
          <span className="text-gray-600">|</span>
          <button
            onClick={() => setLanguage("jp")}
            className={`text-sm font-bold transition-colors ${
              language === "jp"
                ? "text-white"
                : "text-gray-500 hover:text-white"
            }`}
          >
            JP
          </button>
        </div>
        <a
          href="#contact"
          className="relative hidden md:inline-flex h-12 overflow-hidden rounded-full p-[2px] focus:outline-none group"
        >
          <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#6366f1_0%,#a855f7_50%,#6366f1_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-black/90 px-6 py-1 text-sm font-bold text-white backdrop-blur-3xl transition-colors group-hover:bg-zinc-900 group-hover:text-primary">
            {t.nav.btn}
          </span>
        </a>
      </div>
    </nav>
  );
};

// --- 3D Components ---
// --- Optimized Floating Shape ---
// moved geometry creation outside to prevent re-calculation
const circleGeo = new THREE.CircleGeometry(0.5, 3);
const tetraGeo = new THREE.TetrahedronGeometry(0.6, 0);
const octaGeo = new THREE.OctahedronGeometry(0.5, 0);
const dodecaGeo = new THREE.DodecahedronGeometry(0.5, 0);

const FloatingShape = ({ position, color, speed, type }) => {
  const meshRef = useRef();

  // Use a lighter rotation logic
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotate slower to reduce visual jitter
      meshRef.current.rotation.x += delta * speed * 0.8;
      meshRef.current.rotation.y += delta * speed * 0.8;
    }
  });

  // Select geometry from pre-created instances
  let geometry;
  if (type === 0) geometry = circleGeo;
  else if (type === 1) geometry = tetraGeo;
  else if (type === 2) geometry = octaGeo;
  else geometry = dodecaGeo;

  return (
    <Float
      speed={2}
      rotationIntensity={1}
      floatIntensity={1.5} // Reduced intensity slightly
      floatingRange={[-0.2, 0.2]} // Reduced range to keep them closer
    >
      <mesh ref={meshRef} position={position} geometry={geometry}>
        {/* Simplified Material: Lower roughness, remove metalness calculation */}
        <meshStandardMaterial
          color="#050505"
          transparent={false}
          opacity={1}
          roughness={0.1}
          side={THREE.DoubleSide}
        />

        {/* Optimized Edges: Lower threshold means less lines to calculate */}
        <Edges scale={1.02} threshold={15} color={color}>
          <meshBasicMaterial transparent opacity={1} side={THREE.DoubleSide} />
        </Edges>
      </mesh>
    </Float>
  );
};

// --- Optimized Background Manager ---
const GeometricBackground = () => {
  const shapes = useMemo(() => {
    // Reduced count from 40 to 20 for better performance
    return new Array(20).fill(0).map(() => ({
      position: [
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
      ],
      type: Math.floor(Math.random() * 4),
      color:
        Math.random() > 0.5
          ? "#6366f1"
          : Math.random() > 0.5
          ? "#a855f7"
          : "#ffffff",
      speed: Math.random() * 0.5 + 0.2,
    }));
  }, []);

  return (
    <group>
      {shapes.map((shape, i) => (
        <FloatingShape key={i} {...shape} />
      ))}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
    </group>
  );
};

// --- Optimized Hero Component ---
const Hero = () => {
  const { t } = useLanguage();
  const [roleIndex, setRoleIndex] = useState(0);
  const ROLES = t.hero.roles;

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [ROLES]);

  return (
    <section className="h-screen w-full relative overflow-hidden bg-black flex flex-col justify-center px-6 md:px-20">
      <div className="absolute inset-0 z-0">
        {/* 
           PERFORMANCE SETTINGS:
           1. dpr={[1, 1.5]}: Caps resolution on retina screens. Huge FPS booster.
           2. antialias: false: Makes edges slightly jagged but much faster.
           3. performance={{ min: 0.5 }}: Automatically lowers quality if FPS drops.
        */}
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 8], fov: 50 }}
          gl={{ antialias: false, powerPreference: "high-performance" }}
        >
          <fog attach="fog" args={["#000000", 5, 20]} />
          <GeometricBackground />
        </Canvas>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 max-w-5xl pointer-events-none"
      >
        <div className="pointer-events-auto backdrop-blur-sm bg-black/30 border border-white/5 p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

          <h2 className="text-xl md:text-2xl text-primary font-mono mb-6 flex items-center gap-2">
            <span>{t.hero.greeting}</span>
            <div className="relative ml-2 h-8 w-64 flex items-center ">
              <AnimatePresence mode="wait">
                <motion.span
                  key={ROLES[roleIndex]}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute font-bold text-white block whitespace-nowrap"
                >
                  {ROLES[roleIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </h2>

          <h1 className="text-5xl md:text-8xl font-bold leading-tight mb-6">
            {t.hero.title_start}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              {t.hero.title_highlight}
            </span>{" "}
            {t.hero.title_end}
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-8">
            {t.hero.desc}
          </p>

          <div className="flex gap-4">
            <a
              href="#work"
              className="relative inline-flex h-14 overflow-hidden rounded-lg p-[2px] focus:outline-none group"
            >
              <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#6366f1_0%,#a855f7_50%,#6366f1_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-black/90 px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl transition-colors group-hover:bg-zinc-900 group-hover:text-primary">
                {t.hero.cta}
              </span>
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
// 3. Tech Marquee
const TechMarquee = () => {
  return (
    <div className="py-20 bg-zinc-900 overflow-hidden relative border-y border-white/5 flex flex-col gap-20">
      {/* Side Fade Gradients (Covers both rows) */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-zinc-900 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-zinc-900 to-transparent z-10" />

      {/* --- ROW 1: Scrolling LEFT --- */}
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: [0, -1035] }} // -1035 is approx width of one set of data. Adjust if gap changes.
        transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
      >
        {/* Repeating 4 times to ensure no gaps on wide screens */}
        {[...SKILLS_DATA, ...SKILLS_DATA, ...SKILLS_DATA, ...SKILLS_DATA].map(
          (skill, index) => (
            <div
              key={`row1-${index}`}
              className="mx-4 flex items-center gap-4 group cursor-default"
            >
              <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center border border-white/5 group-hover:border-primary/50 group-hover:bg-zinc-800/80 transition-colors duration-300">
                <img
                  src={skill.icon}
                  alt={skill.name}
                  className={`w-7 h-7 object-contain ${
                    skill.invert ? "invert brightness-0" : ""
                  }`}
                />
              </div>
              <span className="text-xl font-bold text-zinc-500 group-hover:text-white transition-colors uppercase tracking-tight">
                {skill.name}
              </span>
            </div>
          )
        )}
      </motion.div>

      {/* --- ROW 2: Scrolling RIGHT --- */}
      <motion.div
        className="flex whitespace-nowrap"
        initial={{ x: -1035 }}
        animate={{ x: [-1035, 0] }} // Moves from left to right
        transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
      >
        {/* We reverse the data here so the order looks different than the top row */}
        {[...DEVTOOL_DATA, ...DEVTOOL_DATA, ...DEVTOOL_DATA, ...DEVTOOL_DATA]
          .reverse()
          .map((devtool, index) => (
            <div
              key={`row2-${index}`}
              className="mx-4 flex items-center gap-4 group cursor-default"
            >
              <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center border border-white/5 group-hover:border-secondary/50 group-hover:bg-zinc-800/80 transition-colors duration-300">
                <img
                  src={devtool.icon}
                  alt={devtool.name}
                  className={`w-7 h-7 object-contain ${
                    devtool.invert ? "invert brightness-0" : ""
                  }`}
                />
              </div>
              <span className="text-xl font-bold text-zinc-500 group-hover:text-white transition-colors uppercase tracking-tight">
                {devtool.name}
              </span>
            </div>
          ))}
      </motion.div>
    </div>
  );
};

// 4. Separator
const SectionSeparator = () => {
  const { t } = useLanguage();
  return (
    <section className="py-12 bg-zinc-950 flex flex-col items-center justify-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-primary to-transparent mx-auto mb-8 opacity-50" />
        <span className="text-primary/90 font-mono text-3xl tracking-[0.3em] uppercase mb-3 block">
          {t.separator.subtitle}
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
          {t.separator.title}
        </h2>
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary via-transparent to-transparent mx-auto mt-8 opacity-20" />
      </motion.div>
    </section>
  );
};

// 5. About
const About = () => {
  const { t } = useLanguage();
  return (
    <section id="about" className="py-24 px-6 md:px-20 bg-zinc-900/30">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-primary font-mono mb-4">{t.about.title}</h2>
          <h3 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {t.about.headline_start}{" "}
            <span className="  font-bold">{t.about.headline_design}</span>{" "}
            {t.about.headline_suffix && <span>と</span>}{" "}
            <span className="text-secondary font-bold ">
              {t.about.headline_eng}
            </span>{" "}
            {t.about.headline_suffix}
          </h3>
          <div className="mb-8 border-l-4 border-primary pl-6 py-2">
            <p className="text-2xl italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              "{t.about.catchphrase}"
            </p>
          </div>
          <p className="text-gray-400 text-lg mb-6 leading-relaxed">
            {t.about.bio1}
          </p>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            {t.about.bio2}
          </p>
          <div className="flex gap-8 border-t border-white/10 pt-8">
            <div>
              <h4 className="text-3xl font-bold text-white">3+</h4>
              <p className="text-sm text-gray-500 uppercase tracking-wider">
                {t.about.stats.exp}
              </p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-white">50+</h4>
              <p className="text-sm text-gray-500 uppercase tracking-wider">
                {t.about.stats.proj}
              </p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-white">100%</h4>
              <p className="text-sm text-gray-500 uppercase tracking-wider">
                {t.about.stats.commit}
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
          <div className="relative rounded-2xl overflow-hidden aspect-[4/5] border border-white/10">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000"
              alt="Profile"
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// 6. Featured Project
const FeaturedProject = () => {
  const { t } = useLanguage(); // <--- Added translation support
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef(null);

  const openModal = () => {
    setIsOpen(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }, 0);
  };

  const closeModal = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsOpen(false);
  };

  return (
    <>
      <section id="work" className="py-24 px-6 md:px-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h3 className="text-primary font-mono mb-2">{t.featured.tag}</h3>
            <h2 className="text-4xl md:text-5xl font-bold">
              {t.featured.title}
            </h2>
          </div>
          <p className="text-gray-400 max-w-md mt-4 md:mt-0">
            {t.featured.desc}
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.5 }}
          className="relative aspect-video bg-zinc-800 rounded-2xl overflow-hidden group border border-white/10 shadow-2xl"
        >
          <video
            className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700 ease-out"
            autoPlay
            muted
            loop
            playsInline
          >
            {/* Note: Ensure this file path is correct in your public/videos folder */}
            <source src="/videos/hero.mp4" type="video/mp4" />
            {/* Fallback to online video if local file missing */}
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-blue-columns-height-changing-98-large.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <span className="inline-block py-1 px-3 rounded bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4 border border-primary/20">
                WebGL / Three.js
              </span>
              <h3 className="text-3xl md:text-5xl font-bold mb-4 text-white">
                Neon Cyber Dashboard
              </h3>
              <p className="text-gray-300 mb-8 max-w-xl text-lg leading-relaxed">
                A futuristic dashboard built with React and Three.js, featuring
                real-time data visualization, WebGL acceleration, and immersive
                3D interactions.
              </p>
              <button
                onClick={openModal}
                className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition-all duration-300"
              >
                {t.featured.btn} <ExternalLink size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="relative w-full max-w-5xl aspect-video"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute -top-10 right-0 text-white/70 hover:text-white"
              >
                <X size={28} />
              </button>
              <video
                ref={videoRef}
                className="w-full h-full rounded-xl shadow-2xl"
                controls
                autoPlay
                muted
                playsInline
              >
                {/* Ensure this path is correct */}
                <source src="/videos/hero.mp4" type="video/mp4" />
                <source
                  src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-blue-columns-height-changing-98-large.mp4"
                  type="video/mp4"
                />
              </video>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// 7. Project List
const ProjectList = () => {
  const { t } = useLanguage();
  const scrollContainerRef = useRef(null);

  // Card dimensions for calculation (Width + Gap)
  // Desktop: 380px width + 24px gap = 404px per unit
  // Mobile: 300px width + 24px gap = 324px per unit
  const getItemWidth = () => {
    return window.innerWidth >= 768 ? 404 : 324;
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      // Scroll by 2 units
      const scrollAmount = getItemWidth() * 2;

      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <section className="py-24 bg-zinc-950 flex justify-center">
      {/* Squeezed Container */}
      <div className="min-width px-4">
        {/* Header */}
        <div className="flex justify-between items-end mb-8 px-2">
          <h2 className="text-4xl font-bold">{t.projects.title}</h2>
          <div className="hidden md:block text-gray-500 text-sm font-mono">
            {PROJECTS.length} PROJECTS
          </div>
        </div>

        {/* --- Layout Container: [Button] [ScrollArea] [Button] --- */}
        <div className="flex items-center gap-4">
          {/* Left Button (Static Position) */}
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex flex-shrink-0 p-3 rounded-full bg-zinc-800 border border-white/10 text-white hover:bg-primary hover:scale-110 transition-all shadow-xl z-10"
            aria-label="Scroll Left"
          >
            <ChevronLeft size={24} />
          </button>

          {/* 
             2-Row Grid Container 
             - grid-rows-2: Forces 2 rows height
             - grid-flow-col: Fills Top-Down, then moves Right (Horizontal Scroll)
             - overflow-x-auto: Enables scrolling
          */}
          <div
            ref={scrollContainerRef}
            className="grid grid-rows-2 grid-flow-col gap-6 overflow-x-auto pb-4 scroll-smooth no-scrollbar w-full"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {PROJECTS.map((project, index) => {
              const translatedProject = t.projects.list[index];

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                  // Fixed Width is required for horizontal grid flow
                  className="w-[300px] md:w-[380px] group/card"
                >
                  {/* Image Card */}
                  <div className="relative aspect-[16/9] overflow-hidden rounded-xl mb-3 border border-white/5 bg-zinc-900">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white text-black rounded-full hover:bg-primary hover:text-white transition-colors"
                      >
                        <ExternalLink size={20} />
                      </a>
                      <a
                        href={project.gitUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white text-black rounded-full hover:bg-primary hover:text-white transition-colors"
                      >
                        <Github size={20} />
                      </a>
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="flex justify-between items-start px-1">
                    <div>
                      <h3 className="text-lg font-bold group-hover/card:text-primary transition-colors">
                        {translatedProject.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                        {translatedProject.description}
                      </p>
                    </div>
                    {/* Category Badge */}
                    <span className="text-[10px] font-bold tracking-wider border border-white/10 bg-white/5 px-2 py-1 rounded text-gray-400 uppercase whitespace-nowrap ml-3">
                      {project.category}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Button (Static Position) */}
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex flex-shrink-0 p-3 rounded-full bg-zinc-800 border border-white/10 text-white hover:bg-primary hover:scale-110 transition-all shadow-xl z-10"
            aria-label="Scroll Right"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Hide Scrollbar Style */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

// 8. Contact
const Contact = () => {
  const { t } = useLanguage(); // <--- Use translations
  const form = useRef();
  const [status, setStatus] = useState("");

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus("sending");
    // emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form.current, 'YOUR_PUBLIC_KEY')
    setTimeout(() => {
      setStatus("success");
      e.target.reset();
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 px-6 md:px-20 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            {t.contact.title}
          </h2>
          <p className="text-xl text-gray-400">{t.contact.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-1 space-y-8">
            <div>
              <h4 className="text-gray-400 font-mono mb-2">Email</h4>
              <a
                href="mailto:hello@example.com"
                className="text-xl hover:text-primary transition-colors"
              >
                hello@example.com
              </a>
            </div>
            <div>
              <h4 className="text-gray-400 font-mono mb-2">Socials</h4>
              <div className="flex gap-4">
                <a href="#" className="hover:text-primary transition-colors">
                  LinkedIn
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  Twitter
                </a>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 bg-zinc-900 p-8 rounded-2xl border border-white/5">
            <form ref={form} onSubmit={sendEmail} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">
                    {t.contact.name}
                  </label>
                  <input
                    required
                    name="user_name"
                    type="text"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 focus:outline-none focus:border-primary transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">
                    {t.contact.email}
                  </label>
                  <input
                    required
                    name="user_email"
                    type="email"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 focus:outline-none focus:border-primary transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">
                  {t.contact.message}
                </label>
                <textarea
                  required
                  name="message"
                  rows="4"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Tell me about your project..."
                />
              </div>
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                {status === "sending"
                  ? t.contact.btn_sending
                  : status === "success"
                  ? t.contact.btn_sent
                  : t.contact.btn_send}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="py-8 text-center text-gray-500 text-sm border-t border-white/10">
    <p>© {new Date().getFullYear()} Your Name. All rights reserved.</p>
  </footer>
);

// --- MAIN APP (FIXED) ---
function App() {
  const [language, setLanguage] = useState("en"); // 1. Define State
  const t = TRANSLATIONS[language]; // 2. Derive translations

  return (
    // 3. Wrap everything in Provider
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div className="min-h-screen bg-dark text-white selection:bg-primary selection:text-white">
        <Navbar />
        <Hero />
        <TechMarquee />
        <SectionSeparator />
        <About />
        <FeaturedProject />
        <ProjectList />
        <Contact />
        <Footer />
      </div>
    </LanguageContext.Provider>
  );
}

export default App;
