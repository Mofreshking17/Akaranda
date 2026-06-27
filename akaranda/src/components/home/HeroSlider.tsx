"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { luxe, staggerContainer, staggerItem } from "@/lib/motion";
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
  const reduce = useReducedMotion();

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const go = (n: number) => setCurrent((n + slides.length) % slides.length);
  const slide = slides[current];

  return (
    <section className="relative h-[88vh] md:h-screen overflow-hidden bg-brand-brown">
      {/* Crossfading background with slow Ken Burns zoom on the active slide */}
      <AnimatePresence>
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 1.2, ease: luxe }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: reduce ? 1 : 1.0 }}
            animate={{ scale: reduce ? 1 : 1.08 }}
            transition={{ duration: reduce ? 0 : 7, ease: "easeOut" }}
          >
            <Image src={slide.image} alt={slide.tag} fill className="object-cover object-top" priority sizes="100vw" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
        </motion.div>
      </AnimatePresence>

      {/* Staggered text — re-animates on each slide change */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-14 w-full">
          <motion.div
            key={current}
            className="max-w-xl"
            variants={staggerContainer(0.12, 0.15)}
            initial="hidden"
            animate="visible"
          >
            <motion.p variants={staggerItem} className="text-brand-secondary text-xs tracking-[0.35em] uppercase mb-5">
              {slide.tag}
            </motion.p>
            <motion.h1
              variants={staggerItem}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-white leading-[1.05] mb-6 whitespace-pre-line"
            >
              {slide.headline}
            </motion.h1>
            <motion.p variants={staggerItem} className="text-white/80 text-sm md:text-base mb-10 leading-relaxed max-w-md">
              {slide.sub}
            </motion.p>
            <motion.div variants={staggerItem} className="flex flex-wrap gap-4">
              <Link href="/shop" className="btn-gold">Shop Collection</Link>
              <Link href="/wardrobe-services/chics" className="btn-secondary !text-white !border-white/60 hover:!bg-white hover:!text-brand-brown">
                Wardrobe Services
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => go(i)}
                className={`h-0.5 transition-all duration-500 ease-luxe ${i === current ? "bg-brand-secondary w-12" : "bg-white/40 w-5 hover:bg-white/70"}`}
              />
            ))}
          </div>
          <button
            aria-label="Previous slide"
            onClick={() => go(current - 1)}
            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white hover:text-brand-brown text-white flex items-center justify-center transition-all duration-300"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            aria-label="Next slide"
            onClick={() => go(current + 1)}
            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white hover:text-brand-brown text-white flex items-center justify-center transition-all duration-300"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}
    </section>
  );
}
