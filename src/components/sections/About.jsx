import React from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../../context/AppContext";
import AmbientBubbles from "../fx/AmbientBubbles";

export default function About() {
  const { t, theme } = useAppContext();

  return (
    <section
      id="about"
      className="py-32 px-6 md:px-20 relative overflow-hidden"
    >
      <AmbientBubbles
        variant="section"
        scale={1.4}
        extraDensity={0.32}
        baseOpacity={0.22}
        extraOpacityBase={0.07}
        extraOpacityGain={0.2}
        borderOpacity={0.2}
        fillOpacity={0.028}
        blurPx={0.16}
        glow
        fresnel
        centerTransparency={0.95}
        countMultiplier={1}
        densityProfile="leftHeavy"
        className="z-0"
      />

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2
            className="font-mono mb-4 uppercase tracking-[0.5em] text-xs font-bold"
            style={{ color: theme.accent }}
          >
            {t.about.title}
          </h2>

          <h3 className="text-5xl md:text-6xl font-black mb-8 text-white tracking-tighter leading-tight">
            {t.about.headline_word1}{" "}
            <span style={{ color: theme.accent }}>
              {t.about.headline_word2}
            </span>
          </h3>

          <p
            className="text-blue-50 text-lg mb-10 leading-relaxed border-l-4 pl-8 opacity-80"
            style={{ borderColor: `${theme.accent}55` }}
          >
            {t.about.bio1}
          </p>

          <div className="flex gap-12 border-t border-white/10 pt-10">
            <div>
              <h4 className="text-5xl font-black text-white tracking-tighter">
                4+
              </h4>
              <p
                className="text-xs uppercase font-bold tracking-widest mt-2"
                style={{ color: theme.accent }}
              >
                Years Exp
              </p>
            </div>

            <div>
              <h4 className="text-5xl font-black text-white tracking-tighter">
                15+
              </h4>
              <p
                className="text-xs uppercase font-bold tracking-widest mt-2"
                style={{ color: theme.accent }}
              >
                Projects
              </p>
            </div>
          </div>
        </motion.div>

        <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/5] border border-white/10 shadow-2xl">
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
}
