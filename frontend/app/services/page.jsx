import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { services } from "@/lib/data";

export const metadata = {
  title: "Services & Experiences | AURA Studio",
  description:
    "Explore our photography services: Fashion & Editorial, Wedding Documentary, and Fine Art Portraiture. Custom creative direction for every project.",
  openGraph: {
    title: "Services & Experiences | AURA Studio",
    description:
      "Explore our photography services: Fashion & Editorial, Wedding Documentary, and Fine Art Portraiture.",
  },
};

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-background pt-28 md:pt-32 pb-24 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto">

          {/* Page heading */}
          <div className="mb-16 md:mb-20">
            <span className="text-[10px] font-sans tracking-[0.3em] text-primary uppercase block mb-3">
              Creative Formats
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif text-foreground mb-4">
              Our Services
            </h1>
            <p className="text-sm font-sans text-muted-foreground max-w-xl leading-relaxed">
              We approach every project with custom creative direction. Explore our structured photography formats and booking details.
            </p>
          </div>

          {/* Services list */}
          <div className="space-y-20 md:space-y-32">
            {services.map((service, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <article
                  key={service.id}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-center border-t border-border pt-10 md:pt-12"
                  aria-labelledby={`service-heading-${service.id}`}
                >
                  {/* Image */}
                  <div
                    className={`lg:col-span-5 relative h-[52vw] sm:h-[50vh] md:h-[58vh] max-h-[620px] bg-card border border-border overflow-hidden ${
                      isEven ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <Image
                      src={service.image}
                      alt={`${service.name} — example photography`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 92vw, 40vw"
                    />
                  </div>

                  {/* Copy */}
                  <div
                    className={`lg:col-span-7 space-y-6 ${
                      isEven ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-sans tracking-[0.25em] text-primary block" aria-hidden="true">
                        {String(idx + 1).padStart(2, "0")} / Format
                      </span>
                      <h2
                        id={`service-heading-${service.id}`}
                        className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground"
                      >
                        {service.name}
                      </h2>
                    </div>

                    <p className="text-sm font-sans text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>

                    <div className="space-y-2">
                      <h3 className="text-[10px] font-sans tracking-[0.2em] text-foreground uppercase">
                        What&apos;s Included
                      </h3>
                      <ul className="text-xs font-sans text-muted-foreground space-y-1.5 list-disc pl-4">
                        {service.includes.map((inc, i) => (
                          <li key={i}>{inc}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1 pt-1">
                      <h3 className="text-[10px] font-sans tracking-[0.2em] text-foreground uppercase">
                        Ideal For
                      </h3>
                      <p className="text-xs font-sans text-muted-foreground">
                        {service.useCase}
                      </p>
                    </div>

                    <div className="pt-2">
                      <Link
                        href="/booking"
                        className="inline-block text-xs font-sans tracking-[0.2em] border border-primary/40 hover:border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-2.5 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        Book this service
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* CTA */}
          <div className="border-t border-border mt-24 md:mt-32 pt-20 md:pt-24 text-center space-y-7">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground leading-tight">
              Ready to create something beautiful?
            </h2>
            <p className="text-sm font-sans text-muted-foreground max-w-md mx-auto leading-relaxed">
              Share your visual ideas with us. We will collaborate to build a bespoke campaign or session.
            </p>
            <Link
              href="/booking"
              className="inline-block text-xs font-sans tracking-[0.25em] border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Book a Session
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
