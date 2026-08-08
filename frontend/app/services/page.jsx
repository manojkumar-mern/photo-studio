import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { services } from "@/lib/data";

export const metadata = {
  title: "Services & Experiences | AURA Studio",
  description: "Deeper details of our photography services including Fashion & Editorial, Wedding Documentaries, and Fine Art Portraiture.",
};

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-background pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Page Heading */}
          <div className="mb-20 text-center md:text-left">
            <span className="text-[10px] font-sans tracking-[0.3em] text-primary uppercase block mb-3">
              CREATIVE FORMATS
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-4">
              Our Services
            </h1>
            <p className="text-sm font-sans text-muted-foreground max-w-xl leading-relaxed">
              We approach every project with custom creative direction. Explore our structured photography formats and booking details.
            </p>
          </div>

          {/* Detailed Services Stack */}
          <div className="space-y-24 md:space-y-36">
            {services.map((service, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={service.id}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center border-t border-border pt-12"
                >
                  {/* Photo Panel (Alternating Order) */}
                  <div
                    className={`lg:col-span-5 relative h-[50vh] md:h-[60vh] bg-card border border-border overflow-hidden ${
                      isEven ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                  </div>

                  {/* Copy Details Panel */}
                  <div
                    className={`lg:col-span-7 space-y-6 ${
                      isEven ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-sans tracking-[0.25em] text-primary block">
                        0{idx + 1} / FORMAT
                      </span>
                      <h2 className="text-3xl md:text-4xl font-serif text-foreground">
                        {service.name}
                      </h2>
                    </div>

                    <p className="text-sm font-sans text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>

                    {/* Includes deliverables list */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-sans tracking-[0.2em] text-foreground uppercase">
                        What's Included:
                      </h4>
                      <ul className="text-xs font-sans text-muted-foreground space-y-1.5 list-disc pl-4">
                        {service.includes.map((inc, i) => (
                          <li key={i}>{inc}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Use Case */}
                    <div className="space-y-1 pt-2">
                      <h4 className="text-[10px] font-sans tracking-[0.2em] text-foreground uppercase">
                        Ideal For:
                      </h4>
                      <p className="text-xs font-sans text-muted-foreground">
                        {service.useCase}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Final Call to Action Block */}
          <div className="border-t border-border mt-32 pt-24 text-center space-y-8">
            <h3 className="text-2xl md:text-4xl font-serif text-foreground leading-tight">
              Ready to create something beautiful?
            </h3>
            <p className="text-sm font-sans text-muted-foreground max-w-md mx-auto leading-relaxed">
              Share your visual ideas with us. We will collaborate to build a bespoke campaign or session.
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
