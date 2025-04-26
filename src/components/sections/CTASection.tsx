
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
    <section id="contact" className="py-16 md:py-24 bg-white" ref={sectionRef}>
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="animate-stagger section-title">
              {t("cta.title")}
            </h2>
            <p className="animate-stagger text-xl text-neutral-gray mb-8">
              {t("cta.description")}
            </p>
            <div className="animate-stagger flex flex-col sm:flex-row gap-4">
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
            <LeadForm />
          </div>
        </div>
      </div>
    </section>
  );
};
