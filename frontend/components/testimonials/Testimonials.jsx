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
    <section id="testimonials" className="relative bg-background py-24 md:py-36 px-6 md:px-12 z-20 border-b border-border">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Column: Testimonial Slideshow */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <span className="text-[10px] font-sans tracking-[0.3em] text-primary uppercase block mb-3">
              CLIENT EXPERIENCES
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-foreground">
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
                <p className="font-serif text-xl md:text-2xl text-foreground leading-relaxed italic">
                  &ldquo;{testimonials[activeIdx].quote}&rdquo;
                </p>
                <div>
                  <h4 className="text-xs font-sans tracking-[0.2em] text-foreground uppercase">
                    [{testimonials[activeIdx].author}]
                  </h4>
                  <p className="text-[10px] font-sans tracking-[0.1em] text-muted-foreground uppercase">
                    [{testimonials[activeIdx].context}]
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Navigation Controls */}
            <div className="flex items-center gap-6 mt-8">
              <button
                onClick={prevSlide}
                className="text-xs font-sans tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Previous testimonial"
              >
                PREV
              </button>
              <div className="text-[10px] font-sans tracking-widest text-primary">
                {activeIdx + 1} / {testimonials.length}
              </div>
              <button
                onClick={nextSlide}
                className="text-xs font-sans tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Next testimonial"
              >
                NEXT
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Behind the Lens Media Placeholder */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-[10px] font-sans tracking-[0.25em] text-primary uppercase block">
            BEHIND THE LENS
          </span>
          <div className="relative h-[40vh] w-full bg-card overflow-hidden rounded-xl border border-border group">
            <Image
              src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop"
              alt="Behind the Scenes Studio Session"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-103"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            {/* Visual Indicator of video play */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="border border-border p-4 text-[10px] tracking-widest text-foreground uppercase">
                [PROCESS PREVIEW LOOP]
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
