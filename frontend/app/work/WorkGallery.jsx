"use client";

import { useState } from "react";
import { portfolioItems } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import PortfolioCard from "@/components/portfolio/PortfolioCard";
import { LayoutGrid } from "@/components/ui/layout-grid";

const FILTERS = [
  { label: "All",                  value: "ALL"                    },
  { label: "Wedding Documentary",  value: "WEDDING DOCUMENTARY"    },
  { label: "Fashion Editorial",    value: "FASHION EDITORIAL"      },
  { label: "Fine Art Portraiture", value: "FINE ART PORTRAIT"      },
  { label: "Commercial Brand",     value: "COMMERCIAL BRAND"       },
];

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 36, scale: 0.97 },
  show:   { opacity: 1, y: 0,  scale: 1,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function WorkGallery({ onSelect }) {
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filteredItems =
    activeFilter === "ALL"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeFilter);

  const totalVisible = filteredItems.length;

  return (
    <div className="space-y-10">

      {/* ── Filter Bar ──────────────────────────────────────── */}
      <div className="space-y-4">
        {/* Decorative rule above */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Horizontally scrollable on mobile so filters never wrap or overflow */}
        <div
          className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none"
          role="group"
          aria-label="Filter portfolio by category"
        >
          {FILTERS.map((f) => {
            const isActive = activeFilter === f.value;
            const count =
              f.value === "ALL"
                ? portfolioItems.length
                : portfolioItems.filter((i) => i.category === f.value).length;

            return (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                aria-pressed={isActive}
                className={`group relative flex-shrink-0 inline-flex items-center gap-2 px-3.5 py-2 text-[9px] font-sans tracking-[0.2em] uppercase font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap
                  ${isActive
                    ? "bg-primary text-primary-foreground border border-primary"
                    : "bg-transparent text-muted-foreground border border-border/60 hover:border-primary/50 hover:text-foreground"
                  }`}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground/70 flex-shrink-0" aria-hidden="true" />
                )}
                {f.label}
                <span
                  className={`text-[8px] font-mono px-1.5 py-0.5 transition-colors duration-300 flex-shrink-0
                    ${isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    }`}
                  aria-label={`${count} projects`}
                >
                  {count}
                </span>
              </button>
            );
          })}

          {/* Result count — pushed right on desktop only */}
          <div className="ml-auto hidden md:flex flex-shrink-0 items-center gap-1.5 text-[9px] font-sans tracking-[0.2em] text-muted-foreground/60 uppercase pl-4">
            <span className="font-serif text-sm text-foreground/30">{totalVisible}</span>
            result{totalVisible !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Decorative rule below */}
        <div className="h-[1px] bg-gradient-to-r from-primary/30 via-border to-transparent" />
      </div>

      {/* ── Portfolio Grid ──────────────────────────────────── */}
      <div key={activeFilter} className="w-full">
        <LayoutGrid
          cards={filteredItems.map((item, idx) => ({
            id: item.id,
            className: idx % 3 === 0 ? "md:col-span-2 col-span-1" : "col-span-1",
            thumbnail: item.image,
            item: item,
            content: (
              <div className="space-y-4 text-left">
                <div>
                  <span className="text-[10px] font-sans tracking-[0.25em] text-primary uppercase font-bold">
                    {item.category}
                  </span>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif text-white mt-1">
                    {item.title}
                  </h3>
                  <p className="text-xs font-sans text-white/50 mt-1">
                    {item.location} · {item.year}
                  </p>
                </div>
                <p className="text-sm font-sans text-white/80 max-w-lg leading-relaxed">
                  {item.description}
                </p>
                {item.highlights && item.highlights.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[9px] font-sans tracking-[0.2em] text-primary/70 uppercase font-semibold">
                      Highlights
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {item.highlights.map((h, i) => (
                        <span
                          key={i}
                          className="text-[9px] font-sans tracking-wider text-white/70 bg-white/10 px-2 py-1 rounded"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(item);
                    }}
                    className="inline-flex items-center gap-2 text-xs font-sans tracking-[0.2em] text-primary hover:text-white uppercase font-bold transition-colors duration-200"
                  >
                    <span>View Case Study</span>
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 16 16"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </button>
                </div>
              </div>
            )
          }))}
          onSelect={onSelect}
        />
      </div>

      {/* ── Empty State ─────────────────────────────────────── */}
      {filteredItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-32 gap-4 border border-dashed border-border/40"
        >
          {/* Decorative camera aperture icon */}
          <svg className="w-10 h-10 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeLinecap="round" />
          </svg>
          <p className="text-[11px] font-sans tracking-[0.25em] text-muted-foreground/50 uppercase">
            No projects in this category
          </p>
        </motion.div>
      )}

      {/* ── Bottom decorative rule ──────────────────────────── */}
      {filteredItems.length > 0 && (
        <div className="flex items-center gap-4 pt-4">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
          <span className="text-[9px] font-sans tracking-[0.3em] text-muted-foreground/40 uppercase">
            End of archive
          </span>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
      )}
    </div>
  );
}
