import "./App.css";
import React, { useState } from "react";
import { AppContext } from "./context/AppContext";

import { TRANSLATIONS } from "./data/translations";
import { THEME_PRESETS } from "./data/themePresets";

import Navbar from "./components/layout/Navbar";
import ThemeDock from "./components/layout/ThemeDock";
import ResumeDock from "./components/layout/ResumeDock";
import Hero from "./components/hero/Hero";
import TechMarquee from "./components/sections/TechMarquee";
import About from "./components/sections/About";
import FeaturedProjects from "./components/sections/FeaturedProjects";
import ProjectList from "./components/sections/ProjectList";
import Contact from "./components/sections/Contact";
import SectionNavigator from "./components/layout/SectionNavigator";

// --- MAIN APP ---
function App() {
  const [language, setLanguage] = useState("en");
  const [heroTheme, setHeroTheme] = useState("ocean");

  const t = TRANSLATIONS[language];
  const theme = THEME_PRESETS[heroTheme];

  return (
    <AppContext.Provider
      value={{ language, setLanguage, t, heroTheme, setHeroTheme, theme }}
    >
      <div
        className="min-h-screen text-white selection:text-black"
        style={{
          background: `linear-gradient(to bottom, ${theme.rootFrom}, ${theme.rootTo})`,
          ["--selectionColor"]: theme.accent,
        }}
      >
        <Navbar />
        <ThemeDock />
        <ResumeDock />
        <SectionNavigator />
        <main className="relative z-10">
          <Hero />
          <TechMarquee />
          <About />
          <FeaturedProjects />
          <ProjectList />
          <Contact />

          <footer
            className="py-16 text-center text-xs border-t border-white/5 backdrop-blur-md"
            style={{
              color: "rgba(255,255,255,0.22)",
              background: "rgba(0,0,0,0.28)",
            }}
          >
            © {new Date().getFullYear()} Yan. Deep Dive Graphics Portfolio.
          </footer>
        </main>
      </div>
    </AppContext.Provider>
  );
}

export default App;
