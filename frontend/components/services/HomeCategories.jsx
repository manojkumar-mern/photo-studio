"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { services } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const HIGHLIGHTS = {
  standard: "Essential Value Focus",
  premium: "Highly Recommended",
  elite: "Signature Production"
};

const GOALS = {
  standard: "Best for branding lookbooks, model test portfolios, & fresh campaigns.",
  premium: "Best for authentic candid wedding moments, rituals, & heirloom print albums.",
  elite: "Best for grand scale events, luxury destination weddings, & live venue displays."
};

const CARD_DATA = {
  standard: {
    hours: { half: "4 Hours", full: "8 Hours" },
    inclusions: {
      half: [
        "1 Principal Fashion Photographer & director",
        "Creative concept mapping & basic style briefing",
        "Studio flash & high-contrast setup design",
        "15 High-resolution retouched master files",
      ],
      full: [
        "1 Principal Fashion Photographer & director",
        "Creative concept mapping & basic style briefing",
        "Studio flash & high-contrast setup design",
        "30 High-resolution retouched master files",
        "Digital delivery with standard commercial license & 48h express delivery"
      ]
    }
  },
  premium: {
    hours: { half: "4 Hours", full: "8 Hours" },
    inclusions: {
      half: [
        "Dual Photographer Team (1 Candid specialist & 1 Traditional)",
        "Dedicated Candid Video & cinematic highlight teaser",
        "1 Custom Handcrafted Premium Linen Album (30 Pages)",
        "150+ Expertly color-graded digital negatives",
      ],
      full: [
        "Dual Photographer Team (1 Candid specialist & 1 Traditional)",
        "Dedicated Candid Video & cinematic highlight teaser",
        "1 Custom Handcrafted Premium Linen Album (50 Pages)",
        "300+ Expertly color-graded digital negatives",
        "Digital Master delivery with custom print release & physical keepsake box"
      ]
    }
  },
  elite: {
    hours: { half: "4 Hours", full: "8 Hours" },
    inclusions: {
      half: [
        "Full Multi-Crew Team (Traditional, Candid, & Cinema Directors)",
        "Exclusive Outdoor / Pre-wedding creative destination shoot",
        "1 Luxury Signature Album set with custom display box",
        "2 LED Screens (8x10 ft) for live venue broadcasting",
      ],
      full: [
        "Full Multi-Crew Team (Traditional, Candid, & Cinema Directors)",
        "Exclusive Outdoor / Pre-wedding creative destination shoot",
        "1 Luxury Signature Album set with custom display box",
        "2 LED Screens (8x10 ft) for live venue broadcasting",
        "Full-length cinematic documentary film, 4K highlight reel & 2 Parent mini albums"
      ]
    }
  }
};

