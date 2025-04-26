
import React, { useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { FileText, Search, Users } from "lucide-react";

export const ProblemSolutionSection = () => {
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

  const problemIcons = [FileText, Search, Users];

  return (
    <section className="py-16 md:py-24 bg-white" ref={sectionRef}>
      <div className="container-custom">
        {/* Problem Section */}
        <div className="mb-16 md:mb-24">
          <h2 className="animate-stagger section-title text-center">
            {t("problem.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {t("problem.points").map((point: any, index: number) => {
              const Icon = problemIcons[index];
              return (
                <div 
                  key={index} 
                  className="animate-stagger feature-card flex flex-col items-center text-center"
                >
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <Icon size={32} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{point.title}</h3>
                  <p className="text-neutral-gray">{point.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Solution Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="order-2 lg:order-1 animate-stagger">
            <img 
              src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80" 
              alt="Legal Nexus AI Solution" 
              className="rounded-xl shadow-lg w-full"
              loading="lazy" 
            />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="animate-stagger section-title">
              {t("solution.title")}
            </h2>
            <p className="animate-stagger text-lg text-neutral-gray mb-8">
              {t("solution.description")}
            </p>
            <ul className="space-y-4">
              {t("solution.features").map((feature: string, index: number) => (
                <li key={index} className="animate-stagger flex items-center">
                  <div className="rounded-full bg-accent/20 p-1 mr-3">
                    <svg
                      className="w-4 h-4 text-accent"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
