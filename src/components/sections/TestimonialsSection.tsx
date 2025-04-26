
import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Star } from "lucide-react";

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

  const testimonials = t("testimonials.items");
  const clients = t("testimonials.clients");

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="py-16 md:py-24 bg-neutral-softGray" ref={sectionRef}>
      <div className="container-custom">
        <h2 className="animate-stagger section-title text-center">
          {t("testimonials.title")}
        </h2>

        <div className="animate-stagger mt-12">
          {/* Testimonial slider */}
          <div className="relative h-[300px] md:h-[220px]">
            {testimonials.map((testimonial: any, index: number) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  activeIndex === index ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <div className="bg-white p-8 rounded-xl shadow-md max-w-3xl mx-auto">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-lg italic mb-6">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="bg-neutral-gray/20 rounded-full w-12 h-12 flex items-center justify-center text-neutral-gray font-bold">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <p className="font-bold">{testimonial.author}</p>
                      <p className="text-neutral-gray text-sm">{testimonial.position}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial navigation dots */}
          <div className="flex justify-center mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`mx-1 rounded-full transition-all ${
                  activeIndex === index
                    ? "w-8 h-2 bg-primary"
                    : "w-2 h-2 bg-neutral-gray hover:bg-primary/50"
                }`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Client logos */}
        <div className="animate-stagger mt-16">
          <p className="text-center text-neutral-gray mb-8 text-sm uppercase tracking-wider">
            Trusted by leading organizations
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {clients.map((client: string, index: number) => (
              <div
                key={index}
                className="bg-white px-6 py-4 rounded-lg shadow-sm"
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
