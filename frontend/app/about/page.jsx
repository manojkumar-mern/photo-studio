import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "About Our Studio | AURA Studio",
  description:
    "Learn about the storytelling philosophy, team, and professional shooting workflow behind AURA Studio.",
  openGraph: {
    title: "About Our Studio | AURA Studio",
    description:
      "Learn about the storytelling philosophy, team, and professional shooting workflow behind AURA Studio.",
  },
};

const WORKFLOW_STEPS = [
  {
    num: "01",
    name: "Discover",
    desc: "Explore project direction, mood boards, and aesthetic preferences through a brief design call.",
  },
  {
    num: "02",
    name: "Plan",
    desc: "Coordinate locations, wardrobe styling directives, session timelines, and prop details.",
  },
  {
    num: "03",
    name: "Shoot",
    desc: "Conduct the photography session using specialised ambient light and cinematic framing angles.",
  },
  {
    num: "04",
    name: "Create",
    desc: "Colour-grade proof files, apply fine-grain styles, and adjust contrast values in post-production.",
  },
  {
    num: "05",
    name: "Deliver",
    desc: "Provide high-resolution digital links and coordinate handcrafted box print distribution.",
  },
];

const TEAM = [
  {
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    alt: "Lead Photographer Portrait",
    name: "Lead Photographer",
    role: "Co-Founder & Lead Photographer",
    bio: "Specialises in high-contrast editorial work and fine-art portraiture, with a focus on structural lighting and minimalist composition.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    alt: "Art Director Portrait",
    name: "Art Director",
    role: "Co-Founder & Art Director",
    bio: "Leads brand styling, wardrobe coordination, and concept development — ensuring every frame carries a cohesive visual narrative.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-background pt-28 md:pt-32 pb-24 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-20 md:space-y-32">

          {/* ── Philosophy ─────────────────────────────────── */}
          <section aria-labelledby="philosophy-heading">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-start">
              <div className="lg:col-span-5">
                <span className="text-[10px] font-sans tracking-[0.3em] text-primary uppercase block mb-3">
                  Studio Core
                </span>
                <h1 id="philosophy-heading" className="text-3xl sm:text-5xl md:text-6xl font-serif text-foreground leading-tight">
                  Artistic Philosophy
                </h1>
              </div>
              <div className="lg:col-span-7 space-y-6 text-sm font-sans text-muted-foreground leading-relaxed">
                <p className="text-lg font-serif text-foreground italic leading-relaxed">
                  &ldquo;We believe in a slow approach to imagery — designing frames that capture silent emotions, deep shadows, and editorial elegance.&rdquo;
                </p>
                <p>
                  In a world focused on high volume and speed, we choose a different pace. We collaborate with each client to frame visual narratives that look premium and remain classic over decades. Our team works with light and location to ensure every portrait or wedding documentary is treated like fine art.
                </p>
              </div>
            </div>
          </section>

          {/* ── Team ───────────────────────────────────────── */}
          <section aria-labelledby="team-heading">
            <div className="mb-10 md:mb-14">
              <span className="text-[10px] font-sans tracking-[0.25em] text-primary uppercase block mb-3">
                The Artists
              </span>
              <h2 id="team-heading" className="text-2xl sm:text-4xl md:text-5xl font-serif text-foreground">
                Behind the lens
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-14">
              {TEAM.map((member) => (
                <article key={member.name} className="space-y-5">
                  <div className="relative h-[44vw] sm:h-[42vh] md:h-[52vh] max-h-[520px] bg-card border border-border overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.alt}
                      fill
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 35vw"
                    />
                  </div>
                  <div>
                    <h3 className="text-xs font-sans tracking-[0.2em] text-foreground uppercase font-bold">
                      {member.name}
                    </h3>
                    <p className="text-[10px] font-sans tracking-[0.1em] text-primary uppercase mt-0.5">
                      {member.role}
                    </p>
                    <p className="text-xs font-sans text-muted-foreground mt-3 leading-relaxed max-w-sm">
                      {member.bio}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* ── Workflow ────────────────────────────────────── */}
          <section aria-labelledby="workflow-heading">
            <div className="mb-10 md:mb-14">
              <span className="text-[10px] font-sans tracking-[0.25em] text-primary uppercase block mb-3">
                Methodology
              </span>
              <h2 id="workflow-heading" className="text-2xl sm:text-4xl md:text-5xl font-serif text-foreground">
                Our workflow
              </h2>
            </div>

            {/* 2-col on mobile → 3-col on sm → 5-col on lg */}
            <div className="border-t border-border pt-10">
              <ol className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
                {WORKFLOW_STEPS.map((step) => (
                  <li key={step.num} className="space-y-3">
                    <span className="text-2xl font-serif text-primary block" aria-hidden="true">
                      {step.num}
                    </span>
                    <h3 className="text-xs font-sans tracking-[0.15em] text-foreground uppercase font-bold">
                      {step.name}
                    </h3>
                    <p className="text-xs font-sans text-muted-foreground leading-relaxed">
                      {step.desc}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* ── CTA ─────────────────────────────────────────── */}
          <section className="border-t border-border pt-20 md:pt-24 text-center space-y-7">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground leading-tight">
              Begin your visual journey
            </h2>
            <p className="text-sm font-sans text-muted-foreground max-w-md mx-auto leading-relaxed">
              We collaborate to shape timeless campaign outputs and candid records.
            </p>
            <Link
              href="/booking"
              className="inline-block text-xs font-sans tracking-[0.25em] border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Book a Session
            </Link>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
