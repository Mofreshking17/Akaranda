"use client";

import { useState } from "react";
import type { PublicTestimonial } from "@/lib/data";

const COLORS = ["#8B3A1A", "#2D5A3D", "#C9A84C", "#1C0A00"];

function initialsOf(name: string) {
  return name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function Testimonials({ testimonials }: { testimonials: PublicTestimonial[] }) {
  const [current, setCurrent] = useState(0);

  if (!testimonials || testimonials.length === 0) return null;

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  const t = testimonials[current];

  return (
    <section className="bg-brand-sand py-16 md:py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <p className="section-subtitle">What Our Customers Say</p>
        <h2 className="section-title">Customer Love</h2>

        <div className="mt-10 bg-white p-8 md:p-12 shadow-sm">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-medium mx-auto mb-4"
            style={{ backgroundColor: COLORS[current % COLORS.length] }}
          >
            {initialsOf(t.customer_name)}
          </div>
          <div className="flex justify-center gap-1 mb-4">
            {Array.from({ length: t.rating }).map((_, i) => (
              <span key={i} className="text-brand-secondary">★</span>
            ))}
          </div>
          <blockquote className="text-brand-brown text-base md:text-lg italic leading-relaxed mb-6 max-w-2xl mx-auto">
            &ldquo;{t.testimonial_text}&rdquo;
          </blockquote>
          <p className="text-brand-primary font-medium text-sm">{t.customer_name}</p>
          <p className="text-brand-muted text-xs">
            {[t.location, t.related_collection].filter(Boolean).join(" · ")}
          </p>
        </div>

        {testimonials.length > 1 && (
          <div className="flex justify-center items-center gap-6 mt-8">
            <button onClick={prev} className="w-10 h-10 border border-brand-muted text-brand-muted hover:border-brand-primary hover:text-brand-primary transition-colors flex items-center justify-center">
              ←
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-brand-primary" : "bg-brand-muted/30"}`}
                />
              ))}
            </div>
            <button onClick={next} className="w-10 h-10 border border-brand-muted text-brand-muted hover:border-brand-primary hover:text-brand-primary transition-colors flex items-center justify-center">
              →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
