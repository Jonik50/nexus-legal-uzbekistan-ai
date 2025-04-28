
import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Star, Quote } from "lucide-react";

export const TestimonialsSection = () => {
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

  // Ensure testimonials and clients are always arrays with safe access
  const testimonialsTitle = t("testimonials.title") || "What Our Clients Say";
  const testimonialItems = Array.isArray(t("testimonials.items")) ? t("testimonials.items") : [];
  const clientItems = Array.isArray(t("testimonials.clients")) ? t("testimonials.clients") : [];

  useEffect(() => {
    if (testimonialItems.length === 0) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonialItems.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonialItems.length]);

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white to-neutral-softGray relative overflow-hidden" ref={sectionRef}>
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-accent/5 blur-3xl"></div>

      <div className="container-custom relative z-10">
        <h2 className="animate-stagger section-title text-center">
          {testimonialsTitle}
        </h2>

        <div className="animate-stagger mt-16">
          {/* Testimonial slider */}
          <div className="relative h-[300px] md:h-[240px]">
            {testimonialItems.map((testimonial: any, index: number) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  activeIndex === index ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl mx-auto border border-neutral-200">
                  <div className="absolute -left-2 -top-2 text-primary/10">
                    <Quote size={48} />
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-lg italic mb-6 relative z-10">"{testimonial?.quote || `Testimonial ${index + 1}`}"</p>
                  <div className="flex items-center">
                    <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center text-primary font-bold">
                      {testimonial?.author ? testimonial.author.charAt(0) : "U"}
                    </div>
                    <div className="ml-4">
                      <p className="font-bold">{testimonial?.author || "Unknown Author"}</p>
                      <p className="text-neutral-gray text-sm">{testimonial?.position || "Position"}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial navigation dots */}
          <div className="flex justify-center mt-8">
            {testimonialItems.map((_, index) => (
              <button
                key={index}
                className={`mx-1 rounded-full transition-all ${
                  activeIndex === index
                    ? "w-8 h-2 bg-primary"
                    : "w-2 h-2 bg-neutral-gray hover:bg-primary/50"
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Client logos */}
        <div className="animate-stagger mt-20">
          <p className="text-center text-neutral-gray mb-8 text-sm uppercase tracking-wider font-medium">
            Trusted by leading organizations
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {clientItems.map((client: string, index: number) => (
              <div
                key={index}
                className="bg-white px-6 py-4 rounded-lg shadow-md border border-neutral-100 hover:shadow-lg transition-shadow duration-300"
              >
                <p className="text-neutral-darkPurple font-bold">{client}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
