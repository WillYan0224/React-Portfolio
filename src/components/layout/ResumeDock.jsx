import React from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Download, FileText } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

export default function ResumeDock() {
  const { theme } = useAppContext();
  const { scrollY } = useScroll();

  const dockYRaw = useTransform(scrollY, [0, 1400], [210, 290]);
  const dockY = useSpring(dockYRaw, {
    stiffness: 120,
    damping: 22,
    mass: 0.5,
  });

  return (
    <motion.div
      style={{ y: dockY }}
      className="hidden md:flex fixed right-4 lg:right-6 top-0 z-[95]"
    >
      <a
        href="/resume.pdf"
        target="_blank"
        rel="noreferrer"
        className="group relative flex items-center gap-3 rounded-[1.4rem] border border-white/10 bg-[#04131d]/70 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.28)] px-4 py-3 transition-all duration-300 hover:-translate-y-1"
      >
        <span className="absolute inset-0 rounded-[1.4rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />

        <span
          className="absolute inset-0 pointer-events-none rounded-[1.4rem]"
          style={{
            background: `radial-gradient(circle at top, ${theme.accent}16, transparent 58%)`,
          }}
        />

        <span
          className="relative z-10 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]"
          style={{
            color: theme.accentSoft,
            boxShadow: `0 0 20px ${theme.accent}22`,
          }}
        >
          <FileText size={18} />
        </span>

        <span className="relative z-10 flex flex-col">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/90">
            Resume
          </span>
          <span className="text-[10px] uppercase tracking-[0.14em] text-white/40">
            View CV
          </span>
        </span>

        <span className="relative z-10 ml-1 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/80 transition-all duration-300 group-hover:bg-white/[0.08]">
          <Download
            size={16}
            className="transition-transform duration-300 group-hover:translate-y-[1px]"
          />
        </span>
      </a>
    </motion.div>
  );
}
