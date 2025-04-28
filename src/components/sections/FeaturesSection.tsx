
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

  // Ensure features is always an array
  const features = Array.isArray(t("features.items")) ? t("features.items") : [];

  return (
    <section id="features" className="py-20 md:py-28 bg-gradient-to-b from-neutral-softGray to-white relative" ref={sectionRef}>
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent"></div>
      
      <div className="container-custom relative z-10">
        <h2 className="animate-stagger section-title text-center">
          {t("features.title") || "Key Features"}
        </h2>
        <p className="animate-stagger section-subtitle text-center">
          {t("features.subtitle") || "Powerful tools designed for Uzbekistan's legal landscape"}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {features.map((feature: any, index: number) => {
            const IconConfig = featureIcons[index % featureIcons.length];
            const Icon = IconConfig.icon;
            
            return (
              <div
                key={index}
                className="animate-stagger feature-card group hover:shadow-xl transform transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`rounded-lg p-4 inline-block mb-5 ${IconConfig.bg} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 ${IconConfig.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title || `Feature ${index + 1}`}</h3>
                <p className="text-neutral-gray">{feature.description || ""}</p>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};
