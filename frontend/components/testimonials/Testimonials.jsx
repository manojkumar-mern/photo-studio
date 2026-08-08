"use client";

import { useState } from "react";
import { testimonials } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Testimonials() {
  const [activeIdx, setActiveIdx] = useState(0);

  const nextSlide = () => {
    setActiveIdx((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActiveIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="relative bg-[#0C0C0D] py-24 md:py-36 px-6 md:px-12 z-20 border-b border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Column: Testimonial Slideshow */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <span className="text-[10px] font-sans tracking-[0.3em] text-[#C5A880] uppercase block mb-3">
              CLIENT EXPERIENCES
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#F4F1EA]">
              Testimonials
            </h2>
          </div>

          <div className="min-h-[250px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <p className="font-serif text-xl md:text-2xl text-[#E8E3D5] leading-relaxed italic">
                  "{testimonials[activeIdx].quote}"
                </p>
                <div>
                  <h4 className="text-xs font-sans tracking-[0.2em] text-[#F4F1EA] uppercase">
                    [{testimonials[activeIdx].author}]
                  </h4>
                  <p className="text-[10px] font-sans tracking-[0.1em] text-[#8E8E93] uppercase">
                    [{testimonials[activeIdx].context}]
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Navigation Controls */}
            <div className="flex items-center gap-6 mt-8">
              <button
                onClick={prevSlide}
                className="text-xs font-sans tracking-[0.15em] text-[#8E8E93] hover:text-[#F4F1EA] transition-colors"
                aria-label="Previous testimonial"
              >
                PREV
              </button>
              <div className="text-[10px] font-sans tracking-widest text-[#C5A880]">
                {activeIdx + 1} / {testimonials.length}
              </div>
              <button
                onClick={nextSlide}
                className="text-xs font-sans tracking-[0.15em] text-[#8E8E93] hover:text-[#F4F1EA] transition-colors"
                aria-label="Next testimonial"
              >
                NEXT
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Behind the Lens Media Placeholder */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-[10px] font-sans tracking-[0.25em] text-[#C5A880] uppercase block">
            BEHIND THE LENS
          </span>
          <div className="relative h-[40vh] w-full bg-[#161618] overflow-hidden border border-white/5 group">
            <Image
              src="https://images.unsplash.com/photo-1452780212940-6f5c0d14d84a?q=80&w=800&auto=format&fit=crop"
              alt="Behind the Scenes Studio Session"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-103"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            {/* Visual Indicator of video play */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="border border-white/20 p-4 text-[10px] tracking-widest text-[#F4F1EA] uppercase">
                [PROCESS PREVIEW LOOP]
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
