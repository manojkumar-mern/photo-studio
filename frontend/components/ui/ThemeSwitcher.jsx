"use client";

import { useState, useEffect } from "react";

const THEMES = [
  {
    id: "current",
    label: "Current Theme",
    description: "Champagne #C5A880",
    swatch: "#C5A880",
  },
  {
    id: "pixelbees-gold",
    label: "Pixelbees Gold",
    description: "Logo amber #C08A38",
    swatch: "#C08A38",
  },
  {
    id: "screenshot-gold",
    label: "Screenshot Gold",
    description: "Bright gold #D6C18C",
    swatch: "#D6C18C",
  },
];

const STORAGE_KEY = "pb-preview-theme";

export default function ThemeSwitcher() {
  const [active, setActive] = useState("current");
  const [visible, setVisible] = useState(true);

  // Restore persisted choice on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && THEMES.find((t) => t.id === saved)) {
      apply(saved);
      setActive(saved);
    }
  }, []);

  function apply(id) {
    document.documentElement.setAttribute("data-theme", id);
    localStorage.setItem(STORAGE_KEY, id);
  }

  function select(id) {
    setActive(id);
    apply(id);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] select-none"
      role="region"
      aria-label="Theme preview switcher"
    >
      <div
        style={{
          background: "rgba(22,22,24,0.96)",
          border: "1px solid rgba(197,168,128,0.25)",
          borderRadius: "12px",
          padding: "14px 16px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(197,168,128,0.08)",
          backdropFilter: "blur(12px)",
          minWidth: "240px",
        }}
      >
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <span style={{ fontSize: "9px", letterSpacing: "0.25em", color: "rgba(197,168,128,0.7)", textTransform: "uppercase", fontFamily: "var(--font-sans)" }}>
            Theme Preview
          </span>
          <button
            onClick={() => setVisible(false)}
            aria-label="Close theme switcher"
            style={{ color: "rgba(244,241,234,0.35)", fontSize: "14px", lineHeight: 1, background: "none", border: "none", cursor: "pointer", padding: "2px 4px" }}
          >
            ✕
          </button>
        </div>

        {/* Theme buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {THEMES.map((theme) => {
            const isActive = active === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => select(theme.id)}
                aria-pressed={isActive}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: isActive
                    ? `1px solid ${theme.swatch}`
                    : "1px solid rgba(244,241,234,0.08)",
                  background: isActive
                    ? `${theme.swatch}14`
                    : "rgba(244,241,234,0.03)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                  width: "100%",
                }}
              >
                {/* Colour swatch */}
                <span
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: theme.swatch,
                    border: isActive ? `2px solid ${theme.swatch}` : "2px solid rgba(255,255,255,0.12)",
                    boxShadow: isActive ? `0 0 8px ${theme.swatch}60` : "none",
                  }}
                />
                <span style={{ flex: 1 }}>
                  <span style={{
                    display: "block",
                    fontSize: "11px",
                    letterSpacing: "0.04em",
                    color: isActive ? "#F4F1EA" : "rgba(244,241,234,0.55)",
                    fontFamily: "var(--font-sans)",
                    fontWeight: isActive ? 500 : 400,
                    lineHeight: 1.2,
                  }}>
                    {theme.label}
                  </span>
                  <span style={{
                    display: "block",
                    fontSize: "9px",
                    letterSpacing: "0.06em",
                    color: isActive ? theme.swatch : "rgba(244,241,234,0.3)",
                    fontFamily: "var(--font-sans)",
                    marginTop: "2px",
                    lineHeight: 1,
                  }}>
                    {theme.description}
                  </span>
                </span>
                {/* Active indicator */}
                {isActive && (
                  <span style={{ color: theme.swatch, fontSize: "10px", marginLeft: "2px" }}>✓</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer note */}
        <p style={{ marginTop: "12px", fontSize: "8.5px", letterSpacing: "0.06em", color: "rgba(244,241,234,0.25)", fontFamily: "var(--font-sans)", lineHeight: 1.4, textAlign: "center" }}>
          Preview only · choice not permanent yet
        </p>
      </div>
    </div>
  );
}
