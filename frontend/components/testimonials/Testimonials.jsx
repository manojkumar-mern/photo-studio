"use client";

import { useState, useEffect } from "react";
import { testimonials } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Testimonials() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const nextSlide = () => {
    setIsLoaded(false);
    setActiveIdx((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setIsLoaded(false);
    setActiveIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const revealVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  return (
    <section id="testimonials" className="relative bg-[#FAF8F5] py-24 md:py-36 px-6 md:px-12 z-20 border-b border-[#E8E4DC]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Column: Testimonial Slideshow */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={revealVariants}
          className="lg:col-span-7 space-y-8"
        >
          <div>
            <span className="text-[10px] font-sans tracking-[0.3em] text-primary uppercase block mb-3">
              CLIENT EXPERIENCES
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#1C1C1E]">
              Testimonials
            </h2>
          </div>

          <div className="min-h-[250px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-6"
              >
                <p className="font-serif text-xl md:text-2xl text-[#1C1C1E] leading-relaxed italic">
                  &ldquo;{testimonials[activeIdx].quote}&rdquo;
                </p>
                <div>
                  <h4 className="text-xs font-sans tracking-[0.2em] text-[#1C1C1E] uppercase">
                    [{testimonials[activeIdx].author}]
                  </h4>
                  <p className="text-[10px] font-sans tracking-[0.1em] text-[#5A5A5C] uppercase">
                    [{testimonials[activeIdx].context}]
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Navigation Controls */}
            <div className="flex items-center gap-6 mt-8">
              <button
                onClick={prevSlide}
                className="text-xs font-sans tracking-[0.2em] text-[#5A5A5C] hover:text-primary transition-colors py-2 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm"
                aria-label="Previous testimonial"
              >
                PREV
              </button>
              <div className="text-[10px] font-sans tracking-widest text-primary font-semibold select-none">
                {String(activeIdx + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
              </div>
              <button
                onClick={nextSlide}
                className="text-xs font-sans tracking-[0.2em] text-[#5A5A5C] hover:text-primary transition-colors py-2 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm"
                aria-label="Next testimonial"
              >
                NEXT
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Behind the Lens Media */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={revealVariants}
          className="lg:col-span-5 space-y-4"
        >
          <span className="text-[10px] font-sans tracking-[0.25em] text-primary uppercase block">
            BEHIND THE LENS
          </span>
          <div className="relative h-[40vh] w-full bg-card overflow-hidden rounded-xl border border-border group">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 0.8, scale: 1.0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative w-full h-full"
              >
                <Image
                  src={testimonials[activeIdx].image}
                  alt={testimonials[activeIdx].author}
                  fill
                  className={`object-cover transition-all duration-1000 ease-out hover:scale-103 ${
                    isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
                  }`}
                  onLoad={() => setIsLoaded(true)}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
