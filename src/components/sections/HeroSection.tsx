import React, { useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);

  console.log("HeroSection rendering, translations available:", !!t);

  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 debug-outline debug-bg">
      <div className="container-custom debug-outline" ref={heroRef}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left debug-outline">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-black">
              {t("hero.title")}
            </h1>
            <p className="text-xl text-black mb-8 max-w-xl mx-auto lg:mx-0">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="btn-primary text-lg px-8 py-6" 
                onClick={() => trackCTAClick("hero_try_free")}
              >
                {t("hero.cta.primary")}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-primary text-primary text-lg px-8 py-6"
                onClick={() => trackCTAClick("hero_request_demo")}
              >
                {t("hero.cta.secondary")}
              </Button>
            </div>
          </div>
          <div className="animate-stagger mx-auto lg:mx-0 max-w-md">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80" 
                alt="Legal AI Interface" 
                className="w-full h-auto object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
