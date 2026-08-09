"use client";

import Link from "next/link";

const STUDIO_LINKS = [
  { label: "Our Story",      href: "/about"    },
  { label: "Selected Work",  href: "/work"     },
  { label: "Experiences",    href: "/services" },
];

const EXPLORE_LINKS = [
  { label: "Portfolio Selection", href: "/#work" },
  { label: "Project Archives",   href: "/work" },
  { label: "Enquiry Portal",     href: "/booking" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
  { label: "Vimeo",     href: "https://vimeo.com"     },
];

export default function Footer() {
  return (
    <footer
      className="bg-card border-t border-border/60 py-20 px-6 md:px-12 text-muted-foreground relative z-20"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* ── Top Statement & CTA ── */}
        <div className="border-b border-border/50 pb-16 mb-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="space-y-4">
            <span className="text-[10px] font-sans tracking-[0.3em] text-primary uppercase block font-semibold">
              VISUAL CO-CREATION
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-foreground max-w-xl leading-tight">
              Let's create something worth remembering.
            </h2>
          </div>
          <div className="flex-shrink-0">
            <Link
              href="/booking"
              className="group inline-flex items-center gap-3 bg-primary text-primary-foreground border border-primary px-8 py-3.5 text-xs font-sans tracking-[0.2em] rounded-md transition-all duration-300 hover:bg-transparent hover:text-primary hover:border-primary"
            >
              BOOK SESSION
              <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* ── Navigation Columns ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 mb-20">
          {/* Column 1: Studio */}
          <nav aria-label="Footer studio links" className="space-y-5">
            <h3 className="text-xs font-sans tracking-[0.25em] text-foreground uppercase font-bold">
              Studio
            </h3>
            <ul className="space-y-3 text-xs">
              {STUDIO_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="hover:text-primary transition-transform hover:translate-x-1 inline-block duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 2: Explore */}
          <nav aria-label="Footer explore links" className="space-y-5">
            <h3 className="text-xs font-sans tracking-[0.25em] text-foreground uppercase font-bold">
              Explore
            </h3>
            <ul className="space-y-3 text-xs">
              {EXPLORE_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="hover:text-primary transition-transform hover:translate-x-1 inline-block duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3: Connect / Contact */}
          <div className="space-y-5">
            <h3 className="text-xs font-sans tracking-[0.25em] text-foreground uppercase font-bold">
              Connect
            </h3>
            <address className="not-italic space-y-3 text-xs">
              <p>
                <a
                  href="mailto:hello@auraphotostudio.com"
                  className="hover:text-primary transition-transform hover:translate-x-1 inline-block duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                >
                  hello@auraphotostudio.com
                </a>
              </p>
              <p>
                <a
                  href="tel:+919876543210"
                  className="hover:text-primary transition-transform hover:translate-x-1 inline-block duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                >
                  +91 98765 43210
                </a>
              </p>
              <p className="text-muted-foreground/70">Studio Location, India</p>
            </address>
          </div>

          {/* Column 4: Socials */}
          <nav aria-label="Social media links" className="space-y-5">
            <h3 className="text-xs font-sans tracking-[0.25em] text-foreground uppercase font-bold">
              Socials
            </h3>
            <ul className="space-y-3 text-xs">
              {SOCIAL_LINKS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-transform hover:translate-x-1 inline-block duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    aria-label={`${s.label} — opens in new tab`}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* ── Signature Wordmark Logo ── */}
        <div className="text-center py-10 border-t border-border/30 select-none">
          <span className="text-[12vw] sm:text-[8vw] font-serif tracking-[0.40em] text-foreground/5 leading-none uppercase font-extralight block pointer-events-none">
            AURA
          </span>
        </div>

        {/* ── Copyright Bar ── */}
        <div className="pt-8 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] tracking-[0.15em] text-muted-foreground/30 uppercase">
          <p>© {new Date().getFullYear()} AURA Studio. All rights reserved.</p>
          <p>Fine Art & Editorial Photography</p>
        </div>

      </div>
    </footer>
  );
}
