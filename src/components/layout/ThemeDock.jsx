import React from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useAppContext } from "../../context/AppContext";
import { THEME_DOCK_ITEMS } from "../../data/themeDockItems";

export default function ThemeDock() {
  const { heroTheme, setHeroTheme } = useAppContext();
  const { scrollY } = useScroll();

  const dockYRaw = useTransform(scrollY, [0, 1400], [110, 190]);
  const dockY = useSpring(dockYRaw, {
    stiffness: 120,
    damping: 22,
    mass: 0.5,
  });

  const items = Object.entries(THEME_DOCK_ITEMS).map(([id, meta]) => ({
    id,
    ...meta,
  }));

  return (
    <motion.div
      style={{ y: dockY }}
      className="hidden md:flex fixed left-4 lg:left-6 top-0 z-[96] flex-col gap-3"
    >
      <div className="theme-dock-shell rounded-[1.5rem] border border-white/10 bg-[#04131d]/56 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.22)] p-2">
        <div className="relative z-10 flex flex-col gap-1.5">
          {items.map((item) => {
            const isActive = heroTheme === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setHeroTheme(item.id)}
                className="group relative flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all duration-300"
                style={{
                  background: isActive
                    ? "rgba(255,255,255,0.06)"
                    : "transparent",
                  boxShadow: isActive
                    ? "inset 0 0 0 1px rgba(255,255,255,0.06)"
                    : "none",
                  transform: isActive ? "translateX(4px)" : "translateX(0px)",
                }}
              >
                <span
                  className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full transition-all duration-300"
                  style={{
                    background: isActive ? item.glow : "rgba(255,255,255,0.12)",
                    boxShadow: isActive ? `0 0 16px ${item.glow}` : "none",
                    opacity: isActive ? 1 : 0.35,
                  }}
                />

                <div
                  className="flex h-8 w-8 shrink-0 overflow-hidden rounded-xl border border-white/10 transition-all duration-300"
                  style={{
                    boxShadow: isActive ? `0 0 14px ${item.glow}22` : "none",
                  }}
                >
                  {item.preview.map((color) => (
                    <span
                      key={color}
                      className="h-full w-1/3"
                      style={{ background: color }}
                    />
                  ))}
                </div>

                <div className="flex flex-col">
                  <span className="relative block">
                    <span
                      className="block text-[11px] font-bold uppercase tracking-[0.18em] transition-colors duration-300"
                      style={{
                        color: isActive
                          ? "rgba(255,255,255,0.95)"
                          : "rgba(255,255,255,0.55)",
                        textShadow: isActive
                          ? `0 0 8px ${item.glow}18`
                          : "none",
                      }}
                    >
                      {item.label}
                    </span>

                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="theme-dock-text-sweep pointer-events-none absolute inset-0 block text-[11px] font-bold uppercase tracking-[0.18em]"
                        style={{
                          "--dock-text-accent": item.glow,
                        }}
                      >
                        {item.label}
                      </span>
                    )}
                  </span>

                  <span
                    className="text-[10px] uppercase tracking-[0.14em] transition-colors duration-300"
                    style={{
                      color: isActive
                        ? "rgba(255,255,255,0.42)"
                        : "rgba(255,255,255,0.28)",
                    }}
                  >
                    Theme
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
