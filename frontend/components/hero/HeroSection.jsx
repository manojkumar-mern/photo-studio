"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-background">
      {/* Background Cinematic Image with Zoom Animation */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1.0, opacity: 0.4 }}
          transition={{ duration: 2.2, ease: "easeOut" }}
          className="relative w-full h-full"
        >
          <Image
            src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1920&auto=format&fit=crop"
            alt="Cinematic Portrait Cover"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </motion.div>
        {/* Deep Overlay Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/35 z-10" />
      </div>

      {/* Content Overlay */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-20 max-w-7xl mx-auto w-full px-6 md:px-12 text-center md:text-left flex flex-col justify-end h-full pb-20 md:pb-28"
      >
        {/* Micro Category */}
        <motion.span
          variants={itemVariants}
          className="text-xs font-sans tracking-[0.3em] text-primary mb-4 uppercase"
        >
          FINE ART & EDITORIAL PHOTOGRAPHY
        </motion.span>

        {/* Huge Title */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-8xl lg:text-9xl font-serif text-foreground leading-[0.9] tracking-tight max-w-4xl"
        >
          Capturing the <br />
          <span className="italic font-light text-primary">essence of shadow</span>
        </motion.h1>

        {/* Subtitle / CTA */}
        <div className="mt-8 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
          <motion.p
            variants={itemVariants}
            className="text-sm md:text-base font-sans text-muted-foreground max-w-sm leading-relaxed text-center md:text-left"
          >
            We document timeless human narratives, styling high-contrast compositions with raw, organic elegance.
          </motion.p>

          <motion.div variants={itemVariants}>
            <a
              href="#work"
              className="group text-xs font-sans tracking-[0.25em] text-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
            >
              EXPLORE WORKS
              <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-200">
                →
              </span>
            </a>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] font-sans tracking-[0.2em] text-muted-foreground uppercase">SCROLL</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-muted-foreground to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}
