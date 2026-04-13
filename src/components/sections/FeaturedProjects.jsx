import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Play, X } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import AmbientBubbles from "../fx/AmbientBubbles";
import TiltCard from "../shared/TiltCard";

export default function FeaturedProjects() {
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
                    className="featured-media-orbit relative rounded-[2.7rem]"
                    style={{
                      "--media-accent": theme.accent,
                      "--media-accent-soft": theme.accentSoft || theme.accent,
                      "--media-accent-deep": theme.accentMuted || theme.accent,
                    }}
                  >
                    <span className="featured-media-edge-glow pointer-events-none absolute -inset-[6px] rounded-[3.95rem]" />

                    <div
                      onClick={() => setActiveProject(project)}
                      className="featured-media-shell group relative aspect-video overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 shadow-2xl"
                    >
                      <video
                        src={project.video}
                        className="h-full w-full object-cover opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                        autoPlay
                        muted
                        loop
                        playsInline
                      />

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                        <div className="rounded-full bg-white p-8 text-black shadow-2xl scale-75 transition-transform group-hover:scale-100">
                          <Play fill="currentColor" size={40} />
                        </div>
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
                      className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-2xl p-[1px]"
                      style={{
                        background: `linear-gradient(135deg, ${theme.accent}80, rgba(255,255,255,0.10), ${theme.accent}36)`,
                        boxShadow: `0 0 20px ${theme.accent}16`,
                      }}
                    >
                      <span
                        className="relative inline-flex h-full items-center justify-center rounded-2xl px-10 text-sm font-black uppercase tracking-widest text-white transition-all duration-300"
                        style={{
                          background: "rgba(3,10,18,0.78)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <span
                          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          style={{
                            background: `radial-gradient(circle at 50% 0%, ${theme.accent}22, transparent 65%)`,
                          }}
                        />
                        <span className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)] -translate-x-[140%] group-hover:translate-x-[140%] transition-transform duration-1000" />
                        <span className="relative z-10">{project.btn}</span>
                      </span>
                    </button>

                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="View GitHub repository"
                      className="group relative inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl p-[1px]"
                      style={{
                        background: `linear-gradient(135deg, ${theme.accent}65, rgba(255,255,255,0.08), ${theme.accent}24)`,
                        boxShadow: `0 0 18px ${theme.accent}10`,
                      }}
                    >
                      <span
                        className="relative flex h-full w-full items-center justify-center rounded-2xl text-white"
                        style={{
                          background: "rgba(3,10,18,0.78)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <span
                          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          style={{
                            background: `radial-gradient(circle at 50% 0%, ${theme.accent}18, transparent 70%)`,
                          }}
                        />
                        <Github
                          size={22}
                          className="relative z-10 transition-all duration-300 group-hover:-translate-y-[1px] group-hover:scale-105"
                        />
                      </span>
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
}
