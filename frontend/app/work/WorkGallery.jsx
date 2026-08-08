"use client";

import { useState } from "react";
import { portfolioItems } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import PortfolioCard from "@/components/portfolio/PortfolioCard";

export default function WorkGallery({ onSelect }) {
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filters = ["ALL", "WEDDING DOCUMENTARY", "FASHION EDITORIAL", "FINE ART PORTRAITURE"];

  const filteredItems = activeFilter === "ALL"
    ? portfolioItems
    : portfolioItems.filter(item => item.category === activeFilter);

  return (
    <div className="space-y-12">
      {/* Category Filter Bar */}
      <div className="flex flex-wrap gap-x-8 gap-y-3 border-b border-border pb-4">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`text-[10px] font-sans tracking-[0.2em] transition-colors cursor-pointer uppercase ${
              activeFilter === filter ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Asymmetric Portfolio Gallery Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <PortfolioCard
                item={item}
                idx={idx}
                onClick={onSelect}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
