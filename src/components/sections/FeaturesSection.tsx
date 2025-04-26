
import React, { useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { FileText, Code, MessageSquare, Database, BookOpen, Shield } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const FeaturesSection = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

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
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
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

  const featureIcons = [
    { icon: FileText, color: "text-blue-500", bg: "bg-blue-100" },
    { icon: Code, color: "text-purple-500", bg: "bg-purple-100" },
    { icon: BookOpen, color: "text-orange-500", bg: "bg-orange-100" },
    { icon: MessageSquare, color: "text-green-500", bg: "bg-green-100" },
    { icon: Database, color: "text-red-500", bg: "bg-red-100" },
    { icon: Shield, color: "text-indigo-500", bg: "bg-indigo-100" },
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-neutral-softGray" ref={sectionRef}>
      <div className="container-custom">
        <h2 className="animate-stagger section-title text-center">
          {t("features.title")}
        </h2>
        <p className="animate-stagger section-subtitle text-center">
          {t("features.subtitle")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {t("features.items").map((feature: any, index: number) => {
            const IconConfig = featureIcons[index];
            const Icon = IconConfig.icon;
            
            return (
              <div
                key={index}
                className="animate-stagger feature-card hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`rounded-lg p-3 inline-block mb-4 ${IconConfig.bg}`}>
                  <Icon className={`w-6 h-6 ${IconConfig.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-neutral-gray">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
