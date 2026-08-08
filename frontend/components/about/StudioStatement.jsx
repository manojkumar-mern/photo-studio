"use client";

import { motion } from "framer-motion";

export default function StudioStatement() {
  return (
    <section className="relative bg-background py-24 md:py-36 px-6 md:px-12 z-20 border-b border-border">
      <div className="max-w-4xl mx-auto text-center md:text-left">
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-[10px] font-sans tracking-[0.3em] text-primary uppercase block mb-6"
        >
          PHILOSOPHY & ARTISTRY
        </motion.span>
        
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-3xl md:text-5xl lg:text-6xl text-foreground leading-[1.3] font-light tracking-tight"
        >
          We believe in photography that feels like a <span className="italic text-primary font-normal">cinematic memory</span>. 
          By embracing organic shadow and composition, we create portraits and visual campaigns that transcend temporary trends.
        </motion.p>
      </div>
    </section>
  );
}
