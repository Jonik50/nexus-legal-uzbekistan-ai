
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
  
  // Get security features and ensure it's an array
  const securityFeatures = Array.isArray(t("security.features")) 
    ? t("security.features") 
    : [];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white to-neutral-50 relative" ref={sectionRef}>
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,197,122,0.05),transparent_70%)] pointer-events-none"></div>
      
      <div className="container-custom relative z-10">
        <h2 className="animate-stagger section-title text-center">
          {t("security.title") || "Secure and Reliable Protection"}
        </h2>
        <p className="animate-stagger section-subtitle text-center">
          {t("security.description") || "Your data and documents are protected with state-of-the-art security measures"}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {securityFeatures.map((feature: any, index: number) => {
            const Icon = securityIcons[index % securityIcons.length];
            return (
              <div
                key={index}
                className="animate-stagger feature-card flex flex-col md:flex-row items-start gap-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="bg-primary/10 p-4 rounded-lg">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">{feature.title || ""}</h3>
                  <p className="text-neutral-gray">{feature.description || ""}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="animate-stagger mt-16 flex justify-center">
          <div className="bg-gradient-to-br from-neutral-softGray to-white rounded-xl p-8 max-w-2xl text-center shadow-lg border border-neutral-100">
            <div className="inline-block bg-primary/10 rounded-full p-3 mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <p className="text-xl font-medium mb-3">
              GDPR & O'zbekiston Data Protection
            </p>
            <p className="text-neutral-gray">
              Legal Nexus AI is fully compliant with both EU GDPR and Uzbekistan's data protection laws, ensuring your legal data is secure and protected according to international standards.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
