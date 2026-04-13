import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../../context/AppContext";

export default function Navbar() {
  const { language, setLanguage, t, theme } = useAppContext();
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    const updateActiveSection = () => {
      const sectionIds = ["hero", "about", "work", "projects", "contact"];
      const triggerY = window.innerHeight * 0.35;

      const scrollBottom = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;

      if (scrollBottom >= pageHeight - 4) {
        setActiveSection("contact");
        return;
      }

      let closestId = sectionIds[0];
      let closestDistance = Infinity;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        const distance = Math.abs(rect.top - triggerY);

        if (rect.top <= triggerY && distance < closestDistance) {
          closestDistance = distance;
          closestId = id;
        }
      }

      setActiveSection(closestId);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
    };
  }, []);

  const navItems = [
    { id: "about", label: t.nav.about },
    { id: "work", label: t.nav.work },
    { id: "contact", label: t.nav.contact },
  ];

  const languages = ["en", "zh", "jp"];

  return (
    <nav className="fixed top-4 left-0 right-0 z-[100] px-4 md:px-6">
      <div className="mx-auto max-w-[1440px]">
        <div className="relative flex items-center justify-between rounded-[1.75rem] border border-white/10 px-5 md:px-7 py-3 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.28)] overflow-hidden bg-[#04131d]/65">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />
          <div className="absolute inset-x-0 top-0 h-px bg-white/20" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at top, ${theme.accent}18, transparent 55%)`,
            }}
          />

          <div className="relative z-10 flex items-center gap-6">
            <a
              href="#"
              className="text-2xl font-black tracking-tighter text-white"
            >
              PORTFOLIO.
            </a>
          </div>

          <div className="relative z-10 hidden md:flex items-center rounded-full border border-white/10 bg-white/[0.04] p-1.5 backdrop-blur-xl">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;

              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="relative px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.28em] transition-colors"
                >
                  {isActive && (
                    <motion.span
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 rounded-full"
                      style={{
                        border: `1px solid ${theme.accent}33`,
                        background: `${theme.accent}18`,
                        boxShadow: `0 0 24px ${theme.accent}22`,
                      }}
                    />
                  )}

                  <span
                    className="relative z-10"
                    style={{
                      color: isActive
                        ? theme.accentMuted
                        : "rgba(255,255,255,0.68)",
                    }}
                  >
                    {item.label}
                  </span>
                </a>
              );
            })}
          </div>

          <div className="relative z-10 flex items-center gap-3 md:gap-4">
            <div className="hidden md:flex items-center rounded-full border border-white/10 bg-white/[0.05] p-1">
              {languages.map((lang) => {
                const isActive = language === lang;

                return (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className="rounded-full px-3 py-1.5 text-[11px] font-bold tracking-[0.18em] transition-all"
                    style={{
                      background: isActive
                        ? `${theme.accent}22`
                        : "transparent",
                      color: isActive
                        ? theme.accentMuted
                        : "rgba(255,255,255,0.45)",
                      boxShadow: isActive
                        ? `inset 0 0 0 1px ${theme.accent}44`
                        : "none",
                    }}
                  >
                    {lang.toUpperCase()}
                  </button>
                );
              })}
            </div>

            <a
              href="#contact"
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full p-[1px]"
              style={{
                background: `linear-gradient(135deg, ${theme.accent}88, rgba(255,255,255,0.10), ${theme.accent}44)`,
                boxShadow: `0 0 28px ${theme.accent}22`,
              }}
            >
              <span
                className="relative inline-flex h-full items-center justify-center rounded-full px-6 text-[12px] font-bold tracking-[0.12em] text-white backdrop-blur-xl transition-all duration-300"
                style={{
                  background: "rgba(3,10,18,0.78)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${theme.accent}22, transparent 65%)`,
                  }}
                />
                <span className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)] -translate-x-[140%] group-hover:translate-x-[140%] transition-transform duration-1000" />
                <span className="relative z-10">{t.nav.btn}</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
