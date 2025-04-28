
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const trackCTAClick = (ctaName: string) => {
    window.dispatchEvent(new CustomEvent("cta_click", { detail: { cta: ctaName } }));
  };

  // Handlers for CTA buttons
  const handleTryFreeClick = () => {
    trackCTAClick("hero_try_free");
    navigate("/auth", { state: { activeTab: "signup" } });
  };

  const handleRequestDemoClick = () => {
    trackCTAClick("hero_request_demo");
    navigate("/auth", { state: { activeTab: "signup", isDemoRequest: true } });
  };

  // Safely extract the text from translation objects
  const heroTitle = t("title") || "AI-Powered Legal Assistant for Uzbekistan";
  const heroSubtitle = t("subtitle") || "Streamline your legal work with the first AI assistant fully adapted to Uzbekistan's legislation";
  const ctaPrimary = t("cta.primary") || "Try for Free";
  const ctaSecondary = t("cta.secondary") || "Request Demo";

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-neutral-50 pt-32 pb-16 md:pt-40 md:pb-24">
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {heroTitle}
            </h1>
            <p className="text-xl text-neutral-gray mb-8 max-w-xl mx-auto lg:mx-0">
              {heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" 
                onClick={handleTryFreeClick}
              >
                {ctaPrimary}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-primary text-primary hover:bg-primary/5 text-lg px-8 py-6 rounded-xl transition-colors"
                onClick={handleRequestDemoClick}
              >
                {ctaSecondary}
              </Button>
            </div>
          </div>
          <div className="relative mx-auto lg:mx-0 max-w-md">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
              <img 
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80" 
                alt="Legal AI Interface" 
                className="w-full h-auto object-cover hover:opacity-90 transition-opacity"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent mix-blend-overlay"></div>
            </div>
            <div className="absolute -z-10 inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl transform translate-x-1/4 translate-y-1/4 opacity-50"></div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,85,255,0.05),transparent)] pointer-events-none"></div>
    </section>
  );
};
