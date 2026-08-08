"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";

export default function PortfolioCard({ item, idx, onClick, isSelected }) {
  // Motion values for tilt coordinates [0, 1]
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Smooth tilt springs
  const rotateX = useSpring(useTransform(y, [0, 1], [4, -4]), { damping: 20, stiffness: 150 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-4, 4]), { damping: 20, stiffness: 150 });

  const handleMouseMove = (e) => {
    if (window.innerWidth < 1024) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  const isLarge = idx % 3 === 0;
  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Outer container animations (subtle 3D lift)
  const containerVariants = {
    rest: {
      y: 0,
      borderColor: "rgba(244, 241, 234, 0.08)",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
    },
    hover: {
      y: prefersReducedMotion ? 0 : -6,
      borderColor: "rgba(197, 168, 128, 0.3)",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)"
    }
  };

  return (
    <motion.div
      layoutId={`card-container-${item.slug}`}
      variants={containerVariants}
      initial="rest"
      whileHover="hover"
      animate="rest"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(item)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(item);
        }
      }}
      style={{
        rotateX: prefersReducedMotion ? 0 : rotateX,
        rotateY: prefersReducedMotion ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative w-full overflow-hidden border bg-card cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary ${
        isLarge ? "md:col-span-2 h-[60vh] md:h-[70vh]" : "h-[45vh] md:h-[55vh]"
      }`}
    >
      {/* Background Text Layer (Revealed when image slides down) */}
      <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-start text-left pointer-events-none z-0">
        <motion.div
          variants={{
            rest: { opacity: 0, y: -10 },
            hover: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="space-y-3"
        >
          <span className="text-[10px] font-sans tracking-[0.25em] text-primary block font-medium">
            {item.category}
          </span>
          <h3 className="text-xl md:text-3xl font-serif text-foreground leading-tight">
            {item.title}
          </h3>
          <p className="text-xs font-sans text-muted-foreground tracking-[0.05em] leading-relaxed max-w-xl">
            {item.description}
          </p>
          <span className="text-[10px] font-sans tracking-[0.25em] text-primary inline-flex items-center gap-2 pt-2">
            VIEW PROJECT <span className="text-xs">→</span>
          </span>
        </motion.div>
      </div>

      {/* Sliding Image Layer (Covers by default, drops down on hover) */}
      <motion.div
        variants={{
          rest: { y: "0%", scale: 1 },
          hover: { y: prefersReducedMotion ? "0%" : "42%", scale: 1 }
        }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ transform: "translateZ(15px)" }}
        className="absolute inset-0 w-full h-full z-10 overflow-hidden border-t border-white/5"
      >
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
          sizes={isLarge ? "90vw" : "(max-width: 768px) 90vw, 45vw"}
          priority={isLarge}
        />
        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 transition-opacity duration-300" />
      </motion.div>
    </motion.div>
  );
}
