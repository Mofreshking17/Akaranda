"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { luxe } from "@/lib/motion";
import Reveal from "@/components/ui/Reveal";
import type { PublicTestimonial } from "@/lib/data";

const COLORS = ["#8B3A1A", "#2D5A3D", "#C9A84C", "#1C0A00"];

function initialsOf(name: string) {
  return name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function Testimonials({ testimonials }: { testimonials: PublicTestimonial[] }) {
  const [[current, dir], setState] = useState<[number, number]>([0, 0]);
  const reduce = useReducedMotion();

  if (!testimonials || testimonials.length === 0) return null;

  const paginate = (d: number) =>
    setState([(current + d + testimonials.length) % testimonials.length, d]);
  const goTo = (i: number) => setState([i, i > current ? 1 : -1]);

  const t = testimonials[current];

  return (
    <section className="bg-brand-sand py-16 md:py-24 px-4 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        <Reveal>
          <p className="section-subtitle">What Our Customers Say</p>
          <h2 className="section-title">Customer Love</h2>
        </Reveal>

        <div className="mt-10 relative min-h-[340px]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={current}
              custom={dir}
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir >= 0 ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir >= 0 ? -40 : 40 }}
              transition={{ duration: 0.5, ease: luxe }}
              className="bg-white p-8 md:p-12 shadow-sm"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-medium mx-auto mb-4 font-display"
                style={{ backgroundColor: COLORS[current % COLORS.length] }}
              >
                {initialsOf(t.customer_name)}
              </div>
              <div className="flex justify-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={15} className="text-brand-secondary fill-brand-secondary" />
                ))}
              </div>
              <blockquote className="font-display text-brand-brown text-xl md:text-2xl italic leading-relaxed mb-6 max-w-2xl mx-auto">
                &ldquo;{t.testimonial_text}&rdquo;
              </blockquote>
              <p className="text-brand-primary font-medium text-sm">{t.customer_name}</p>
              <p className="text-brand-muted text-xs mt-0.5">
                {[t.location, t.related_collection].filter(Boolean).join(" · ")}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {testimonials.length > 1 && (
          <div className="flex justify-center items-center gap-6 mt-8">
            <button
              aria-label="Previous testimonial"
              onClick={() => paginate(-1)}
              className="w-10 h-10 rounded-full border border-brand-muted/50 text-brand-muted hover:border-brand-primary hover:text-brand-primary hover:bg-white transition-all duration-300 flex items-center justify-center"
            >
              <ArrowLeft size={15} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Testimonial ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ease-luxe ${i === current ? "bg-brand-primary w-6" : "bg-brand-muted/30 w-1.5 hover:bg-brand-muted/60"}`}
                />
              ))}
            </div>
            <button
              aria-label="Next testimonial"
              onClick={() => paginate(1)}
              className="w-10 h-10 rounded-full border border-brand-muted/50 text-brand-muted hover:border-brand-primary hover:text-brand-primary hover:bg-white transition-all duration-300 flex items-center justify-center"
            >
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
