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
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  Github,
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";
import emailjs from "@emailjs/browser";

// --- DATA CONSTANTS ---
import { SKILLS_DATA, DEVTOOL_DATA } from "./data/skills";
import { PROJECTS } from "./data/porjects";
import { TRANSLATIONS } from "./data/translations";

// --- 1. CONTEXT SETUP ---
const LanguageContext = createContext();
const useLanguage = () => useContext(LanguageContext);

// --- 2. 3D OCEAN COMPONENTS ---

const OceanSurface = () => {
  const meshRef = useRef();
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const positions = meshRef.current.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      positions[i + 2] =
        Math.sin(x * 0.4 + time) * 0.25 + Math.sin(y * 0.2 + time * 0.6) * 0.25;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2.1, 0, 0]} position={[0, 3, 0]}>
      <planeGeometry args={[35, 35, 64, 64]} />
      <meshStandardMaterial
        color="#4facfe"
        transparent
        opacity={0.5}
        roughness={0.1}
        metalness={0.9}
      />
    </mesh>
  );
};

const PBRBubbles = ({ count = 40, area = 20 }) => {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        t: Math.random() * 100,
        speed: 0.02 + Math.random() / 30,
        x: (Math.random() - 0.5) * area,
        y: (Math.random() - 0.5) * area,
        z: (Math.random() - 0.5) * 10,
        size: 0.1 + Math.random() * 0.2,
      });
    }
    return temp;
  }, [count, area]);

  useFrame((state) => {
    particles.forEach((p, i) => {
      p.y += p.speed;
      if (p.y > area / 2) p.y = -area / 2;
      dummy.position.set(p.x + Math.sin(p.y + p.t) * 0.3, p.y, p.z);
      dummy.scale.set(p.size, p.size, p.size);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshPhysicalMaterial
        transmission={1}
        thickness={0.5}
        roughness={0}
        ior={1.33}
        iridescence={1}
        iridescenceIOR={1.5}
        transparent
        opacity={0.4}
      />
    </instancedMesh>
  );
};

// --- 3. UI COMPONENTS ---

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  return (
    <nav className="fixed top-0 w-full px-8 py-6 grid grid-cols-3 items-center z-[100] bg-[#0a0a0a]/90 backdrop-blur-3xl border-b border-white/10 text-white shadow-2xl">
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

        {/* Updated Button Colors */}
        <a
          href="#contact"
          className="relative hidden md:inline-flex h-12 overflow-hidden rounded-full p-[2px] focus:outline-none group"
        >
          <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#22d3ee_0%,#3b82f6_50%,#22d3ee_100%)]" />
          <span
            className="
        relative inline-flex h-full w-full items-center justify-center
        overflow-hidden rounded-full bg-black/90 px-8 py-1
        text-sm font-medium text-white backdrop-blur-3xl
        transition-colors duration-500 ease-out
        group-hover:text-white
      "
          >
            {/* Glow wipe updated to Cyan/Blue */}
            <span
              className="
          absolute inset-0
          -translate-x-full group-hover:translate-x-0
          transition-transform duration-700 ease-out
          opacity-60
          bg-[conic-gradient(from_90deg_at_50%_50%,#22d3ee_0%,#3b82f6_50%,#22d3ee_100%)]
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
    <section className="h-screen w-full relative overflow-hidden flex flex-col justify-center px-6 md:px-20 bg-gradient-to-b from-[#4facfe] to-[#004C99]">
      <div className="absolute inset-0 z-0">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 50 }}>
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
          <OceanSurface />
          <fog attach="fog" args={["#004C99", 5, 15]} />
        </Canvas>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 max-w-[74rem] pointer-events-none"
      >
        <div className="pointer-events-auto backdrop-blur-xl bg-black/20 border border-white/10 p-10 md:p-16 rounded-[2.5rem] shadow-2xl relative">
          <h2 className="text-xl md:text-2xl text-cyan-300 font-mono mb-6 flex items-center gap-2 whitespace-nowrap">
            <span>{t.hero.greeting}</span>
            <div className="relative ml-2 h-8 w-64 flex items-center ">
              <AnimatePresence mode="wait">
                <motion.span
                  key={ROLES[roleIndex]}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="absolute font-bold text-white block uppercase tracking-tight whitespace-nowrap"
                >
                  {ROLES[roleIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </h2>
          <h1 className="text-6xl md:text-6xl font-black leading-[0.9] mb-8 text-white tracking-tighter drop-shadow-2xl">
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
      </motion.div>
    </section>
  );
};

const TechMarquee = () => {
  return (
    <div className="py-20 bg-[#082847]/80 backdrop-blur-md overflow-hidden relative border-y border-white/10 flex flex-col gap-20">
      {/* Side Fade Gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#082847] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#082847] to-transparent z-10" />

      {/* --- ROW 1: Scrolling LEFT --- */}
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

      {/* --- ROW 2: Scrolling RIGHT --- */}
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
      className="w-full md:w-[65%] relative cursor-pointer" // Increased width from 3/5 to 65%
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
      <section id="work" className="py-32 px-6 md:px-20">
        <div className="max-w-[90rem] mx-auto mb-24">
          {" "}
          {/* Container increased from 6xl to 90rem */}
          <h2 className="w-fit md:-ml-12 text-7xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
            Selected{" "}
            <span className="text-cyan-500 text-shadow-glow">Works</span>
          </h2>
        </div>

        <div className="max-w-[90rem] mx-auto space-y-72">
          {" "}
          {/* Vertical spacing increased */}
          {t.featured.map((project, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } items-center gap-16 md:gap-24`} // Gap increased
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
                {" "}
                {/* Text container reduced to accommodate bigger card */}
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
      </section>

      {/* Modal logic remains same */}
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
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-32 bg-black/10 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto px-6">
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
                placeholder="Briefly describe your idea..."
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
        {/* Global PBR Bubbles: Fixed background behind z-10 content */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
          <Canvas camera={{ position: [0, 0, 10] }}>
            <ambientLight intensity={1} />
            <pointLight position={[5, 5, 5]} intensity={5} color="#ffffff" />
            <PBRBubbles count={45} area={25} />
          </Canvas>
        </div>

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
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        html { scroll-behavior: smooth; }
        .text-shadow-glow { text-shadow: 0 0 20px rgba(34, 211, 238, 0.4); }
      `}</style>
    </LanguageContext.Provider>
  );
}

export default App;
