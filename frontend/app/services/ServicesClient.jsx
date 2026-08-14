"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { services } from "@/lib/data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";

// Ensure ScrollTrigger is registered
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const DETAIL_IMAGES = {
  standard: "/photos/makeup_1.webp",
  premium: "/photos/wedding_candid_2.webp",
  elite: "/photos/portrait_1.webp"
};

const CATEGORIES = [
  { id: "standard", number: "01", label: "STANDARD", tag: "Essential", highlight: "Essential Value Focus" },
  { id: "premium", number: "02", label: "PREMIUM", tag: "Enhanced", highlight: "Highly Recommended / Custom Heirloom Box Included" },
  { id: "elite", number: "03", label: "ELITE", tag: "Complete", highlight: "Signature Multi-crew & LED Broadcasting Displays" }
];

export default function ServicesClient() {
  const containerRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("standard");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get("category");
      if (catParam && ["standard", "premium", "elite"].includes(catParam.toLowerCase())) {
        setSelectedCategory(catParam.toLowerCase());
      }
    }
  }, []);

  useEffect(() => {
    // ScrollTrigger setup for container elements
    let ctx = gsap.context(() => {
      const revealElements = containerRef.current?.querySelectorAll(".scroll-reveal");
      if (revealElements && revealElements.length > 0) {
        revealElements.forEach((el) => {
          gsap.fromTo(el,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                toggleActions: "play none none none"
              }
            }
          );
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const activeService = services.find(s => s.id === selectedCategory) || services[0];
  const activeCategoryConfig = CATEGORIES.find(c => c.id === selectedCategory) || CATEGORIES[0];

  return (
    <>
      <Header />
      <main ref={containerRef} className="flex-1 bg-[#FAF8F5] pt-28 md:pt-32 pb-24 px-4 sm:px-6 md:px-12 text-[#1C1C1E] overflow-x-hidden w-full relative">
        <div className="max-w-7xl mx-auto">

          {/* Page heading */}
          <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8 scroll-reveal">
            <div className="space-y-3">
              <span className="text-[10px] font-sans tracking-[0.3em] text-primary uppercase block">
                Creative Formats
              </span>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif text-[#1C1C1E]">
                Our Services
              </h1>
              <p className="text-sm font-sans text-[#5C5C5E] max-w-xl leading-relaxed">
                We approach every project with custom creative direction. Explore our structured photography formats and booking details.
              </p>
            </div>

            {/* Category Selector */}
            <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
              <span className="text-[9px] font-sans tracking-[0.2em] text-[#5C5C5E] uppercase font-bold mb-1">
                Select Package Tier
              </span>
              <div className="relative flex p-1.5 bg-[#E8E4DC]/60 backdrop-blur rounded-full border border-[#D5D0C6] w-full max-w-sm md:w-[420px]">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className="relative flex-1 flex flex-col items-center py-2.5 transition-colors duration-300 focus:outline-none rounded-full z-10"
                  >
                    {selectedCategory === cat.id && (
                      <motion.div
                        layoutId="activeCategoryBg"
                        className="absolute inset-0 bg-[#1C1C1E] rounded-full -z-10"
                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                      />
                    )}
                    <span className={`text-[9px] font-sans tracking-[0.15em] font-bold ${
                      selectedCategory === cat.id ? "text-white" : "text-[#5C5C5E]"
                    }`}>
                      {cat.label}
                    </span>
                    <span className={`text-[7px] font-sans tracking-[0.1em] uppercase ${
                      selectedCategory === cat.id ? "text-primary/80" : "text-[#8C8C8E]"
                    }`}>
                      {cat.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Service Container */}
          <article className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center border-t border-[#E8E4DC] pt-12 md:pt-16 min-h-[60vh] scroll-reveal">
            
            {/* Image wrapper: Dual Cinematic Overlapping Layout */}
            <div className="service-img-wrapper lg:col-span-5 relative h-[50vh] md:h-[58vh] max-h-[620px] w-full flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCategory}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center w-full h-full"
                >
                  {/* Main Image Frame */}
                  <div className="service-img-main relative w-[76%] h-[76%] sm:w-[82%] sm:h-[82%] bg-[#161618] overflow-hidden rounded-xl border border-border/40 shadow-2xl mr-auto mb-auto">
                    <Image
                      src={activeService.image}
                      alt={`${activeService.name} — main photography`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 80vw, 30vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5]/10 to-transparent pointer-events-none" />
                  </div>

                  {/* Overlapping Detail Frame */}
                  <div className="service-img-detail absolute bottom-0 right-0 w-[44%] h-[44%] sm:w-[52%] sm:h-[52%] bg-[#161618] overflow-hidden rounded-xl border border-primary/20 shadow-2xl ml-auto mt-auto">
                    <Image
                      src={activeService.detailImage || DETAIL_IMAGES[selectedCategory]}
                      alt={`${activeService.name} — detail photography`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 45vw, 15vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5]/15 to-transparent pointer-events-none" />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Copy wrapper */}
            <div className="service-text-wrapper lg:col-span-7 space-y-8 flex flex-col justify-between h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCategory}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="space-y-6"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-[11px] font-sans tracking-[0.25em] text-[#C5A880] uppercase font-bold" aria-hidden="true">
                        {activeService.number} / {activeService.categoryName.toUpperCase()}
                      </span>
                      <span className="inline-block px-3 py-1 bg-[#C5A880]/15 text-[#C5A880] rounded-sm text-[9px] font-sans tracking-[0.15em] uppercase font-bold">
                        {activeCategoryConfig.highlight}
                      </span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#1C1C1E] leading-tight">
                      {activeService.name}
                    </h2>
                    <p className="text-[11px] font-sans tracking-[0.25em] text-[#C5A880] uppercase font-extrabold block">
                      {activeService.tagline}
                    </p>
                  </div>

                  <p className="text-sm sm:text-base md:text-lg text-[#3C3C3E] leading-relaxed max-w-xl">
                    {activeService.description}
                  </p>

                  {/* Included features rows */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-xs md:text-sm tracking-[0.25em] text-[#1C1C1E] uppercase font-extrabold border-b border-[#E8E4DC] pb-3">
                      What&apos;s Included & Deliverables
                    </h3>
                    <div className="divide-y divide-[#E8E4DC]/80">
                      {activeService.includes.map((inc, i) => (
                        <motion.div 
                          key={i}
                          whileHover={{ x: 8, opacity: 0.95 }}
                          transition={{ type: "spring", stiffness: 350, damping: 25 }}
                          className="flex items-center py-4 text-sm sm:text-base text-[#2C2C2E] group cursor-default transition-all duration-300"
                        >
                          <span className="font-sans text-xs md:text-sm tracking-wider text-[#C5A880] font-bold w-10 shrink-0">
                            0{i + 1}
                          </span>
                          <span className="group-hover:text-[#1C1C1E] transition-colors">{inc}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Ideal For block */}
                  <div className="space-y-2 pt-2">
                    <h3 className="text-xs md:text-sm tracking-[0.2em] text-[#1C1C1E] uppercase font-bold">
                      Ideal For
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4A4A4C] leading-relaxed">
                      {activeService.useCase}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Booking Button */}
              <div className="pt-6 border-t border-[#E8E4DC]/50 mt-6">
                <Link
                  href={`/booking?service=${encodeURIComponent(activeService.name)}&category=${encodeURIComponent(activeService.categoryName)}`}
                  className="inline-block text-xs font-sans tracking-[0.25em] border border-primary/45 hover:border-primary text-primary hover:bg-[#1C1C1E] hover:text-white px-10 py-4.5 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md uppercase font-bold"
                >
                  Book {activeService.categoryName} Experience
                </Link>
              </div>
            </div>

          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
