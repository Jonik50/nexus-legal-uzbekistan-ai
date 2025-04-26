
import React, { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProblemSolutionSection } from "@/components/sections/ProblemSolutionSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { AdvantagesSection } from "@/components/sections/AdvantagesSection";
import { PersonasSection } from "@/components/sections/PersonasSection";
import { SecuritySection } from "@/components/sections/SecuritySection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { CTASection } from "@/components/sections/CTASection";

const Index = () => {
  const { t } = useLanguage();

  // Set metadata
  useEffect(() => {
    document.title = t("meta.title");
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", t("meta.description"));
    }

    // Initialize self-hosted analytics tracker
    const setupAnalytics = () => {
      // This would typically use a self-hosted Plausible.io instance
      // We're mocking the tracking functionality for demo purposes
      window.addEventListener("cta_click", (event) => {
        console.log("Analytics: CTA clicked", (event as CustomEvent).detail);
      });
      
      window.addEventListener("form_submit", (event) => {
        console.log("Analytics: Form submitted", (event as CustomEvent).detail);
      });
      
      window.addEventListener("lang_toggle", (event) => {
        console.log("Analytics: Language changed", (event as CustomEvent).detail);
      });
      
      window.addEventListener("download_pdf", (event) => {
        console.log("Analytics: PDF downloaded", (event as CustomEvent).detail);
      });
    };

    setupAnalytics();
  }, [t]);

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ProblemSolutionSection />
        <FeaturesSection />
        <AdvantagesSection />
        <PersonasSection />
        <SecuritySection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
};

export default Index;
