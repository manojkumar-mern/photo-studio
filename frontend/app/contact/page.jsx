// Metadata lives in a server component; the interactive form is a separate client component.
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact | Pixel Bees Photos",
  description:
    "Get in touch with Pixel Bees Photos. Reach out for collaborations, bookings, or general enquiries about our photography services.",
  openGraph: {
    title: "Contact | Pixel Bees Photos",
    description:
      "Get in touch with Pixel Bees Photos. Reach out for collaborations, bookings, or general enquiries.",
  },
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-background pt-28 md:pt-32 pb-24 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto">

          {/* Page heading */}
          <div className="mb-12 md:mb-16">
            <span className="text-[10px] font-sans tracking-[0.3em] text-primary uppercase block mb-3">
              Get in Touch
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif text-foreground mb-4">
              Contact Us
            </h1>
            <p className="text-sm font-sans text-muted-foreground max-w-xl leading-relaxed">
              Have questions or want to collaborate? Write us a message below or reach out through our direct channels.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">

            {/* Contact info */}
            <aside className="lg:col-span-5 space-y-8 text-sm font-sans text-muted-foreground" aria-label="Contact information">
              <div className="space-y-1.5">
                <h2 className="text-[10px] tracking-[0.2em] text-foreground uppercase font-bold">Email Direct</h2>
                <a
                  href="mailto:hello@pixelbeesphotos.com"
                  className="block hover:text-primary transition-colors focus:outline-none focus-visible:underline"
                >
                  hello@pixelbeesphotos.com
                </a>
              </div>
              <div className="space-y-1.5">
                <h2 className="text-[10px] tracking-[0.2em] text-foreground uppercase font-bold">Telephone</h2>
                <a
                  href="tel:+919876543210"
                  className="block hover:text-primary transition-colors focus:outline-none focus-visible:underline"
                >
                  +91 98765 43210
                </a>
              </div>
              <div className="space-y-1.5">
                <h2 className="text-[10px] tracking-[0.2em] text-foreground uppercase font-bold">Studio Location</h2>
                <address className="not-italic text-muted-foreground/80">
                  Salem, Tamil Nadu, India
                </address>
              </div>
              <div className="space-y-1.5">
                <h2 className="text-[10px] tracking-[0.2em] text-foreground uppercase font-bold">Availability</h2>
                <p className="text-muted-foreground/80">Monday – Friday: 09:00 – 18:00</p>
                <p className="text-muted-foreground/80">Sessions by reservation only</p>
              </div>
            </aside>

            {/* Interactive form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
