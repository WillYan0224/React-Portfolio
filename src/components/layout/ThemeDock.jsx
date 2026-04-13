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
      <div className="rounded-[1.5rem] border border-white/10 bg-[#04131d]/60 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.28)] p-2">
        {items.map((item) => {
          const isActive = heroTheme === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setHeroTheme(item.id)}
              className="group relative w-full flex items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all duration-300"
              style={{
                background: isActive ? "rgba(255,255,255,0.07)" : "transparent",
                boxShadow: isActive
                  ? "inset 0 0 0 1px rgba(255,255,255,0.08)"
                  : "none",
                transform: isActive ? "translateX(4px)" : "translateX(0px)",
              }}
            >
              <span
                className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: item.glow,
                  boxShadow: `0 0 24px ${item.glow}`,
                  opacity: isActive ? 1 : undefined,
                }}
              />

              <div className="flex h-8 w-8 shrink-0 overflow-hidden rounded-xl border border-white/10">
                {item.preview.map((color) => (
                  <span
                    key={color}
                    className="w-1/3 h-full"
                    style={{ background: color }}
                  />
                ))}
              </div>

              <div className="flex flex-col">
                <span
                  className="text-[11px] font-bold uppercase tracking-[0.18em] transition-colors"
                  style={{
                    color: isActive
                      ? "rgba(255,255,255,0.95)"
                      : "rgba(255,255,255,0.55)",
                  }}
                >
                  {item.label}
                </span>

                <span
                  className="text-[10px] uppercase tracking-[0.14em]"
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
    </motion.div>
  );
}
