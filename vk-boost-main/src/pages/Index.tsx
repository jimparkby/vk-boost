import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import PricingSection from "@/components/PricingSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <div id="features"><FeaturesSection /></div>
      <div id="pricing"><PricingSection /></div>
      <div id="faq"><CtaSection /></div>
      <Footer />
    </div>
  );
};

export default Index;
