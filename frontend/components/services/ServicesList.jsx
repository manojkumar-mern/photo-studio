"use client";

import { useState } from "react";
import Image from "next/image";
import { services } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";

export default function ServicesList() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section id="services" className="relative bg-background py-24 md:py-36 px-6 md:px-12 z-20 border-b border-border">
      <div className="max-w-7xl mx-auto">
        <span className="text-[10px] font-sans tracking-[0.3em] text-primary uppercase block mb-3">
          CREATIVE SERVICES
        </span>
        <h2 className="text-3xl md:text-5xl font-serif text-foreground mb-16">
          Photography experiences
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Services List Panel */}
          <div className="lg:col-span-7 space-y-2">
            {services.map((service, idx) => (
              <div
                key={service.id}
                onMouseEnter={() => setActiveIdx(idx)}
                className={`py-8 border-b border-border cursor-pointer transition-all duration-350 ${
                  activeIdx === idx ? "opacity-100" : "opacity-40"
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl md:text-4xl font-serif text-foreground">
                    {service.name}
                  </h3>
                  <span className="text-xs font-sans text-primary tracking-wider">
                    0{idx + 1}
                  </span>
                </div>

                <AnimatePresence initial={false}>
                  {activeIdx === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="text-base md:text-lg font-sans text-muted-foreground leading-relaxed max-w-xl mb-6">
                        {service.description}
                      </p>
                      <a
                        href="#book"
                        className="inline-block text-xs font-sans tracking-[0.2em] text-primary hover:text-foreground transition-colors"
                      >
                        BOOK SESSION →
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="lg:col-span-5 relative h-[50vh] md:h-[60vh] w-full bg-card overflow-hidden rounded-xl border border-border">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 0.8, scale: 1.0 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={services[activeIdx].image}
                  alt={services[activeIdx].name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-40 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
