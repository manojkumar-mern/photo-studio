"use client";

import Link from "next/link";
import Image from "next/image";

const STUDIO_LINKS = [
  { label: "Our Story",     href: "/about"    },
  { label: "Selected Work", href: "/work"     },
  { label: "Experiences",   href: "/services" },
];

const EXPLORE_LINKS = [
  { label: "Portfolio Selection", href: "/#work"    },
  { label: "Project Archives",   href: "/work"     },
  { label: "Enquiry Portal",     href: "/booking"  },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/pixelbeesphotos/" },
  { label: "Pinterest", href: "https://pinterest.com" },
  { label: "Vimeo",     href: "https://vimeo.com"    },
];

/* Reusable column link with gold slide-underline hover */
function FooterLink({ href, children, external = false }) {
  const cls = `
    relative group/link inline-flex items-center gap-2
    text-[13px] font-sans tracking-[0.06em] text-muted-foreground/80
    hover:text-primary transition-colors duration-300
    after:absolute after:bottom-[-2px] after:left-0 after:h-[1px]
    after:bg-primary after:transition-all after:duration-300
    after:w-0 hover:after:w-full
    focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm
  `;
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
        <span className="text-[9px] text-primary/50 group-hover/link:text-primary/80 transition-colors duration-300">↗</span>
      </a>
    );
  }
  return <Link href={href} className={cls}>{children}</Link>;
}

export default function Footer() {
  return (
    <footer
      className="relative bg-card border-t border-border/60 text-muted-foreground"
      role="contentinfo"
    >
      {/* ── Top gold accent line ── */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* ── Hero CTA Statement ── */}
        <div className="py-20 border-b border-border/30 flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <div className="space-y-4 max-w-xl">
            <span className="text-[10px] font-sans tracking-[0.35em] text-primary uppercase font-semibold">
              Visual Co-Creation
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground leading-[1.05] tracking-tight">
              Let&apos;s create something
              <br />
              <span className="italic font-light text-primary/90">worth remembering.</span>
            </h2>
          </div>
          <div className="flex-shrink-0 flex flex-col items-start md:items-end gap-4">
            <Link
              href="/booking"
              className="group inline-flex items-center gap-3 bg-primary text-primary-foreground border border-primary px-9 py-4 text-[13px] font-sans tracking-[0.18em] rounded-md transition-all duration-300 hover:bg-transparent hover:text-primary"
            >
              BOOK SESSION
              <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
            <p className="text-[11px] font-sans tracking-[0.1em] text-muted-foreground/50">
              Salem, Tamil Nadu · India
            </p>
          </div>
        </div>

        {/* ── Navigation Columns ── */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 border-b border-border/20">

          {/* Studio */}
          <nav aria-label="Footer studio links" className="space-y-6">
            <h3 className="text-[10px] font-sans tracking-[0.35em] text-foreground/60 uppercase">
              Studio
            </h3>
            <ul className="space-y-4">
              {STUDIO_LINKS.map((l) => (
                <li key={l.label}>
                  <FooterLink href={l.href}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Explore */}
          <nav aria-label="Footer explore links" className="space-y-6">
            <h3 className="text-[10px] font-sans tracking-[0.35em] text-foreground/60 uppercase">
              Explore
            </h3>
            <ul className="space-y-4">
              {EXPLORE_LINKS.map((l) => (
                <li key={l.label}>
                  <FooterLink href={l.href}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-sans tracking-[0.35em] text-foreground/60 uppercase">
              Connect
            </h3>
            <address className="not-italic space-y-4">
              <p>
                <FooterLink href="mailto:hello@pixelbeesphotos.com">
                  hello@pixelbeesphotos.com
                </FooterLink>
              </p>
              <p>
                <FooterLink href="tel:+919876543210">
                  +91 98765 43210
                </FooterLink>
              </p>
              <p className="text-[12px] font-sans tracking-[0.04em] text-muted-foreground/50 leading-relaxed">
                Salem, Tamil Nadu<br />India
              </p>
            </address>
          </div>

          {/* Socials */}
          <nav aria-label="Social media links" className="space-y-6">
            <h3 className="text-[10px] font-sans tracking-[0.35em] text-foreground/60 uppercase">
              Socials
            </h3>
            <ul className="space-y-4">
              {SOCIAL_LINKS.map((s) => (
                <li key={s.label}>
                  <FooterLink href={s.href} external>
                    {s.label}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </nav>

        </div>

        {/* ── Signature Wordmark ── */}
        <div className="py-12 flex justify-center">
          <Link
            href="/"
            className="group flex items-center gap-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          >
            <Image
              src="/client_logo.svg"
              alt="Pixel Bees Photography logo"
              width={80}
              height={64}
              className="h-16 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300"
            />
            <div className="flex flex-col text-left">
              <span className="text-2xl font-serif font-medium tracking-[0.05em] text-[#F5EFE6] group-hover:text-primary transition-colors duration-300 leading-none">
                Pixelbees Photography
              </span>
              <span className="text-[12px] font-serif italic font-light tracking-[0.12em] text-primary/60 group-hover:text-primary/90 transition-colors duration-300 mt-1.5 leading-none">
                Emotion through Photos
              </span>
            </div>
          </Link>
        </div>

        {/* ── Copyright Bar ── */}
        <div className="py-6 border-t border-border/15 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] font-sans tracking-[0.12em] text-muted-foreground/40">
            © {new Date().getFullYear()} Pixel Bees Photos. All rights reserved.
          </p>
          <p className="text-[11px] font-sans tracking-[0.12em] text-muted-foreground/35 italic">
            Fine Art &amp; Editorial Photography · Salem, India
          </p>
        </div>

      </div>

      {/* ── Bottom accent line ── */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </footer>
  );
}
