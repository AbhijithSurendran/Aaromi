"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface HeroSlide {
  id?: string;
  src: string;
  alt: string;
  tag?: string;
  caption: string;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1auNKkdUkI-9SXwmY1cjlZvKkSGJ288WnPrYZO8WRHaDP5TYmN0WUW3phINchI1g2zBzpRL5QPPXXfLi_llaiHoTHJdYDo7NGitpu3z_0ivG2vsK4mJWaxzkG0dKSl5m4V-6ws0MJAKFI0eCTzNbkFPIFB0hcZAa32Y6g4hYRa2q2wPxt7I281Uo3sLkCW6ACT7GnXSN8U5OlZylgomUOtzegJgX1l6M794o0xbS7z_o4fj6WcXI",
    alt: "Aaromi Studio Admin Dashboard Mockup",
    tag: "Featured Product UI",
    caption: "Admin CMS Dashboard - Complete client control and image uploads"
  },
  {
    id: "slide-2",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhK9r7_kQ03Ld1j7tJTgw91ql1Fhepd31jpfzsCDXwOiL7fqei0KrEcGFut-Ck0PkQ_8ZzF_S8sBOzMXUU2ldA5COU3bpw_qicBoEkv-eqZpWuwvymUN1e-cwZg6JBjFIyCU8QaWJ5YyO6PwqpV2TQDdJIdIVX0GePoEQ1iD0EA6FoQVp7YGMatujsOW9Rr-O9GIWdIjXVS8ttsG0NJGupPeUbVO13SJBRb9zmSPQ1I_o9sW66W2g",
    alt: "Minimalist Tablet Web View Layout Mockup",
    tag: "Editorial Aesthetic",
    caption: "Dynamic and asymmetric layout systems designed for clarity"
  },
  {
    id: "slide-3",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIgE8SzRRHd4RN2Uw7CpK2D2VPa1yh7Ho4D4u8SgKjN9pXv66rMuCF4TWklNgulZqcsLR44LradDcsYolDOhQ4tDWT5FGbK7oWFFLTRlAfFlRKoAdO8Wlnawtpks_J0CSK7uhpuLYkgKXQxcGzWy1i0cwBDDr5A9XMeghJk5wNm0v2itDU6z16vLS5-ip2CxNCPicEmmOkMaUiPxBdYlp7lFHvUKAbzlBrqUxiKkLfjjb6H-PylTQ",
    alt: "Mobile User Interface Mockup Layout Mockup",
    tag: "Responsive Interaction",
    caption: "Seamless mobile checkout and contact form experience"
  }
];

export default function HeroCarousel({ slides }: { slides?: HeroSlide[] }) {
  const activeSlides = slides && slides.length > 0 ? slides : DEFAULT_SLIDES;
  const [currentIndex, setCurrentIndex] = useState(0);

  // If activeSlides count changes and index is out of bounds, reset index
  useEffect(() => {
    if (currentIndex >= activeSlides.length) {
      setCurrentIndex(0);
    }
  }, [activeSlides.length, currentIndex]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === activeSlides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  if (activeSlides.length === 0) return null;

  return (
    <div className="relative w-full max-w-5xl mx-auto h-[450px] md:h-[600px] mt-24 group select-none">
      {/* Slides Container */}
      <div className="w-full h-full rounded-2xl overflow-hidden relative border border-outline-variant/30 shadow-2xl bg-surface-container-low">
        {activeSlides.map((img, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={img.id || idx}
              className={`absolute inset-0 transition-all duration-[1000ms] ease-in-out ${
                isActive 
                  ? "opacity-100 z-10 scale-100 visible" 
                  : "opacity-0 z-0 scale-95 invisible"
              }`}
            >
              <Image
                fill
                sizes="(max-w-768px) 100vw, 85vw"
                className="object-cover"
                alt={img.alt || "Hero Mockup"}
                src={img.src}
                priority={idx === 0}
              />
              
              {/* Bottom Caption Banner */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent p-8 text-left z-20">
                <span className="font-sans font-bold text-xs uppercase tracking-widest text-secondary-fixed">
                  {img.tag || "Featured Product UI"}
                </span>
                <h3 className="text-xl md:text-2xl font-display font-bold text-background mt-2">
                  {img.caption}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-background/80 hover:bg-background border border-outline-variant/30 text-primary rounded-full hover:scale-105 active:scale-95 transition-all shadow-md md:opacity-0 md:group-hover:opacity-100"
            aria-label="Previous mockup"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-background/80 hover:bg-background border border-outline-variant/30 text-primary rounded-full hover:scale-105 active:scale-95 transition-all shadow-md md:opacity-0 md:group-hover:opacity-100"
            aria-label="Next mockup"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? "bg-primary w-8" : "bg-outline-variant hover:bg-outline"
                }`}
                aria-label={`Show slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
