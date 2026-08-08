import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "About Our Studio | AURA Studio",
  description: "Learn about the storytelling philosophy, team, and professional shooting workflow behind AURA Studio.",
};

export default function AboutPage() {
  const steps = [
    { num: "01", name: "Discover", desc: "[Explore project direction, mood boards, and aesthetic preferences through a brief design call.]" },
    { num: "02", name: "Plan", desc: "[Coordinate locations, wardrobe styling directives, session timelines, and props details.]" },
    { num: "03", name: "Shoot", desc: "[Conduct the photography session using specialized ambient light and cinematic framing angles.]" },
    { num: "04", name: "Create", desc: "[Color-grade proof files, apply fine grain styles, and adjust contrast values in post-production.]" },
    { num: "05", name: "Deliver", desc: "[Provide high-resolution digital links and coordinate handcrafted box print distribution.]" }
  ];

  return (
    <>
      <Header />
      <main className="flex-1 bg-background pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-24 md:space-y-36">
          
          {/* Section 1: Intro Heading & Story */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <span className="text-[10px] font-sans tracking-[0.3em] text-primary uppercase block mb-3">
                STUDIO CORE
              </span>
              <h1 className="text-4xl md:text-6xl font-serif text-foreground">
                Artistic Philosophy
              </h1>
            </div>
            
            <div className="lg:col-span-7 space-y-6 text-sm font-sans text-muted-foreground leading-relaxed">
              <p className="text-lg font-serif text-foreground italic leading-relaxed">
                "[We believe in a slow approach to imagery, designing frames that capture silent emotions, deep shadows, and editorial elegance.]"
              </p>
              <p>
                "[Studio Vision statement placeholder: In a world focused on high volume and speed, we choose a different pace. We collaborate with each client to frame visual narratives that look premium and remain classic over decades. Our team works with lighting and locations to ensure every portrait or wedding documentary is treated like fine art.]"
              </p>
            </div>
          </div>

          {/* Section 2: Team Members Block */}
          <div className="space-y-12">
            <div>
              <span className="text-[10px] font-sans tracking-[0.25em] text-primary uppercase block mb-3">
                THE ARTISTS
              </span>
              <h2 className="text-3xl md:text-5xl font-serif text-foreground">
                Behind the lens
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Member A */}
              <div className="space-y-6">
                <div className="relative h-[50vh] bg-card border border-border overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop"
                    alt="Lead Photographer Portrait"
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-sans tracking-[0.2em] text-foreground uppercase font-bold">[Artist Name A]</h4>
                  <p className="text-[10px] font-sans tracking-[0.1em] text-primary uppercase">[CO-FOUNDER & LEAD PHOTOGRAPHER]</p>
                  <p className="text-xs font-sans text-muted-foreground mt-3 max-w-sm leading-relaxed">
                    "[Brief designer details placeholder. Describing primary style focus and artistic photography interests.]"
                  </p>
                </div>
              </div>

              {/* Member B */}
              <div className="space-y-6">
                <div className="relative h-[50vh] bg-card border border-border overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop"
                    alt="Lead Stylist Portrait"
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-sans tracking-[0.2em] text-foreground uppercase font-bold">[Artist Name B]</h4>
                  <p className="text-[10px] font-sans tracking-[0.1em] text-primary uppercase">[CO-FOUNDER & ART DIRECTOR]</p>
                  <p className="text-xs font-sans text-muted-foreground mt-3 max-w-sm leading-relaxed">
                    "[Brief designer details placeholder. Describing focus on brand styling, wardrobe coordination, and concept setups.]"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Workflow / Approach */}
          <div className="space-y-12">
            <div>
              <span className="text-[10px] font-sans tracking-[0.25em] text-primary uppercase block mb-3">
                METHODOLOGY
              </span>
              <h2 className="text-3xl md:text-5xl font-serif text-foreground">
                Our workflow
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 border-t border-border pt-12">
              {steps.map((step) => (
                <div key={step.num} className="space-y-4">
                  <span className="text-2xl font-serif text-primary block">{step.num}</span>
                  <h4 className="text-xs font-sans tracking-[0.15em] text-foreground uppercase font-bold">{step.name}</h4>
                  <p className="text-xs font-sans text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Final Call to Action */}
          <div className="border-t border-border pt-24 text-center space-y-8">
            <h3 className="text-2xl md:text-4xl font-serif text-foreground leading-tight">
              Begin your visual journey
            </h3>
            <p className="text-sm font-sans text-muted-foreground max-w-md mx-auto leading-relaxed">
              We collaborate to shape timeless campaign outputs and candid records.
            </p>
            <Link
              href="/booking"
              className="inline-block text-xs font-sans tracking-[0.25em] border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 transition-all duration-300"
            >
              BOOK A SESSION
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
