"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { portfolioItems } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import WorkGallery from "./WorkGallery";

export default function WorkIndex() {
  const [selectedProject, setSelectedProject] = useState(null);

  // Sync state with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const pathParts = window.location.pathname.split("/");
      const slug = pathParts[2]; // /work/[slug]
      
      if (slug) {
        const item = portfolioItems.find((p) => p.slug === slug);
        if (item) setSelectedProject(item);
      } else {
        setSelectedProject(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    
    // Check initial path on client mount
    const initialSlug = window.location.pathname.split("/")[2];
    if (initialSlug) {
      const item = portfolioItems.find((p) => p.slug === initialSlug);
      if (item) setSelectedProject(item);
    }

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleProjectSelect = (project) => {
    // Settle animation first, then push state and select
    window.history.pushState(null, "", `/work/${project.slug}`);
    setSelectedProject(project);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClose = (e) => {
    if (e) e.preventDefault();
    window.history.pushState(null, "", "/work");
    setSelectedProject(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToProject = (slug) => {
    const item = portfolioItems.find((p) => p.slug === slug);
    if (item) {
      window.history.pushState(null, "", `/work/${slug}`);
      setSelectedProject(item);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {!selectedProject ? (
            <motion.div
              key="gallery-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              className="space-y-16"
            >
              {/* Page Heading */}
              <div className="text-center md:text-left">
                <span className="text-[10px] font-sans tracking-[0.3em] text-primary uppercase block mb-3 font-semibold">
                  GALLERY ARCHIVE
                </span>
                <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-4 leading-tight">
                  Our Work
                </h1>
                <p className="text-sm font-sans text-muted-foreground max-w-xl leading-relaxed">
                  A curated selection of visual narratives, exploring raw character, editorial lighting styling, and architectural spaces.
                </p>
              </div>

              {/* Filtering + Cards list */}
              <WorkGallery onSelect={handleProjectSelect} />
            </motion.div>
          ) : (
            <motion.div
              key="project-details"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-16"
            >
              {/* Back to archive action */}
              <button
                onClick={handleClose}
                className="text-[10px] font-sans tracking-[0.25em] text-muted-foreground hover:text-foreground inline-flex items-center gap-2 cursor-pointer focus:outline-none"
              >
                ← BACK TO ARCHIVE
              </button>

              {/* Dynamic Project Editorial Headers */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
                <div className="lg:col-span-8 space-y-4">
                  <span className="text-[10px] font-sans tracking-[0.3em] text-primary uppercase block font-semibold">
                    {selectedProject.category}
                  </span>
                  <h1 className="text-4xl md:text-7xl font-serif text-foreground leading-[1.1]">
                    {selectedProject.title}
                  </h1>
                </div>
                <div className="lg:col-span-4 text-left lg:text-right text-xs font-sans text-muted-foreground tracking-[0.1em] space-y-1">
                  <p className="text-foreground font-medium uppercase">[LOCATION / DETAILS]</p>
                  <p>{selectedProject.location}</p>
                  <p>Date: {selectedProject.date}</p>
                </div>
              </div>

              {/* Shared layout animated expansion image frame */}
              <motion.div
                layoutId={`card-container-${selectedProject.slug}`}
                className="relative w-full h-[60vh] md:h-[80vh] border border-border bg-card overflow-hidden"
              >
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                  sizes="90vw"
                  priority
                />
              </motion.div>

              {/* Concept statement */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
                <div className="lg:col-span-8 space-y-6 text-center md:text-left">
                  <h4 className="text-[10px] font-sans tracking-[0.25em] text-primary uppercase font-bold">
                    CREATIVE CONCEPT
                  </h4>
                  <p className="font-serif text-2xl md:text-3xl text-foreground/95 leading-relaxed italic">
                    "{selectedProject.description}"
                  </p>
                </div>
                
                {/* Highlights List */}
                <div className="lg:col-span-4 bg-card border border-border p-8 space-y-4">
                  <h4 className="text-[10px] font-sans tracking-[0.25em] text-foreground uppercase font-bold">
                    PROJECT HIGHLIGHTS
                  </h4>
                  <ul className="text-xs font-sans text-muted-foreground space-y-2 list-disc pl-4">
                    {selectedProject.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Secondary visual sequence grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pt-16">
                {selectedProject.images.slice(1).map((img, idx) => (
                  <div
                    key={idx}
                    className="relative h-[50vh] md:h-[70vh] border border-border bg-card overflow-hidden"
                  >
                    <Image
                      src={img}
                      alt={`Sequence Frame ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 90vw, 45vw"
                    />
                  </div>
                ))}
              </div>

              {/* Prev / Next Pagination */}
              <div className="border-t border-border pt-12 flex justify-between items-center text-[10px] font-sans tracking-[0.2em] uppercase">
                <button
                  onClick={() => navigateToProject(selectedProject.prevSlug)}
                  className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  ← PREVIOUS NARRATIVE
                </button>
                <button
                  onClick={() => navigateToProject(selectedProject.nextSlug)}
                  className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  NEXT NARRATIVE →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
