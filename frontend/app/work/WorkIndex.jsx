"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { portfolioItems } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import WorkGallery from "./WorkGallery";

// ── Helpers ──────────────────────────────────────────────────

function CornerBracket({ position, size = "w-6 h-6", color = "#C5A880" }) {
  const pos = {
    "top-left":     "top-0 left-0 rotate-0",
    "top-right":    "top-0 right-0 rotate-90",
    "bottom-right": "bottom-0 right-0 rotate-180",
    "bottom-left":  "bottom-0 left-0 -rotate-90",
  };
  return (
    <span className={`absolute ${size} pointer-events-none z-10 ${pos[position]}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M2 14 L2 2 L14 2" stroke={color} strokeWidth="1.5" strokeLinecap="square" />
      </svg>
    </span>
  );
}

function Divider({ label }) {
  return (
    <div className="flex items-center gap-4 py-2" role="presentation">
      <div className="h-[1px] w-8 bg-primary flex-shrink-0" />
      {label && (
        <span className="text-[9px] font-sans tracking-[0.3em] text-primary uppercase font-semibold">
          {label}
        </span>
      )}
      <div className="flex-1 h-[1px] bg-gradient-to-r from-border to-transparent" />
    </div>
  );
}

function FramedImage({ src, alt, className = "", sizes = "90vw", priority = false }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute -inset-2 border border-primary/10 pointer-events-none z-0" aria-hidden="true" />
      <div className="relative w-full h-full overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={sizes}
          priority={priority}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" aria-hidden="true" />
      </div>
      <CornerBracket position="top-left" />
      <CornerBracket position="top-right" />
      <CornerBracket position="bottom-right" />
      <CornerBracket position="bottom-left" />
    </div>
  );
}

// ── Project detail (inline view inside /work) ─────────────────
function ProjectDetail({ project, onClose }) {
  const prev = portfolioItems.find((p) => p.slug === project.prevSlug);
  const next = portfolioItems.find((p) => p.slug === project.nextSlug);

  return (
    <motion.div
      key={project.slug}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="space-y-16 md:space-y-20"
    >
      {/* Back */}
      <button
        onClick={onClose}
        className="group inline-flex items-center gap-3 text-[10px] font-sans tracking-[0.25em] text-muted-foreground hover:text-primary transition-colors uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <svg className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform duration-200" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 8H3M7 4L3 8l4 4" />
        </svg>
        Back to archive
      </button>

      {/* Header */}
      <div className="space-y-8">
        <Divider label={project.category} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-foreground leading-[0.95] tracking-tight">
              {project.title}
            </h1>
          </div>
          <div className="lg:col-span-4">
            <div className="border-l-2 border-primary pl-4 space-y-3">
              {[
                { label: "Location", value: project.location },
                { label: "Date",     value: project.date     },
                { label: "Category", value: project.category },
              ].map(({ label, value }) => (
                <div key={label}>
                  <span className="text-[9px] font-sans tracking-[0.25em] text-primary uppercase font-semibold block">
                    {label}
                  </span>
                  <span className="text-xs font-sans text-muted-foreground mt-0.5 block">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hero image */}
      <FramedImage
        src={project.image}
        alt={project.title}
        className="w-full h-[50vh] sm:h-[60vh] md:h-[75vh]"
        priority
      />

      {/* Concept + highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-5">
          <Divider label="Creative Concept" />
          <div className="font-serif text-7xl text-primary/15 leading-none select-none -mb-4" aria-hidden="true">&ldquo;</div>
          <p className="font-serif text-xl md:text-2xl lg:text-3xl text-foreground/90 leading-relaxed italic pl-2">
            {project.description}
          </p>
        </div>
        <div className="lg:col-span-5">
          <div className="relative border border-border/50 p-6 md:p-7 space-y-5 bg-card">
            <CornerBracket position="top-left"     size="w-4 h-4" color="rgba(197,168,128,0.35)" />
            <CornerBracket position="top-right"    size="w-4 h-4" color="rgba(197,168,128,0.35)" />
            <CornerBracket position="bottom-right" size="w-4 h-4" color="rgba(197,168,128,0.35)" />
            <CornerBracket position="bottom-left"  size="w-4 h-4" color="rgba(197,168,128,0.35)" />
            <Divider label="Project Highlights" />
            <ul className="space-y-3" aria-label="Project highlights">
              {project.highlights?.map((h, i) => (
                <li key={i} className="flex items-start gap-3 text-xs font-sans text-muted-foreground">
                  <span
                    className="flex-shrink-0 w-5 h-5 border border-primary/30 flex items-center justify-center text-[9px] font-mono text-primary mt-0.5"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Secondary images */}
      {project.images.slice(1).length > 0 && (
        <div className="space-y-6">
          <Divider label="Visual Sequence" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {project.images.slice(1).map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.55, delay: idx * 0.1, ease: "easeOut" }}
              >
                <FramedImage
                  src={img}
                  alt={`${project.title} — frame ${idx + 2}`}
                  className={`w-full ${idx % 2 === 0 ? "h-[50vh]" : "h-[44vh]"}`}
                  sizes="(max-width: 768px) 90vw, 45vw"
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Prev / Next */}
      <div className="space-y-4 pt-4">
        <Divider />
        <div className="grid grid-cols-2 gap-6">
          {prev && (
            <button
              onClick={() => {
                /* Scroll up then swap project */
                window.scrollTo({ top: 0, behavior: "smooth" });
                /* Delay swap slightly so scroll starts first */
                setTimeout(() => onClose(prev), 300);
              }}
              className="group flex flex-col items-start gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="inline-flex items-center gap-2 text-[9px] font-sans tracking-[0.25em] text-muted-foreground group-hover:text-primary transition-colors uppercase">
                <svg className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 8H3M7 4L3 8l4 4" />
                </svg>
                Previous
              </div>
              <span className="text-sm font-serif text-foreground/60 group-hover:text-foreground transition-colors line-clamp-1">
                {prev.title}
              </span>
            </button>
          )}
          {next && (
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setTimeout(() => onClose(next), 300);
              }}
              className="group flex flex-col items-end gap-1 text-right focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="inline-flex items-center gap-2 text-[9px] font-sans tracking-[0.25em] text-muted-foreground group-hover:text-primary transition-colors uppercase">
                Next
                <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </div>
              <span className="text-sm font-serif text-foreground/60 group-hover:text-foreground transition-colors line-clamp-1">
                {next.title}
              </span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Gallery list view ──────────────────────────────────────────
function GalleryList({ onSelect }) {
  return (
    <motion.div
      key="gallery-list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-12 md:space-y-16"
    >
      {/* Heading */}
      <div className="space-y-5">
        <Divider label="Gallery Archive" />
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif text-foreground leading-[0.95]">
              Our{" "}
              <span className="italic font-light text-gold-foil">Work</span>
            </h1>
            <p className="text-sm font-sans text-muted-foreground max-w-lg leading-relaxed">
              A curated selection of visual narratives — exploring raw character, editorial lighting, and architectural spaces.
            </p>
          </div>
          {/* Stats */}
          <div className="flex items-center gap-8 flex-shrink-0">
            {[
              { value: portfolioItems.length, label: "Projects"   },
              { value: "4",                   label: "Categories" },
              { value: "2025–",               label: "Archive"    },
            ].map(({ value, label }) => (
              <div key={label} className="text-center space-y-1">
                <p className="font-serif text-2xl text-primary" aria-label={`${value} ${label}`}>{value}</p>
                <p className="text-[9px] font-sans tracking-[0.2em] text-muted-foreground uppercase" aria-hidden="true">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery */}
      <WorkGallery onSelect={onSelect} />
    </motion.div>
  );
}

// ── Root ───────────────────────────────────────────────────────
export default function WorkIndex() {
  const [selectedProject, setSelectedProject] = useState(null);

  const handleSelect = (project) => {
    setSelectedProject(project);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Called both by "Back" and by prev/next navigation.
  // If a project is passed, navigate to it; otherwise go back to list.
  const handleClose = (nextProject = null) => {
    if (nextProject) {
      setSelectedProject(nextProject);
    } else {
      setSelectedProject(null);
    }
  };

  return (
    <div className="min-h-screen pt-28 md:pt-32 pb-24 md:pb-32 px-6 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {!selectedProject ? (
            <GalleryList key="list" onSelect={handleSelect} />
          ) : (
            <ProjectDetail
              key={selectedProject.slug}
              project={selectedProject}
              onClose={handleClose}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
