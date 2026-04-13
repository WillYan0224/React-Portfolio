import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";

const SECTION_ITEMS = [
  { id: "hero", label: "Intro" },
  { id: "about", label: "About" },
  { id: "work", label: "Featured" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export default function SectionNavigator() {
  const { theme } = useAppContext();
  const [activeSection, setActiveSection] = useState("hero");

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
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  return (
    <div className="hidden xl:flex fixed right-14 top-1/2 -translate-y-1/2 z-[94]">
      <div className="section-nav-shell relative px-3 py-4">
        <div
          className="section-nav-aura pointer-events-none absolute left-[2px] top-1 bottom-1 w-[18px]"
          style={{
            "--nav-accent": theme.accent,
          }}
        />

        <div className="relative z-10 flex flex-col items-start">
          {SECTION_ITEMS.map((item, index) => {
            const isActive = activeSection === item.id;
            const isLast = index === SECTION_ITEMS.length - 1;

            return (
              <div key={item.id} className="flex flex-col items-start">
                <a
                  href={`#${item.id}`}
                  className="group relative pl-6 pr-2 py-1.5"
                  style={{
                    transform: isActive ? "translateX(5px)" : "translateX(0px)",
                    transition:
                      "transform 300ms ease, opacity 300ms ease, color 300ms ease",
                  }}
                >
                  <span
                    className="absolute left-0 top-1/2 h-[7px] w-[7px] -translate-y-1/2 rounded-full transition-all duration-300"
                    style={{
                      background: isActive
                        ? theme.accent
                        : "rgba(255,255,255,0.24)",
                      boxShadow: isActive
                        ? `0 0 12px ${theme.accent}99, 0 0 24px ${theme.accent}40`
                        : "0 0 6px rgba(255,255,255,0.05)",
                      transform: isActive
                        ? "translateY(-50%) scale(1.3)"
                        : "translateY(-50%) scale(1)",
                    }}
                  />

                  <span className="relative block">
                    <span
                      className="block text-[11px] font-bold uppercase tracking-[0.24em] transition-all duration-300 group-hover:opacity-100"
                      style={{
                        color: isActive
                          ? theme.accentMuted || theme.accent
                          : "rgba(255,255,255,0.48)",
                        textShadow: isActive
                          ? `0 0 10px ${theme.accent}20`
                          : "none",
                        opacity: isActive ? 1 : 0.84,
                      }}
                    >
                      {item.label}
                    </span>

                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="section-nav-text-sweep pointer-events-none absolute inset-0 block text-[11px] font-bold uppercase tracking-[0.24em]"
                        style={{
                          "--text-sweep-accent": theme.accent,
                          "--text-sweep-soft":
                            theme.accentMuted || theme.accent,
                          textShadow: `0 0 10px ${theme.accent}28`,
                        }}
                      >
                        {item.label}
                      </span>
                    )}
                  </span>
                </a>

                {!isLast && (
                  <div className="relative ml-[3px] my-3 h-7 w-px overflow-hidden">
                    <div className="absolute inset-0 bg-white/10" />

                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to bottom, transparent, ${theme.accent}44, transparent)`,
                        boxShadow: `0 0 8px ${theme.accent}22`,
                        opacity: isActive ? 1 : 0.36,
                        transition: "opacity 300ms ease",
                      }}
                    />

                    <div
                      className="section-nav-rail-shimmer absolute left-0 top-0 h-4 w-px"
                      style={{
                        background: `linear-gradient(to bottom, transparent, ${theme.accent}, transparent)`,
                        boxShadow: `0 0 10px ${theme.accent}55`,
                        opacity: isActive ? 1 : 0.5,
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
