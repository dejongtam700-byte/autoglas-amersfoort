import { GlassSelectionProvider } from "@/components/GlassSelection";
import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import TrustBar from "@/components/sections/TrustBar";
import Services from "@/components/sections/Services";
import HowItWorks from "@/components/sections/HowItWorks";
import FormSection from "@/components/sections/FormSection";
import About from "@/components/sections/About";
import Reviews from "@/components/sections/Reviews";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import MobileActions from "@/components/sections/MobileActions";

/** Volledige one-page opbouw. Wordt gebruikt door app/page.tsx. */
export default function SitePage() {
  return (
    <GlassSelectionProvider>
      <Header />
      <main id="main">
        <Hero />
        <TrustBar />
        <Services />
        <HowItWorks />
        <FormSection />
        <About />
        <Reviews />
        <Contact />
      </main>
      <Footer />
      <MobileActions />
    </GlassSelectionProvider>
  );
}
