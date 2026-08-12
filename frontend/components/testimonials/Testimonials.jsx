"use client";

import { testimonials } from "@/lib/data";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { motion } from "framer-motion";

export default function Testimonials() {
  const formattedTestimonials = testimonials.map((t) => ({
    quote: t.quote,
    name: t.author,
    designation: t.context,
    src: t.image,
  }));

  const revealVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  return (
    <section id="testimonials" className="relative bg-[#FAF8F5] py-16 md:py-24 px-6 md:px-12 z-20 border-b border-[#E8E4DC]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={revealVariants}
          className="text-center mb-8"
        >
          <span className="text-[10px] font-sans tracking-[0.3em] text-primary uppercase block mb-3">
            CLIENT EXPERIENCES
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-[#1C1C1E]">
            Testimonials
          </h2>
        </motion.div>
        
        <AnimatedTestimonials testimonials={formattedTestimonials} autoplay={true} />
      </div>
    </section>
  );
}

