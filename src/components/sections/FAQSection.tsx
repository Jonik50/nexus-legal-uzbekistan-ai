
import React, { useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQSection = () => {
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

  // Ensure faq data is properly structured
  const faqTitle = t("faq.title") || "Frequently Asked Questions";
  const faqItems = Array.isArray(t("faq.items")) ? t("faq.items") : [];

  return (
    <section id="faq" className="py-20 md:py-28 bg-gradient-to-b from-neutral-softGray to-white relative" ref={sectionRef}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,197,122,0.03),transparent_70%)] pointer-events-none"></div>
      
      <div className="container-custom max-w-4xl relative z-10">
        <h2 className="animate-stagger section-title text-center">
          {faqTitle}
        </h2>

        <div className="animate-stagger mt-16">
          <Accordion type="single" collapsible className="w-full bg-white rounded-xl shadow-md border border-neutral-100 overflow-hidden">
            {faqItems.map((item: any, index: number) => (
              <AccordionItem key={index} value={`item-${index}`} className={`px-4 ${index > 0 ? 'border-t border-neutral-100' : ''}`}>
                <AccordionTrigger className="text-left py-5 font-medium">
                  {item?.question || `Question ${index + 1}`}
                </AccordionTrigger>
                <AccordionContent className="text-neutral-gray pb-5">
                  {item?.answer || "No answer provided"}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-12 text-center animate-stagger">
          <p className="text-neutral-gray">
            Can't find the answer you're looking for? <a href="#contact" className="text-primary hover:underline font-medium">Contact our support team</a>
          </p>
        </div>
      </div>
    </section>
  );
};
