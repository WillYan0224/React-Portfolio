import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Github, ExternalLink } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { PROJECTS } from "../../data/projects";
import AmbientBubbles from "../fx/AmbientBubbles";

export default function ProjectList() {
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
}
