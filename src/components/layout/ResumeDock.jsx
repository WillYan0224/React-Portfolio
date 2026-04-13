import React from "react";
import { Download, FileText } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

export default function ResumeDock() {
  const { theme } = useAppContext();

  return (
    <div className="hidden md:flex fixed right-8 top-[180px] z-[95]">
      <div
        className="resume-dock-orbit relative rounded-[1.8rem]"
        style={{
          "--resume-accent": theme.accent,
          "--resume-accent-soft": theme.accentSoft || theme.accent,
          "--resume-accent-deep": theme.accentMuted || theme.accent,
        }}
      >
        <span className="resume-dock-edge-glow pointer-events-none absolute -inset-[4px] rounded-[2.05rem]" />

        <a
          href="docs/resume.pdf"
          target="_blank"
          rel="noreferrer"
          className="resume-dock-shell group relative flex w-[300px] items-center gap-5 overflow-hidden rounded-[1.8rem] px-6 py-5 transition-all duration-300 hover:-translate-y-1"
          style={{
            background: "rgba(4,19,29,0.76)",
            boxShadow: `
              inset 0 0 0 1px rgba(255,255,255,0.07),
              0 10px 34px rgba(0,0,0,0.24)
            `,
            backdropFilter: "blur(16px)",
          }}
        >
          <span
            className="absolute inset-0 opacity-80"
            style={{
              background: `radial-gradient(circle at top, ${theme.accent}14, transparent 60%)`,
            }}
          />

          <span
            className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{
              background: `${theme.accent}12`,
              boxShadow: `inset 0 0 0 1px ${theme.accent}22, 0 0 16px ${theme.accent}18`,
              color: theme.accentSoft,
            }}
          >
            <FileText size={24} />
          </span>

          <span className="relative z-10 flex flex-col">
            <span className="text-[15px] font-black uppercase tracking-[0.18em] text-white/92">
              Resume
            </span>
            <span className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/42">
              View CV
            </span>
          </span>

          <span
            className="relative z-10 ml-auto flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300"
            style={{
              background: "rgba(255,255,255,0.04)",
              boxShadow: `inset 0 0 0 1px ${theme.accent}18`,
              color: "rgba(255,255,255,0.88)",
            }}
          >
            <Download
              size={20}
              className="transition-transform duration-300 group-hover:translate-y-[1px]"
            />
          </span>
        </a>
      </div>
    </div>
  );
}
