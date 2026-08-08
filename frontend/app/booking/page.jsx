import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BookingWizard from "@/components/booking/BookingWizard";

export const metadata = {
  title: "Book a Session | AURA Studio",
  description: "Begin your creative story by filling out our custom 5-step photography enquiry wizard.",
};

export default function BookingPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-background pt-32 pb-16 px-6 md:px-12 flex flex-col justify-center">
        <div className="max-w-7xl mx-auto w-full">
          {/* Page Heading */}
          <div className="mb-8 text-center max-w-2xl mx-auto">
            <span className="text-[10px] font-sans tracking-[0.3em] text-primary uppercase block mb-3">
              RESERVATIONS
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-4 leading-tight">
              Let's create something memorable.
            </h1>
            <p className="text-sm font-sans text-muted-foreground leading-relaxed">
              Complete the consultation wizard below. We will coordinate details matching your creative direction.
            </p>
          </div>

          {/* Render centralized booking wizard */}
          <BookingWizard />
        </div>
      </main>
      <Footer />
    </>
  );
}
