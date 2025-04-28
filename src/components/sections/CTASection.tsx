
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";

export const CTASection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleTryFreeClick = () => {
    window.dispatchEvent(new CustomEvent("cta_click", { detail: { cta: "cta_try_free" } }));
    navigate("/auth", { state: { activeTab: "signup" } });
  };

  const handleRequestDemoClick = () => {
    window.dispatchEvent(new CustomEvent("cta_click", { detail: { cta: "cta_request_demo" } }));
    navigate("/auth", { state: { activeTab: "signup", isDemoRequest: true } });
  };

  // Safely extract text from translation objects
  const ctaTitle = t("cta.title") || "Ready to optimize your legal work?";
  const ctaDescription = t("cta.description") || "Join leading legal firms in Uzbekistan using Legal Nexus AI";
  const ctaPrimary = t("cta.primary") || "Try for free";
  const ctaSecondary = t("cta.secondary") || "Request demo";

  return (
    <section className="py-20 md:py-28 bg-primary relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none"></div>
      <div className="absolute right-0 bottom-0 w-1/2 h-1/2 bg-[radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.1),transparent_70%)] pointer-events-none"></div>
      
      <div className="container-custom relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
          {ctaTitle}
        </h2>
        <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
          {ctaDescription}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            variant="default" 
            className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={handleTryFreeClick}
          >
            {ctaPrimary}
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 rounded-xl transition-colors"
            onClick={handleRequestDemoClick}
          >
            {ctaSecondary}
          </Button>
        </div>
      </div>
    </section>
  );
};
