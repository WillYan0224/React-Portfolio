import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { PROJECTS } from "../../data/projects";
import AmbientBubbles from "../fx/AmbientBubbles";

export default function ProjectList() {
  const { t, theme } = useAppContext();
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    const amount = window.innerWidth >= 768 ? 376 : 308;
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section id="projects" className="relative py-28 overflow-hidden">
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

      <div className="relative z-10 max-w-[1320px] mx-auto px-5 md:px-8 xl:pr-16">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-center text-white">
            Other{" "}
            <span
              className="projectlist-title-sweep relative inline-block"
              style={{
                "--title-accent": theme.accent,
                "--title-accent-soft": theme.accentSoft || theme.accent,
              }}
            >
              Projects
            </span>
          </h2>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 no-scrollbar scroll-smooth"
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
                className="group relative shrink-0 w-[300px] md:w-[370px] rounded-[1.8rem] overflow-hidden border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-2xl flex flex-col"
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

                <div className="p-5 md:p-6 flex flex-col flex-1 min-h-[230px]">
                  <h3 className="text-[1.7rem] md:text-[1.9rem] font-black text-white tracking-tight mb-3 leading-tight min-h-[64px]">
                    {projectText.title}
                  </h3>

                  <p className="text-blue-100/65 leading-relaxed text-sm md:text-[15px] min-h-[72px]">
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

        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll Left"
            className="group inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full transition-all duration-300 hover:scale-[1.04]"
            style={{
              background: "rgba(255,255,255,0.03)",
              boxShadow: `
                inset 0 0 0 1px ${theme.accent}22,
                0 0 18px ${theme.accent}10,
                0 8px 20px rgba(0,0,0,0.16)
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
              size={20}
              className="relative z-10 transition-transform duration-300 group-hover:-translate-x-0.5"
            />
          </button>

          <button
            onClick={() => scroll("right")}
            aria-label="Scroll Right"
            className="group inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full transition-all duration-300 hover:scale-[1.04]"
            style={{
              background: "rgba(255,255,255,0.03)",
              boxShadow: `
                inset 0 0 0 1px ${theme.accent}22,
                0 0 18px ${theme.accent}10,
                0 8px 20px rgba(0,0,0,0.16)
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
              size={20}
              className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
