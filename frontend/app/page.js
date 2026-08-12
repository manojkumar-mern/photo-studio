import Header from "@/components/layout/Header";
import HeroSection from "@/components/hero/HeroSection";
import SelectedWork from "@/components/portfolio/SelectedWork";
import StudioStatement from "@/components/about/StudioStatement";
import AboutStudio from "@/components/about/AboutStudio";
import Testimonials from "@/components/testimonials/Testimonials";
import BookingWizard from "@/components/booking/BookingWizard";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full overflow-x-hidden relative">
        <HeroSection />
        <StudioStatement />
        <SelectedWork />
        <AboutStudio />
        <Testimonials />
        <BookingWizard />
      </main>
      <Footer />
    </>
  );
}
