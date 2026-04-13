import React from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../../context/AppContext";
import { SKILLS_DATA, DEVTOOL_DATA } from "../../data/skills";

export default function TechMarquee() {
  const { theme } = useAppContext();

  return (
    <div
      className="py-20 backdrop-blur-md overflow-hidden relative border-y border-white/10 flex flex-col gap-20"
      style={{ background: theme.sectionSurface }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-32 z-10"
        style={{
          background: `linear-gradient(to right, ${theme.sectionEdge}, transparent)`,
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-32 z-10"
        style={{
          background: `linear-gradient(to left, ${theme.sectionEdge}, transparent)`,
        }}
      />

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
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 transition-colors duration-300">
                <img
                  src={skill.icon}
                  alt={skill.name}
                  className={`w-7 h-7 object-contain opacity-70 group-hover:opacity-100 ${
                    skill.invert ? "invert brightness-0" : ""
                  }`}
                />
              </div>
              <span
                className="text-xl font-bold uppercase tracking-tight"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {skill.name}
              </span>
            </div>
          ),
        )}
      </motion.div>

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
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 transition-colors duration-300">
                <img
                  src={devtool.icon}
                  alt={devtool.name}
                  className={`w-7 h-7 object-contain opacity-70 group-hover:opacity-100 ${
                    devtool.invert ? "invert brightness-0" : ""
                  }`}
                />
              </div>
              <span
                className="text-xl font-bold uppercase tracking-tight"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {devtool.name}
              </span>
            </div>
          ))}
      </motion.div>
    </div>
  );
}
