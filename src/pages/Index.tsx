
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
import { formatRussianText } from "@/utils/typography";

const Index = () => {
  const { t, language } = useLanguage();

  // Enhanced metadata setup with proper typography
  useEffect(() => {
    let pageTitle = t("meta.title");
    let pageDescription = t("meta.description");
    
    // Apply advanced typography formatting for Russian language
    if (language === "ru") {
      pageTitle = formatRussianText(pageTitle);
      pageDescription = formatRussianText(pageDescription);
    }
    
    document.title = pageTitle;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", pageDescription);
    }

    // Setup analytics with enhanced language tracking
    const setupAnalytics = () => {
      // Enhanced analytics to track language and region
      window.addEventListener("cta_click", (event) => {
        const data = (event as CustomEvent).detail;
        console.log("Analytics: CTA clicked", {
          ...data,
          language,
        });
      });
      
      window.addEventListener("form_submit", (event) => {
        const data = (event as CustomEvent).detail;
        console.log("Analytics: Form submitted", {
          ...data,
          language,
        });
      });
      
      window.addEventListener("lang_toggle", (event) => {
        console.log("Analytics: Language changed", (event as CustomEvent).detail);
      });
      
      window.addEventListener("download_pdf", (event) => {
        const data = (event as CustomEvent).detail;
        console.log("Analytics: PDF downloaded", {
          ...data,
          language,
        });
      });
    };

    setupAnalytics();
  }, [t, language]);

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
