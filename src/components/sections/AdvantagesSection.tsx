
import React, { useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export const AdvantagesSection = () => {
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

  const trackDownloadClick = () => {
    window.dispatchEvent(new CustomEvent("download_pdf", { detail: { document: "comparison_report" } }));
  };

  return (
    <section className="py-16 md:py-24 bg-white" ref={sectionRef}>
      <div className="container-custom">
        <h2 className="animate-stagger section-title text-center">
          {t("advantages.title")}
        </h2>
        <p className="animate-stagger section-subtitle text-center">
          {t("advantages.subtitle")}
        </p>

        <div className="animate-stagger mt-12 overflow-x-auto">
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-neutral-softGray">
                {t("advantages.table.headers").map((header: string, index: number) => (
                  <th
                    key={index}
                    className={`py-4 px-6 text-left font-bold ${
                      index === 1 ? "text-primary" : ""
                    }`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t("advantages.table.rows").map((row: string[], index: number) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-neutral-softGray/30"}
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={`py-4 px-6 ${
                        cellIndex === 1 ? "text-primary font-bold" : ""
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="animate-stagger mt-8 text-center">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={trackDownloadClick}
          >
            <FileText className="w-4 h-4" />
            {t("advantages.cta")}
          </Button>
        </div>
      </div>
    </section>
  );
};
