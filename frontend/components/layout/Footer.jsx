"use client";

import Link from "next/link";

const STUDIO_LINKS = [
  { label: "Selected Work",  href: "/work"     },
  { label: "Experiences",    href: "/services" },
  { label: "Our Story",      href: "/about"    },
  { label: "Book a Session", href: "/booking"  },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
  { label: "Vimeo",     href: "https://vimeo.com"     },
];

export default function Footer() {
  return (
    <footer
      className="bg-card border-t border-border py-16 px-6 md:px-12 text-muted-foreground"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">

        {/* ── Brand ──────────────────────────────── */}
        <div className="space-y-4 sm:col-span-2 md:col-span-1">
          <Link
            href="/"
            className="text-xl font-serif tracking-[0.25em] text-foreground hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="AURA Studio — home"
          >
            A U R A
          </Link>
          <p className="text-xs leading-relaxed max-w-[240px]">
            Fine art and editorial photography studio. Capturing raw elegance and timeless visual stories.
          </p>
        </div>

        {/* ── Studio links ───────────────────────── */}
        <nav aria-label="Footer studio links">
          <h2 className="text-xs font-sans tracking-[0.2em] text-foreground uppercase mb-4">
            Studio
          </h2>
          <ul className="space-y-2 text-xs">
            {STUDIO_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="hover:text-foreground transition-colors focus:outline-none focus-visible:underline"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Contact info ───────────────────────── */}
        <div className="space-y-4">
          <h2 className="text-xs font-sans tracking-[0.2em] text-foreground uppercase">
            Connect
          </h2>
          <address className="not-italic space-y-2 text-xs">
            <p>
              <a
                href="mailto:hello@auraphotostudio.com"
                className="hover:text-foreground transition-colors focus:outline-none focus-visible:underline"
              >
                hello@auraphotostudio.com
              </a>
            </p>
            <p>
              <a
                href="tel:+919876543210"
                className="hover:text-foreground transition-colors focus:outline-none focus-visible:underline"
              >
                +91 98765 43210
              </a>
            </p>
            <p className="text-muted-foreground/70">Studio Location, India</p>
          </address>
        </div>

        {/* ── Social links ───────────────────────── */}
        <nav aria-label="Social media links">
          <h2 className="text-xs font-sans tracking-[0.2em] text-foreground uppercase mb-4">
            Socials
          </h2>
          <ul className="space-y-2 text-xs">
            {SOCIAL_LINKS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors focus:outline-none focus-visible:underline"
                  aria-label={`${s.label} — opens in new tab`}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* ── Bottom bar ─────────────────────────────── */}
      <div className="max-w-7xl mx-auto border-t border-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] tracking-[0.15em] uppercase">
        <p>© {new Date().getFullYear()} AURA Studio. All rights reserved.</p>
        <p className="text-muted-foreground/50">Designed for elegance</p>
      </div>
    </footer>
  );
}
