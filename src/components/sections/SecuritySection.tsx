
import React, { useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Shield, Database, Code, FileText } from "lucide-react";

export const SecuritySection = () => {
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

  const securityIcons = [Shield, Database, Code, FileText];

  return (
    <section className="py-16 md:py-24 bg-white" ref={sectionRef}>
      <div className="container-custom">
        <h2 className="animate-stagger section-title text-center">
          {t("security.title")}
        </h2>
        <p className="animate-stagger section-subtitle text-center">
          {t("security.description")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {t("security.features").map((feature: any, index: number) => {
            const Icon = securityIcons[index];
            return (
              <div
                key={index}
                className="animate-stagger feature-card flex flex-col md:flex-row items-start gap-4"
              >
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-neutral-gray">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="animate-stagger mt-12 flex justify-center">
          <div className="bg-neutral-softGray rounded-xl p-6 max-w-2xl text-center">
            <div className="inline-block bg-white rounded-full p-3 mb-4">
              <Shield className="h-8 w-8 text-accent" />
            </div>
            <p className="text-lg font-medium mb-2">
              GDPR & O'zbekiston Data Protection
            </p>
            <p className="text-neutral-gray">
              Legal Nexus AI is fully compliant with both EU GDPR and Uzbekistan's data protection laws.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
