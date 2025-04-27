
import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Users } from "lucide-react";

export const PersonasSection = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

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

  const personas = t("personas.items");

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % personas.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [personas.length]);

  return (
    <section id="personas" className="py-20 md:py-28 bg-gradient-to-b from-neutral-softGray to-white relative overflow-hidden" ref={sectionRef}>
      {/* Background decorative elements */}
      <div className="absolute top-40 left-10 w-64 h-64 rounded-full bg-accent/5 blur-3xl"></div>
      <div className="absolute bottom-40 right-10 w-80 h-80 rounded-full bg-primary/5 blur-3xl"></div>
      
      <div className="container-custom relative z-10">
        <h2 className="animate-stagger section-title text-center">
          {t("personas.title")}
        </h2>

        <div className="animate-stagger mt-16">
          {/* Personas cards */}
          <div className="flex flex-wrap justify-center gap-6">
            {personas.map((persona: any, index: number) => (
              <div
                key={index}
                className={`feature-card w-full md:w-[calc(50%-1rem)] lg:w-[calc(25%-1rem)] cursor-pointer transition-all duration-300 ${
                  activeIndex === index
                    ? "border-2 border-primary scale-105 shadow-lg"
                    : "border border-neutral-100 opacity-80 hover:opacity-100 hover:shadow-md"
                }`}
                onClick={() => setActiveIndex(index)}
              >
                <div className="flex flex-col items-center text-center h-full">
                  <div className={`p-4 rounded-full mb-6 ${
                    activeIndex === index ? 'bg-primary/20' : 'bg-primary/10'
                  }`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-6 w-6 ${
                        activeIndex === index ? 'text-primary' : 'text-primary/80'
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-4">{persona.title}</h3>
                  <p className="text-neutral-gray">{persona.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center mt-10">
            {personas.map((_, index) => (
              <button
                key={index}
                className={`mx-1 rounded-full transition-all ${
                  activeIndex === index
                    ? "w-8 h-2 bg-primary"
                    : "w-2 h-2 bg-neutral-gray hover:bg-primary/50"
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`View persona ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
