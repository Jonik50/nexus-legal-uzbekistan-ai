
import React, { useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { formatCurrencyRU } from "@/utils/typography";

export const PricingSection = () => {
  const { t, language, region } = useLanguage();
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

  const trackCTAClick = (planName: string) => {
    window.dispatchEvent(new CustomEvent("cta_click", { detail: { cta: `pricing_${planName.toLowerCase()}` } }));
  };

  // Calculate UZS price if needed (assuming conversion rate 1 USD = approximately 13000 UZS)
  const formatPrice = (price: string | number): React.ReactNode => {
    if (price === "Индивидуально" || price === "Individualno" || typeof price === "string" && isNaN(Number(price))) {
      return price;
    }
    
    const numericPrice = Number(price);
    
    if (region === "UZ" && language === "ru") {
      // For Uzbekistan in Russian language, show UZS with proper formatting
      const uzsPrice = numericPrice * 13000; // Example conversion
      return formatCurrencyRU(uzsPrice, "сум");
    } else if (language === "ru") {
      // For Russian language in other regions
      return `${numericPrice} $`;
    } else {
      // Default format
      return `$${numericPrice}`;
    }
  };

  return (
    <section id="pricing" className="py-20 md:py-28 bg-gradient-to-b from-neutral-softGray to-white relative" ref={sectionRef}>
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,197,122,0.05),transparent_60%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,85,255,0.05),transparent_60%)] pointer-events-none"></div>
      
      <div className="container-custom relative z-10">
        <h2 className="animate-stagger section-title text-center">{t("pricing.title")}</h2>
        <p className="animate-stagger section-subtitle text-center">{t("pricing.subtitle")}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {t("pricing.plans").map((plan: any, index: number) => (
            <div
              key={index}
              className={`animate-stagger feature-card flex flex-col relative transition-all duration-300 hover:shadow-xl ${
                index === 1
                  ? "border-2 border-primary md:scale-105 md:-translate-y-2 shadow-lg"
                  : ""
              }`}
            >
              {index === 1 && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-6 py-1 rounded-full text-sm font-semibold shadow-md">
                  {language === "ru" ? "Популярный" : (language === "uz" ? "Eng mashhur" : "Most Popular")}
                </div>
              )}

              <div className="flex-grow">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-end mb-6">
                  <span className="text-4xl font-bold">{formatPrice(plan.price)}</span>
                  {plan.period && (
                    <span className="text-neutral-gray ml-1">{plan.period}</span>
                  )}
                </div>
                <p className="text-neutral-gray mb-6">{plan.description}</p>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2 mt-0.5 text-accent bg-accent/10 rounded-full p-0.5">
                        <Check className="h-4 w-4" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto">
                <Button
                  variant={index === 1 ? "default" : "outline"}
                  className={`w-full transition-all duration-200 ${index === 1 ? 'shadow-md hover:shadow-lg' : ''}`}
                  onClick={() => trackCTAClick(plan.name)}
                >
                  {plan.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
