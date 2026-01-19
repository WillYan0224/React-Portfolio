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
  useMotionValue,
  useSpring,
} from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, ContactShadows, Edges } from "@react-three/drei";
import * as THREE from "three";
import {
  Github,
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight,
  Play, // Added Play just in case, though not used in new video card
  Cpu,
  Terminal,
  Layers,
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
    <nav className="sticky top-0 w-full p-6 grid grid-cols-3 items-center z-50 bg-black/20 backdrop-blur-md text-white">
      {/* Left */}
      <div className="justify-self-start text-2xl font-bold tracking-tighter">
        PORTFOLIO.
      </div>

      {/* Center */}
      <div className="justify-self-center hidden md:flex gap-8 font-medium items-center">
        <a href="#about" className="hover:text-primary transition-colors">
          {t.nav.about}
        </a>
        <a href="#work" className="hover:text-primary transition-colors">
          {t.nav.work}
        </a>
        <a href="#contact" className="hover:text-primary transition-colors">
          {t.nav.contact}
        </a>
      </div>

      {/* Right */}
      <div className="justify-self-end hidden md:flex items-center gap-6">
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
          <span
            className="
        relative inline-flex h-full w-full items-center justify-center
        overflow-hidden rounded-full bg-black/90 px-8 py-1
        text-sm font-medium text-white backdrop-blur-3xl
        transition-colors duration-500 ease-out
        group-hover:text-white
      "
          >
            {/* Glow wipe */}
            <span
              className="
          absolute inset-0
          -translate-x-full group-hover:translate-x-0
          transition-transform duration-700 ease-out
          opacity-60
          bg-[conic-gradient(from_90deg_at_50%_50%,#6366f1_0%,#a855f7_50%,#6366f1_100%)]
          blur-lg
        "
            />
            <span className="relative z-10">{t.nav.btn}</span>
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
        className="z-10 max-w-[52rem] pointer-events-none"
      >
        <div className="pointer-events-auto backdrop-blur-sm bg-black/30 border border-white/5 p-8 md:p-4 rounded-3xl shadow-2xl relative overflow-hidden">
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary neon-gradient-text">
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
              {/* Inner layer */}
              <span
                className="
        relative inline-flex h-full w-full items-center justify-center
        overflow-hidden rounded-lg bg-black/90 px-8 py-1
        text-sm font-medium text-white backdrop-blur-3xl
        transition-colors duration-500 ease-out
        group-hover:text-white
      "
              >
                {/* Glow wipe */}
                <span
                  className="
          absolute inset-0
          -translate-x-full group-hover:translate-x-0
          transition-transform duration-700 ease-out
          opacity-60
          bg-[conic-gradient(from_90deg_at_50%_50%,#6366f1_0%,#a855f7_50%,#6366f1_100%)]
          blur-lg
        "
                />

                <span className="relative z-10">{t.hero.cta}</span>
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
        animate={{ x: [0, -1035] }} // -1035 is approx width of one set of data. Adjust this if gap changes.
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
          ),
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
        <span className="text-primary/90 font-mono text-4xl tracking-[0.3em] uppercase mb-3 block">
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
          className="max-w-xl"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-primary font-mono mb-4">{t.about.title}</h2>

          {/* Headline */}
          <h3 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {t.about.headline_prefix && (
              <span className="block mb-1">{t.about.headline_prefix}</span>
            )}
            <span className="block">
              <span className="text-primary">{t.about.headline_word1}</span>
              <span className="text-4xl mx-2">
                {t.about.headline_connector}
              </span>
              <span className="text-secondary">{t.about.headline_word2}</span>
              {t.about.headline_suffix && (
                <span> {t.about.headline_suffix}</span>
              )}
            </span>
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

          {/* Stats Row */}
          <div className="flex gap-8 border-t border-white/10 pt-8 mb-8">
            <div>
              <h4 className="text-3xl font-bold text-white">4+</h4>
              <p className="text-sm text-gray-500 uppercase tracking-wider">
                {t.about.stats.exp}
              </p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-white">15+</h4>
              <p className="text-sm text-gray-500 uppercase tracking-wider">
                {t.about.stats.proj}
              </p>
            </div>
          </div>

          {/* --- TAGS AREA --- */}
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-mono text-gray-500 mb-3 uppercase tracking-widest">
                Focus
              </h4>
              <div className="flex flex-wrap gap-3">
                {t.about.tags &&
                  t.about.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-gray-300 hover:border-primary hover:text-white hover:bg-primary/10 transition-all cursor-default"
                    >
                      {tag}
                    </span>
                  ))}
              </div>
            </div>

            {/* Hobbies / Interests */}
            <div>
              <h4 className="text-xs font-mono text-gray-500 mb-3 uppercase tracking-widest">
                {t.about.hobbies.title}
              </h4>
              <div className="flex flex-wrap gap-3">
                {t.about.hobbies.list &&
                  t.about.hobbies.list.map((hobby, index) => (
                    <span
                      key={index}
                      className="px-4 py-1.5 rounded-full border border-white/5 bg-zinc-800/50 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-default"
                    >
                      {hobby}
                    </span>
                  ))}
              </div>
            </div>
          </div>
          {/* ----------------- */}
        </motion.div>

        {/* Right Side Image */}
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
              src="/photos/HKport_001.jpg"
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out"
              loading="lazy"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// 6. Featured Project
// --- Sub-component for the 3D Tilt Effect ---
const TiltCard = ({ children }) => {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="w-full md:w-3/5 group relative"
    >
      {children}
    </motion.div>
  );
};

const FeaturedProjects = () => {
  const { t } = useLanguage();
  const [activeProject, setActiveProject] = useState(null);
  const modalVideoRef = useRef(null);

  const PROJECT_TITLE_STYLES = {
    gold: "text-[#F5C77A] drop-shadow-[0_0_15px_rgba(245,199,122,0.3)]",
    rose: "text-rose-400 drop-shadow-[0_0_15px_rgba(251,113,133,0.3)]",
    blue: "text-sky-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]",
    violet: "text-violet-400 drop-shadow-[0_0_15px_rgba(167,139,250,0.3)]",
  };

  const openModal = (project) => {
    setActiveProject(project);
    // Auto-play modal video when it opens
    setTimeout(() => {
      if (modalVideoRef.current) {
        modalVideoRef.current
          .play()
          .catch((err) => console.error("Video play failed:", err));
      }
    }, 100);
  };

  const closeModal = () => {
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
    }
    setActiveProject(null);
  };

  return (
    <>
      <section
        id="work"
        className="py-32 px-6 md:px-20 bg-black relative overflow-hidden"
      >
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="max-w-6xl mx-auto mb-28 relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="h-[1px] w-12 bg-primary" />
            <span className="text-primary font-mono text-sm tracking-[0.4em] uppercase">
              {t.featured_tag}
            </span>
          </motion.div>
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase">
            Featured <span className="text-zinc-800 italic">Systems</span>
          </h2>
        </div>

        <div className="max-w-6xl mx-auto space-y-48 md:space-y-64">
          {t.featured.map((project, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={index}
                className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-12 md:gap-20`}
              >
                <TiltCard>
                  {/* --- LOOPING TRACE LINE --- */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-30 opacity-60">
                    <motion.rect
                      x="0"
                      y="0"
                      width="100%"
                      height="100%"
                      rx="12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      className={
                        PROJECT_TITLE_STYLES[project.theme] || "text-white"
                      }
                      initial={{ pathLength: 0.18, pathOffset: 0 }}
                      animate={{ pathOffset: 1 }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </svg>

                  <div
                    onClick={() => openModal(project)}
                    className="relative aspect-video rounded-xl overflow-hidden border border-white/5 bg-zinc-950 shadow-2xl cursor-pointer"
                  >
                    <video
                      className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                      autoPlay
                      muted
                      loop
                      playsInline
                    >
                      <source src={project.video} type="video/mp4" />
                    </video>

                    <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1 rounded font-mono text-[10px] text-primary">
                        DATA_FLOW_0{index + 1}
                      </div>
                    </div>

                    <motion.div
                      className="absolute inset-0 z-20 pointer-events-none"
                      initial={{ x: "-100%", skewX: -20 }}
                      whileHover={{ x: "200%" }}
                      transition={{ duration: 0.8, ease: "circOut" }}
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                      }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="p-6 rounded-full bg-white text-black shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                        <Play fill="currentColor" size={28} />
                      </div>
                    </div>
                  </div>
                </TiltCard>

                <div className="w-full md:w-2/5 space-y-8 text-left">
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 rounded bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                      {project.tag}
                    </span>
                    <div className="h-[1px] flex-grow bg-white/10" />
                  </div>
                  <h3
                    className={`text-4xl md:text-5xl font-bold tracking-tighter leading-tight ${PROJECT_TITLE_STYLES[project.theme] || "text-white"}`}
                  >
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-lg leading-relaxed font-light border-l border-white/10 pl-6">
                    {project.desc}
                  </p>

                  <div className="flex items-center gap-5 pt-4">
                    <button
                      onClick={() => openModal(project)}
                      className="group relative flex items-center gap-4 bg-white text-black px-10 py-5 rounded-full font-bold text-sm overflow-hidden"
                    >
                      <span className="relative z-10 uppercase tracking-widest">
                        {project.btn}
                      </span>
                      <motion.div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-5 bg-zinc-950 border border-white/10 rounded-full text-white hover:border-primary transition-all hover:scale-110"
                    >
                      <Github size={24} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- MODAL (MAKE SURE THIS IS HERE) --- */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="relative w-full max-w-7xl aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/10"
              initial={{ scale: 0.9, opacity: 0, rotateX: 10 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-8 right-8 z-[1000] p-4 bg-black/50 hover:bg-white/10 rounded-full text-white transition-all hover:rotate-90 duration-300"
              >
                <X size={28} />
              </button>
              <video
                ref={modalVideoRef}
                className="w-full h-full"
                controls
                autoPlay
                playsInline
              >
                <source src={activeProject.modalVideo} type="video/mp4" />
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

  // Card dimensions logic
  // Desktop: 380px width + 24px gap = 404px per unit
  // Mobile: 300px width + 24px gap = 324px per unit
  const getItemWidth = () => {
    return window.innerWidth >= 768 ? 404 : 324;
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      // CHANGE: Scroll by 3 units (Full "Page" of 3 columns)
      const scrollAmount = getItemWidth() * 3;

      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <section className="py-24 bg-zinc-950 flex justify-center">
      {/* 
        Constraint Container 
        max-w-[1250px] is calculated to fit exactly 3 cards + gaps (approx 1200px).
        This prevents a 4th column from ever appearing, forcing the 7th item to overflow.
      */}
      <div className="w-full max-w-[1350px] px-4">
        {/* Header */}
        <div className="flex justify-between items-end mb-8 px-2">
          <h2 className="text-4xl font-bold">{t.projects.title}</h2>
          <div className="hidden md:block text-gray-500 text-sm font-mono">
            {PROJECTS.length} PROJECTS
          </div>
        </div>

        {/* --- Layout Container --- */}
        <div className="flex items-center gap-4">
          {/* Left Button */}
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex flex-shrink-0 p-3 rounded-full bg-zinc-800 border border-white/10 text-white hover:bg-primary hover:scale-110 transition-all shadow-xl z-10"
            aria-label="Scroll Left"
          >
            <ChevronLeft size={24} />
          </button>

          {/* 
             Grid Container 
             - snap-x snap-mandatory: Forces items to align perfectly when scrolling stops
          */}
          <div
            ref={scrollContainerRef}
            className="grid grid-rows-2 grid-flow-col gap-6 overflow-x-auto pb-4 scroll-smooth no-scrollbar w-full snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {PROJECTS.map((project, index) => {
              const translatedProject =
                t.projects.list[index] || t.projects.list[0]; // Fallback if translation missing for new item

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                  // snap-start: Ensures this card snaps to the left edge
                  className="w-[300px] md:w-[380px] group/card snap-start"
                >
                  {/* Image/Video Card */}
                  <div className="relative aspect-[16/9] overflow-hidden rounded-xl mb-3 border border-white/5 bg-zinc-900">
                    <video
                      src={project.video}
                      poster={project.image}
                      className="w-full h-full object-cover opacity-80 group-hover/card:scale-110 group-hover/card:opacity-100 transition-all duration-700 ease-out"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />

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
                        {translatedProject?.title || project.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {translatedProject?.description || project.description}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold tracking-wider border border-white/10 bg-white/5 px-2 py-1 rounded text-gray-400 uppercase whitespace-nowrap ml-3">
                      {project.category}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Button */}
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex flex-shrink-0 p-3 rounded-full bg-zinc-800 border border-white/10 text-white hover:bg-primary hover:scale-110 transition-all shadow-xl z-10"
            aria-label="Scroll Right"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

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
  const { t } = useLanguage();
  const form = useRef();
  const [status, setStatus] = useState(""); // 'sending', 'success', 'error'

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus("sending");

    // REPLACE THESE VALUES WITH YOUR ACTUAL EMAILJS KEYS
    const SERVICE_ID = import.meta.env.VITE_SERVICE_ID;
    const TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID;
    const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY;

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY).then(
      (result) => {
        console.log(result.text);
        setStatus("success");
        e.target.reset(); // Clear the form

        // Reset button text after 3 seconds
        setTimeout(() => setStatus(""), 3000);
      },
      (error) => {
        console.log(error.text);
        setStatus("error");

        // Reset button text after 3 seconds
        setTimeout(() => setStatus(""), 3000);
      },
    );
  };

  return (
    <section id="contact" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            {t.contact.title}
          </h2>
          <p className="text-xl text-gray-400">{t.contact.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Left Column: Contact Details */}
          <div className="md:col-span-1 space-y-8">
            <div>
              <h4 className="text-gray-400 font-mono mb-2">Email</h4>
              <a
                href="mailto:hal.chung.chingyan.2025@gmail.com"
                className="text-lg md:text-xl hover:text-primary transition-colors break-words"
              >
                hal.chung.chingyan.2025@gmail.com
              </a>
            </div>
            <div>
              <h4 className="text-gray-400 font-mono mb-2">Socials</h4>
              <div className="flex gap-4">
                <a
                  href="https://github.com/WillYan0224"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  <Github size={24} />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
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
                  placeholder="Tell me about your thought ..."
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className={`w-full font-bold py-4 rounded-lg transition-all disabled:opacity-50 ${
                  status === "error"
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-white text-black hover:bg-gray-200"
                }`}
              >
                {status === "sending"
                  ? t.contact.btn_sending
                  : status === "success"
                    ? t.contact.btn_sent
                    : status === "error"
                      ? "Error. Try again."
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
    <p>© {new Date().getFullYear()} Yan. All rights reserved.</p>
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
        <FeaturedProjects />
        <ProjectList />
        <Contact />
        <Footer />
      </div>
    </LanguageContext.Provider>
  );
}

export default App;
