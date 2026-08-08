"use client";

import { useEffect, useState } from "react";

export default function ThemeLab() {
  const [activeTheme, setActiveTheme] = useState("current");
  const [mounted, setMounted] = useState(false);

  const themes = [
    { id: "current", name: "Current — Warm Neutral", className: "" },
    { id: "midnight-navy", name: "Midnight Navy", className: "theme-midnight-navy" },
    { id: "forest-sage", name: "Forest Sage", className: "theme-forest-sage" },
    { id: "burgundy-rose", name: "Burgundy Rose", className: "theme-burgundy-rose" },
    { id: "midnight-plum", name: "Midnight Plum", className: "theme-midnight-plum" },
    { id: "espresso-terracotta", name: "Espresso Terracotta", className: "theme-espresso-terracotta" },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const changeTheme = (themeId, className) => {
    setActiveTheme(themeId);
    
    // Remove all other theme classes from document.body
    themes.forEach((t) => {
      if (t.className) {
        document.body.classList.remove(t.className);
      }
    });

    // Add selected theme class if it exists
    if (className) {
      document.body.classList.add(className);
    }
  };

  // Only render in development mode and on the client side
  const isDev = process.env.NODE_ENV === "development";
  if (!isDev || !mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] bg-[#161618] border border-white/10 p-6 max-w-sm w-80 shadow-2xl text-left font-sans select-none">
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
        <div>
          <span className="text-[9px] font-sans tracking-[0.2em] text-[#C5A880] uppercase block">
            DEVELOPMENT TOOL
          </span>
          <h4 className="text-xs font-sans tracking-[0.1em] text-[#F4F1EA] uppercase font-bold">
            Theme Lab Selector
          </h4>
        </div>
        <span className="text-[9px] bg-[#C5A880]/15 text-[#C5A880] px-2 py-0.5 font-sans tracking-wide">
          DEV MODE
        </span>
      </div>

      <p className="text-[10px] text-[#8E8E93] leading-relaxed mb-4">
        Click a color palette to compare live styles across all page components.
      </p>

      <div className="space-y-2">
        {themes.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => changeTheme(t.id, t.className)}
            className={`w-full text-left text-xs p-3 transition-all flex items-center justify-between border ${
              activeTheme === t.id
                ? "border-[#C5A880] bg-[#C5A880]/5 text-[#F4F1EA]"
                : "border-white/5 bg-[#0C0C0D] text-[#8E8E93] hover:text-[#F4F1EA] hover:border-white/10"
            }`}
          >
            <span>{t.name}</span>
            {activeTheme === t.id && (
              <span className="text-[9px] text-[#C5A880] font-sans font-bold">
                ACTIVE
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