function InteractiveCard({ service, idx, duration, hoveredIndex, setHoveredIndex, router }) {
  const isPremium = service.id === "premium";
  const cardData = CARD_DATA[service.id];
  const currentInclusions = cardData.inclusions[duration];
  
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setHoveredIndex(idx);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setHoveredIndex(null);
  };

  // Sibling focusing opacity style
  const siblingHovered = hoveredIndex !== null && hoveredIndex !== idx;
  
  return (
    <div className="relative flex flex-col h-full">
      {/* Premium Choice Top Badge - Placed outside of motion.div to prevent clipping from overflow-hidden */}
      {isPremium && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#C5A880] text-white rounded-full text-[8.5px] font-sans tracking-[0.25em] uppercase font-black shadow-md z-30 whitespace-nowrap">
          Most Popular
        </div>
      )}

      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => router.push(`/services?category=${service.id}`)}
        className={`group relative flex-1 flex flex-col justify-between p-6 sm:p-8 rounded-xl border cursor-pointer overflow-hidden transition-all duration-500 ${
          isPremium
            ? "bg-[#1C1C1E] border-[#C5A880] text-white shadow-xl"
            : "bg-[#FFFFFF] border-[#E8E4DC] text-[#1C1C1E] shadow-sm"
        } ${
          siblingHovered ? "opacity-45 scale-[0.98] blur-[0.5px]" : "opacity-100 scale-[1.02] shadow-2xl"
        }`}
        style={{
          transform: isHovered ? "translateY(-6px)" : "translateY(0)"
        }}
      >
        {/* Background Image Parallax Watermark */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out pointer-events-none z-0"
          style={{
            backgroundImage: `url(${service.image})`,
            opacity: isHovered ? (isPremium ? 0.15 : 0.09) : 0,
            transform: isHovered ? "scale(1.05) translate3d(0, 0, 0)" : "scale(1.15) translate3d(0, 0, 0)",
            filter: isPremium ? "contrast(115%) brightness(85%)" : "grayscale(20%) contrast(105%)",
          }}
        />

        {/* Solid/Gradient Overlay to match cards theme */}
        <div
          className="absolute inset-0 transition-opacity duration-500 pointer-events-none z-0"
          style={{
            background: isPremium 
              ? "linear-gradient(180deg, rgba(28,28,30,0.85) 0%, rgba(28,28,30,0.98) 100%)"
              : "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.99) 100%)",
          }}
        />

        {/* Interactive Radial Spotlight cursor tracker */}
        <div
          className="absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none z-10"
          style={{
            background: `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, ${
              isPremium ? "rgba(197, 168, 128, 0.2)" : "rgba(197, 168, 128, 0.15)"
            }, transparent 80%)`,
          }}
        />

        {/* Content wrapper */}
        <div className="relative z-10 space-y-6 text-left">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-sans tracking-[0.22em] text-[#C5A880] uppercase font-black">
                0{idx + 1} / Tier
              </span>
              <span className={`text-[8px] font-sans tracking-widest uppercase font-bold px-2 py-0.5 rounded-full ${
                isPremium ? "bg-white/10 text-white" : "bg-[#FAF8F5] text-[#8C8C8E]"
              }`}>
                {HIGHLIGHTS[service.id]}
              </span>
            </div>

            <h3 className="text-2xl font-serif leading-tight font-medium">
              {service.categoryName}
            </h3>

            <p className={`text-[9px] font-sans tracking-[0.15em] uppercase font-bold block pt-1 ${
              isPremium ? "text-[#C5A880]" : "text-[#1C1C1E]/60"
            }`}>
              {service.name} Focus
            </p>
          </div>

          {/* Core Goal Purpose */}
          <div className={`p-4 rounded-lg border text-xs font-sans leading-relaxed transition-all duration-300 ${
            isPremium 
              ? "bg-[#2A2A2C]/60 border-[#C5A880]/30 text-white/90" 
              : "bg-[#FAF8F5] border-[#E8E4DC] text-[#4A4A4C]"
          }`}>
            {GOALS[service.id]}
          </div>

          {/* Dynamic inclusions list */}
          <div className="space-y-3 min-h-[140px] flex flex-col justify-start">
            <ul className="space-y-3">
              <AnimatePresence mode="popLayout">
                {currentInclusions.map((benefit, i) => (
                  <motion.li
                    key={benefit}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.25, delay: i * 0.05 }}
                    className="flex items-start text-xs font-sans leading-relaxed"
                  >
                    <span className="text-[#C5A880] text-xs font-black mr-2.5 shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className={isPremium ? "text-white/85" : "text-[#4A4A4C]"}>
                      {benefit}
                    </span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        </div>

        {/* Card Bottom Direct Booking CTA */}
        <div className="relative z-10 pt-6 mt-6 border-t border-[#E8E4DC]/20" onClick={(e) => e.stopPropagation()}>
          <Link
            href={`/booking?service=${encodeURIComponent(service.name)}&category=${encodeURIComponent(service.categoryName)}`}
            className={`group/btn flex items-center justify-center gap-2 text-center text-[10px] font-sans tracking-[0.22em] px-4 py-3.5 rounded-lg uppercase font-bold transition-all duration-300 focus:outline-none ${
              isPremium
                ? "bg-[#C5A880] text-white hover:bg-white hover:text-[#1C1C1E] shadow-md"
                : "bg-[#1C1C1E] text-white hover:bg-[#C5A880] hover:text-white"
            }`}
          >
            <span>Book {service.categoryName}</span>
            <svg
              className="w-3 h-3 transform transition-transform duration-300 group-hover/btn:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function HomeCategories() {
  const router = useRouter();
  const [duration, setDuration] = useState("half"); // 'half' or 'full'
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="bg-[#FAF8F5] py-20 md:py-28 px-6 md:px-12 border-b border-[#E8E4DC] relative z-20">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Title & Duration Toggle */}
        <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto scroll-reveal">
          <div className="space-y-3">
            <span className="text-[10px] font-sans tracking-[0.3em] text-[#C5A880] uppercase font-bold block">
              EXPERIENCE TIERS
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-[#1C1C1E] tracking-tight">
              Our Package Categories
            </h2>
            <p className="text-sm font-sans text-[#5C5C5E] leading-relaxed max-w-xl mx-auto">
              Select a card to view dynamic details, or book your preferred category directly below.
            </p>
          </div>

          {/* Luxury sliding segment control */}
          <div className="inline-flex bg-[#E8E4DC]/40 p-1 rounded-full relative border border-[#E8E4DC]/60 shadow-inner">
            <button
              onClick={() => setDuration("half")}
              className={`relative z-10 px-6 py-2 rounded-full text-[10px] font-sans tracking-widest uppercase font-bold transition-colors duration-300 focus:outline-none ${
                duration === "half" ? "text-white" : "text-[#5C5C5E] hover:text-[#1C1C1E]"
              }`}
            >
              Half-Day Session
            </button>
            <button
              onClick={() => setDuration("full")}
              className={`relative z-10 px-6 py-2 rounded-full text-[10px] font-sans tracking-widest uppercase font-bold transition-colors duration-300 focus:outline-none ${
                duration === "full" ? "text-white" : "text-[#5C5C5E] hover:text-[#1C1C1E]"
              }`}
            >
              Full-Day Session
            </button>
            
            {/* sliding background indicator */}
            <motion.div
              layoutId="duration-pill"
              className="absolute top-1 bottom-1 bg-[#1C1C1E] rounded-full z-0"
              style={{
                left: duration === "half" ? "4px" : "calc(50% + 2px)",
                width: "calc(50% - 6px)"
              }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          </div>
        </div>

        {/* 3 Horizontal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch pt-6">
          {services.map((service, idx) => (
            <InteractiveCard
              key={service.id}
              service={service}
              idx={idx}
              duration={duration}
              hoveredIndex={hoveredIndex}
              setHoveredIndex={setHoveredIndex}
              router={router}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
