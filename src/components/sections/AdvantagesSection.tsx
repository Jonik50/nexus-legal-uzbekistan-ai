
import React, { useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

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

  // Get the title and subtitle safely
  const advantagesTitle = t("advantages.title") || "Compare Legal Nexus AI with Traditional Solutions";
  const advantagesSubtitle = t("advantages.subtitle") || "See how our AI-powered solution compares to traditional legal research and document analysis methods";
  const ctaText = t("advantages.cta") || "Download Full Comparison Report";
  
  // Ensure the headers and rows are arrays
  const headers = Array.isArray(t("advantages.table.headers")) ? t("advantages.table.headers") : [];
  const rows = Array.isArray(t("advantages.table.rows")) ? t("advantages.table.rows") : [];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-neutral-50 to-white relative" ref={sectionRef}>
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,85,255,0.05),transparent_70%)] pointer-events-none"></div>
      
      <div className="container-custom relative z-10">
        <h2 className="animate-stagger section-title text-center">
          {advantagesTitle}
        </h2>
        <p className="animate-stagger section-subtitle text-center">
          {advantagesSubtitle}
        </p>

        <div className="animate-stagger mt-16 overflow-x-auto">
          <div className="bg-white rounded-xl shadow-lg border border-neutral-100 p-1">
            <Table className="w-full min-w-[600px]">
              <TableHeader>
                <TableRow className="bg-neutral-softGray">
                  {headers.map((header: string, index: number) => (
                    <TableHead
                      key={index}
                      className={`py-4 px-6 text-left font-bold ${
                        index === 1 ? "text-primary" : ""
                      }`}
                    >
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row: string[], index: number) => (
                  <TableRow
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-neutral-softGray/30"}
                  >
                    {Array.isArray(row) ? row.map((cell, cellIndex) => (
                      <TableCell
                        key={cellIndex}
                        className={`py-4 px-6 ${
                          cellIndex === 1 ? "text-primary font-bold" : ""
                        }`}
                      >
                        {cell}
                      </TableCell>
                    )) : null}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="animate-stagger mt-10 text-center">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 shadow-sm hover:shadow transition-all duration-200"
            onClick={trackDownloadClick}
          >
            <Download className="w-4 h-4" />
            {ctaText}
          </Button>
        </div>
      </div>
    </section>
  );
};
