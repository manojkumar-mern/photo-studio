"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const LayoutGrid = ({ cards, onSelect }) => {
  const [selected, setSelected] = useState(null);
  const [lastSelected, setLastSelected] = useState(null);

  const handleClick = (card) => {
    setLastSelected(selected);
    setSelected(card);
  };

  const handleOutsideClick = () => {
    setLastSelected(selected);
    setSelected(null);
  };

  return (
    <div className="w-full h-full grid grid-cols-1 md:grid-cols-3 grid-flow-row-dense max-w-7xl mx-auto gap-6 relative">
      {cards.map((card, i) => (
        <div key={card.id || i} className={cn(card.className, "relative min-h-[380px] md:min-h-[460px]")}>
          <motion.div
            onClick={() => handleClick(card)}
            className={cn(
              "relative overflow-hidden cursor-pointer w-full h-full rounded-xl transition-all duration-300 card-glow border border-border/40",
              selected?.id === card.id
                ? "fixed md:absolute inset-x-6 md:inset-x-0 top-24 bottom-24 md:top-0 md:bottom-0 md:h-[90%] md:w-[90%] m-auto z-50 flex justify-center items-center flex-wrap flex-col bg-card"
                : lastSelected?.id === card.id
                ? "z-40 h-full w-full"
                : "h-full w-full"
            )}
            layoutId={`card-${card.id}`}
          >
            {selected?.id === card.id && (
              <SelectedCard selected={selected} handleClose={handleOutsideClick} onSelect={onSelect} />
            )}
            <ImageComponent card={card} isSelected={selected?.id === card.id} />
          </motion.div>
        </div>
      ))}
      <motion.div
        onClick={handleOutsideClick}
        className={cn(
          "fixed inset-0 h-full w-full bg-black/70 z-40 backdrop-blur-sm transition-opacity",
          selected?.id ? "pointer-events-auto block" : "pointer-events-none hidden"
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: selected?.id ? 1 : 0 }}
        exit={{ opacity: 0 }}
      />
    </div>
  );
};

const ImageComponent = ({ card, isSelected }) => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <motion.div
        layoutId={`image-${card.id}-image-container`}
        className="w-full h-full"
      >
        <Image
          src={card.thumbnail}
          alt="project thumbnail"
          fill
          className={cn(
            "object-cover object-center transition-all duration-500",
            isSelected ? "scale-100" : "scale-100 group-hover:scale-105"
          )}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </motion.div>
      {!isSelected && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10 flex flex-col justify-end p-6">
          <span className="text-[9px] font-sans tracking-[0.2em] text-primary uppercase font-semibold mb-1">
            {card.item?.category}
          </span>
          <h3 className="text-xl font-serif text-white leading-tight">
            {card.item?.title}
          </h3>
          <p className="text-[10px] font-sans tracking-[0.1em] text-white/50 mt-1">
            {card.item?.location} · {card.item?.year}
          </p>
        </div>
      )}
    </div>
  );
};

const SelectedCard = ({ selected, handleClose, onSelect }) => {
  return (
    <div className="bg-transparent h-full w-full flex flex-col justify-end rounded-xl relative z-50">
      {/* Dark gradient overlay inside the card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.85 }}
        className="absolute inset-0 h-full w-full bg-gradient-to-t from-black via-black/75 to-black/40 z-10 rounded-xl"
      />

      {/* Close button inside expanded card */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/40 border border-white/10 hover:bg-black/75 text-white/70 hover:text-white transition-all duration-200"
        aria-label="Close details"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <motion.div
        layoutId={`content-${selected?.id}`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative p-6 md:p-8 z-20 w-full"
      >
        {selected?.content}
      </motion.div>
    </div>
  );
};
