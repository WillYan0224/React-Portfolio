import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Play,
  Code2,
  Database,
  Layout,
} from "lucide-react";
import emailjs from "@emailjs/browser";

// --- Data Constants ---
const SKILLS_DATA = [
  {
    name: "React",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    name: "TypeScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  },
  {
    name: "Next.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    invert: true,
  },
  {
    name: "Tailwind",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
  },
  {
    name: "Node.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },
  {
    name: "GraphQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
  },
  {
    name: "Framer",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/framermotion/framermotion-original.svg",
  },
  {
    name: "AWS",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
    invert: true,
  },
  {
    name: "Figma",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
  },
  {
    name: "Docker",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  },
];

const PROJECTS = [
  {
    id: 1,
    title: "E-Commerce Dashboard",
    category: "Web App",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
    description: "A full-stack dashboard for managing inventory and analytics.",
  },
  {
    id: 2,
    title: "Social Media API",
    category: "Backend",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000",
    description: "High performance REST API built with Go and Redis.",
  },
  {
    id: 3,
    title: "AI Image Generator",
    category: "AI/ML",
    image:
      "https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&q=80&w=1000",
    description: "React frontend integrated with OpenAI DALL-E 3.",
  },
  {
    id: 4,
    title: "Travel Booking UI",
    category: "Design",
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1000",
    description: "Modern UI/UX implementation for a travel agency.",
  },
  {
    id: 5,
    title: "Crypto Wallet",
    category: "Mobile App",
    image:
      "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=1000",
    description: "Secure mobile wallet for managing digital assets.",
  },
  {
    id: 6,
    title: "Smart Home API",
    category: "IoT",
    image:
      "https://images.unsplash.com/photo-1558002038-1091a1661729?auto=format&fit=crop&q=80&w=1000",
    description: "Centralized control system for smart devices.",
  },
];

// --- Components ---

// 1. Navigation
const Navbar = () => (
  <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 bg-black/20 backdrop-blur-md text-white">
    <div className="text-2xl font-bold tracking-tighter">PORTFOLIO.</div>
    <div className="hidden md:flex gap-8 font-medium">
      <a href="#work" className="hover:text-primary transition-colors">
        Work
      </a>
      <a href="#about" className="hover:text-primary transition-colors">
        About
      </a>
      <a href="#contact" className="hover:text-primary transition-colors">
        Contact
      </a>
    </div>
    <a
      href="#contact"
      className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-gray-200 transition-colors"
    >
      Let's Talk
    </a>
  </nav>
);

// 2. Big Banner (Hero) - Updated with Text Scroll Animation
const Hero = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const ROLES = ["Web Programmer", "Game Programmer", "VFX Designer"]; // The words to cycle through

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 2500); // Change every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="h-screen flex flex-col justify-center px-6 md:px-20 relative overflow-hidden">
      {/* Background Gradient Blob */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 max-w-5xl"
      >
        {/* Animated Sub-headline */}
        <h2 className="text-xl md:text-2xl text-primary font-mono mb-6 flex items-center gap-2">
          <span>Hello, I am a</span>

          <div className="relative h-8 w-64 overflow-hidden flex items-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={roleIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute font-bold text-white block"
              >
                {ROLES[roleIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </h2>

        <h1 className="text-6xl md:text-8xl font-bold leading-tight mb-6">
          Building{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            digital experiences
          </span>{" "}
          that matter.
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-8">
          I craft modern websites and robust applications with a focus on
          interaction, design, and performance.
        </p>
        <div className="flex gap-4">
          <a
            href="#work"
            className="border border-white/20 bg-white/5 backdrop-blur-sm px-8 py-4 rounded-lg hover:bg-white hover:text-black transition-all duration-300"
          >
            View My Work
          </a>
          <div className="flex gap-4 items-center px-4">
            {/* Make sure these icons are imported from lucide-react at the top */}
            <Github className="cursor-pointer hover:text-primary transition-colors" />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

// 3. Horizontal Animation Scroll (Infinite Marquee) - Updated with Icons
const TechMarquee = () => {
  return (
    <div className="py-20 bg-zinc-900 overflow-hidden relative border-y border-white/5">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-zinc-900 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-zinc-900 to-transparent z-10" />

      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
      >
        {/* We repeat the array 3 times to ensure smooth infinite looping */}
        {[...SKILLS_DATA, ...SKILLS_DATA, ...SKILLS_DATA].map(
          (skill, index) => (
            <div
              key={index}
              className="mx-8 flex items-center gap-4 group cursor-default"
            >
              {/* Icon Container */}
              <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center border border-white/5 group-hover:border-primary/50 group-hover:bg-zinc-800/80 transition-colors duration-300">
                <img
                  src={skill.icon}
                  alt={skill.name}
                  className={`w-7 h-7 object-contain ${
                    skill.invert ? "invert brightness-0" : ""
                  }`}
                />
              </div>

              {/* Skill Name */}
              <span className="text-2xl font-bold text-zinc-500 group-hover:text-white transition-colors uppercase tracking-tight">
                {skill.name}
              </span>
            </div>
          )
        )}
      </motion.div>
    </div>
  );
};
// 4. About Section (New)
const About = () => {
  return (
    <section id="about" className="py-24 px-6 md:px-20 bg-zinc-900/30">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side: Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-primary font-mono mb-4">Who I Am</h2>
          <h3 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Bridging the gap between{" "}
            <span className="text-white border-b-4 border-primary">design</span>{" "}
            and{" "}
            <span className="text-white border-b-4 border-secondary">
              engineering
            </span>
            .
          </h3>
          <p className="text-gray-400 text-lg mb-6 leading-relaxed">
            I am a passionate developer with a knack for creating immersive
            digital experiences. My journey started with game development, which
            taught me the importance of performance and interaction. Now, I
            apply those same principles to the web.
          </p>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            When I'm not coding, you can find me exploring 3D art, playing
            competitive FPS games, or deconstructing UI patterns on Awwwards.
          </p>

          {/* Stats / Highlights */}
          <div className="flex gap-8 border-t border-white/10 pt-8">
            <div>
              <h4 className="text-3xl font-bold text-white">3+</h4>
              <p className="text-sm text-gray-500 uppercase tracking-wider">
                Years Exp.
              </p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-white">50+</h4>
              <p className="text-sm text-gray-500 uppercase tracking-wider">
                Projects
              </p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-white">100%</h4>
              <p className="text-sm text-gray-500 uppercase tracking-wider">
                Commitment
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Image */}
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

// 5. Video Card for Project Preview (Updated)
const FeaturedProject = () => {
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
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h3 className="text-primary font-mono mb-2">Featured Project</h3>
            <h2 className="text-4xl md:text-5xl font-bold">
              Interactive Experience
            </h2>
          </div>
          <p className="text-gray-400 max-w-md mt-4 md:mt-0">
            A highlight of my best work involving complex animations and video
            integration.
          </p>
        </div>

        {/* Video Card Container */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.5 }}
          className="relative aspect-video bg-zinc-800 rounded-2xl overflow-hidden group border border-white/10 shadow-2xl"
        >
          {/* Auto-playing preview video */}
          <video
            className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700 ease-out"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          {/* Text Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              {/* Tag */}
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
                View Case Study <ExternalLink size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Modal + fullscreen*/}
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
              {/* Close button */}
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
                <source src="/videos/hero.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
// 6. Container Part for Project List
const ProjectList = () => {
  return (
    <section className="py-24 px-6 md:px-20 bg-zinc-950">
      <h2 className="text-4xl font-bold mb-12">Selected Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PROJECTS.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="group"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-4">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                <button className="p-3 bg-white text-black rounded-full hover:bg-primary hover:text-white transition-colors">
                  <Github size={20} />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400 mt-1">{project.description}</p>
              </div>
              <span className="text-xs font-mono border border-gray-700 px-2 py-1 rounded text-gray-400 uppercase">
                {project.category}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// 7. Contact Section with EmailJS
const Contact = () => {
  const form = useRef();
  const [status, setStatus] = useState("");

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus("sending");

    // REPLACE THESE WITH YOUR ACTUAL EMAILJS ID's
    // Go to https://www.emailjs.com/ to get these
    // emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form.current, 'YOUR_PUBLIC_KEY')

    // Simulating a send for the demo
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
            Let's work together
          </h2>
          <p className="text-xl text-gray-400">
            Have a project in mind? Drop me a line.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Contact Info */}
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
                <a href="#" className="hover:text-primary transition-colors">
                  Instagram
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2 bg-zinc-900 p-8 rounded-2xl border border-white/5">
            <form ref={form} onSubmit={sendEmail} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">
                    Name
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
                    Email
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
                  Message
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
                  ? "Sending..."
                  : status === "success"
                  ? "Message Sent!"
                  : "Send Message"}
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

// --- Main App ---
function App() {
  return (
    <div className="min-h-screen bg-dark text-white selection:bg-primary selection:text-white">
      <Navbar />
      <Hero />
      <TechMarquee />
      <About />

      <FeaturedProject />
      <ProjectList />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
