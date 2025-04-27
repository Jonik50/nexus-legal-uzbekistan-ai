
import React, { useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { LeadForm } from "../LeadForm";

export const CTASection = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const animElements = sectionRef.current?.querySelectorAll(".animate-stagger");
    animElements?.forEach((el, i) => {
      const element = el as HTMLElement;
      element.style.animationDelay = `${i * 60}ms`;
      observer.observe(element);
    });

    return () => {
      animElements?.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  const trackCTAClick = (ctaName: string) => {
    window.dispatchEvent(new CustomEvent("cta_click", { detail: { cta: ctaName } }));
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-gradient-to-b from-white to-neutral-50 relative" ref={sectionRef}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,85,255,0.08),transparent_60%)] pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-neutral-softGray to-transparent"></div>
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-stagger">
            <h2 className="section-title">
              {t("cta.title")}
            </h2>
            <p className="text-xl text-neutral-gray mb-8">
              {t("cta.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="btn-primary"
                onClick={() => trackCTAClick("final_cta_try_free")}
              >
                {t("cta.primary")}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="btn-secondary"
                onClick={() => trackCTAClick("final_cta_request_demo")}
              >
                {t("cta.secondary")}
              </Button>
            </div>
          </div>
          
          <div className="animate-stagger">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-neutral-100">
              <LeadForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
