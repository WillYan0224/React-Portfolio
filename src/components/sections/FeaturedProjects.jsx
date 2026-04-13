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
                      className="px-12 py-5 rounded-2xl font-black transition-all uppercase text-sm tracking-widest shadow-xl text-white"
                      style={{
                        backgroundColor: theme.buttonBg,
                        boxShadow: `0 10px 30px ${theme.buttonBg}33`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#ffffff";
                        e.currentTarget.style.color = theme.buttonHoverText;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = theme.buttonBg;
                        e.currentTarget.style.color = "#ffffff";
                      }}
                    >
                      Preview
                    </button>

                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="p-5 border rounded-2xl text-white transition-colors"
                      style={{
                        borderColor: "rgba(255,255,255,0.10)",
                        background: "rgba(255,255,255,0.02)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `${theme.accent}14`;
                        e.currentTarget.style.borderColor = `${theme.accent}44`;
                        e.currentTarget.style.color = theme.accentSoft;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.02)";
                        e.currentTarget.style.borderColor =
                          "rgba(255,255,255,0.10)";
                        e.currentTarget.style.color = "#ffffff";
                      }}
                    >
                      <Github size={28} />
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
