"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { HeroSlide } from "@/lib/data";

const FALLBACK_SLIDES: HeroSlide[] = [
  {
    image: "/images/hero/hero-1.jpg",
    tag: "AKARANDA FASHION",
    headline: "Uniquely Styled.\nBeautifully African.",
    sub: "Premium Nigerian Ankara, Iro & Buba, and Agbada fashion for women, children, and families.",
  },
];

export default function HeroSlider({ slides: dbSlides }: { slides?: HeroSlide[] }) {
  const slides = dbSlides && dbSlides.length > 0 ? dbSlides : FALLBACK_SLIDES;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[current];

  return (
    <section className="relative h-[88vh] md:h-screen overflow-hidden bg-brand-brown">
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0"}`}
        >
          <Image src={s.image} alt={s.tag} fill className="object-cover object-top" priority={i === 0} sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
        </div>
      ))}

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-14 w-full">
          <div className="max-w-xl">
            <p className="text-brand-secondary text-xs tracking-[0.35em] uppercase mb-5">{slide.tag}</p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white leading-tight mb-6 whitespace-pre-line">
              {slide.headline}
            </h1>
            <p className="text-white/80 text-sm md:text-base mb-10 leading-relaxed max-w-md">{slide.sub}</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop" className="btn-gold">Shop Collection</Link>
              <Link href="/wardrobe-services/chics" className="btn-secondary">Wardrobe Services</Link>
            </div>
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-0.5 transition-all duration-300 ${i === current ? "bg-brand-secondary w-10" : "bg-white/40 w-5"}`}
              />
            ))}
          </div>
          <button onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/20 hover:bg-brand-primary text-white flex items-center justify-center transition-colors text-xl">
            ‹
          </button>
          <button onClick={() => setCurrent((c) => (c + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/20 hover:bg-brand-primary text-white flex items-center justify-center transition-colors text-xl">
            ›
          </button>
        </>
      )}
    </section>
  );
}
