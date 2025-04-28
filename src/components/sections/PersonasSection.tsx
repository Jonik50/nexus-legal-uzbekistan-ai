
import React, { useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Building, Users, GraduationCap, Briefcase } from "lucide-react";

export const PersonasSection = () => {
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
  
  const personaIcons = [
    Building,
    Users,
    GraduationCap,
    Briefcase
  ];

  // Ensure personas items is an array
  const personaItems = Array.isArray(t("personas.items")) ? t("personas.items") : [];
  
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white to-neutral-softGray relative" ref={sectionRef}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,197,122,0.05),transparent_70%)] pointer-events-none"></div>
      
      <div className="container-custom max-w-6xl relative z-10">
        <h2 className="animate-stagger section-title text-center">
          {t("personas.title") || "Who Benefits From Our Solution"}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {personaItems.map((persona: any, index: number) => {
            const Icon = personaIcons[index % personaIcons.length];
            
            return (
              <div 
                key={index} 
                className="animate-stagger bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group"
              >
                <div className="mb-4 bg-primary/10 p-4 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{persona.title || `Persona ${index + 1}`}</h3>
                <p className="text-neutral-gray">{persona.description || ""}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
