import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
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
    <section id="projects" className="relative py-32 overflow-hidden">
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

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="mb-14 px-2">
          <h2 className="text-5xl font-black text-white tracking-tighter">
            Other Projects
          </h2>
        </div>

        <div className="relative">
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll Left"
            className="hidden md:inline-flex group absolute left-[-108px] top-1/2 z-20 h-32 w-16 -translate-y-1/2 items-center justify-center overflow-hidden rounded-[22px] transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: "rgba(255,255,255,0.02)",
              boxShadow: `
      inset 0 0 0 1px ${theme.accent}20,
      0 0 24px ${theme.accent}10,
      0 12px 30px rgba(0,0,0,0.18)
    `,
              color: "#ffffff",
              backdropFilter: "blur(12px)",
            }}
          >
            <span
              className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: `radial-gradient(circle at 50% 30%, ${theme.accent}18, transparent 72%)`,
              }}
            />
            <ChevronLeft
              size={24}
              className="relative z-10 transition-transform duration-300 group-hover:-translate-x-0.5"
            />
          </button>

          <button
            onClick={() => scroll("right")}
            aria-label="Scroll Right"
            className="hidden md:inline-flex group absolute right-[-108px] top-1/2 z-20 h-32 w-16 -translate-y-1/2 items-center justify-center overflow-hidden rounded-[22px] transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: "rgba(255,255,255,0.02)",
              boxShadow: `
      inset 0 0 0 1px ${theme.accent}20,
      0 0 24px ${theme.accent}10,
      0 12px 30px rgba(0,0,0,0.18)
    `,
              color: "#ffffff",
              backdropFilter: "blur(12px)",
            }}
          >
            <span
              className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: `radial-gradient(circle at 50% 30%, ${theme.accent}18, transparent 72%)`,
              }}
            />
            <ChevronRight
              size={24}
              className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </button>

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
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  </div>

                  <div className="p-6 md:p-7 flex flex-col flex-1 min-h-[260px]">
                    <h3 className="text-2xl font-black text-white tracking-tight mb-3 min-h-[72px]">
                      {projectText.title}
                    </h3>

                    <p className="text-blue-100/65 leading-relaxed text-sm md:text-base min-h-[72px]">
                      {projectText.description}
                    </p>

                    <div className="mt-5">
                      <span
                        className="inline-flex items-center rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em]"
                        style={{
                          color: theme.accentMuted,
                          border: `1px solid ${theme.accent}33`,
                          background: `${theme.accent}14`,
                        }}
                      >
                        {project.category}
                      </span>
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
