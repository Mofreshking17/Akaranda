"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import { luxe } from "@/lib/motion";
import type { PublicLookbook } from "@/lib/data";

const GROUP_HREF: Record<string, string> = {
  kids: "/shop/kids",
  chics: "/shop/chics",
  family: "/shop/family",
  seasonal: "/shop/new-arrivals",
};

interface LightboxState {
  images: { url: string; caption: string | null }[];
  index: number;
  href: string;
}

export default function LookbookGallery({ collections }: { collections: PublicLookbook[] }) {
  const [box, setBox] = useState<LightboxState | null>(null);
  const reduce = useReducedMotion();

  const close = useCallback(() => setBox(null), []);
  const step = useCallback((d: number) => {
    setBox((b) => (b ? { ...b, index: (b.index + d + b.images.length) % b.images.length } : b));
  }, []);

  useEffect(() => {
    if (!box) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [box, close, step]);

  return (
    <>
      <div className="space-y-20">
        {collections.map((col) => {
          const items = (col.lookbook_items ?? []).slice().sort((a, b) => a.sort_order - b.sort_order);
          const href = GROUP_HREF[col.collection_group] ?? "/shop";
          const images = items.map((it) => ({ url: it.url, caption: it.caption }));
          return (
            <div key={col.id}>
              <Reveal>
                <h2 className="font-display text-3xl font-light text-brand-brown mb-2 border-b border-brand-sand pb-4">{col.title}</h2>
                {col.description && <p className="text-brand-muted text-sm mb-6">{col.description}</p>}
              </Reveal>
              <Reveal stagger staggerGap={0.08} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {items.map((item, i) => (
                  <RevealItem key={i}>
                    <button
                      onClick={() => setBox({ images, index: i, href })}
                      className="group overflow-hidden block w-full text-left"
                    >
                      <div className="relative h-72 overflow-hidden bg-brand-sand">
                        <Image
                          src={item.url}
                          alt={item.caption ?? col.title}
                          fill
                          className="object-cover object-top group-hover:scale-105 transition-transform duration-[800ms] ease-luxe"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors duration-500" />
                      </div>
                      {item.caption && (
                        <p className="mt-3 text-brand-brown text-sm font-medium group-hover:text-brand-primary transition-colors">{item.caption}</p>
                      )}
                    </button>
                  </RevealItem>
                ))}
              </Reveal>
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {box && (
          <motion.div
            className="fixed inset-0 z-[80] bg-brand-brown/95 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
          >
            <button onClick={close} aria-label="Close" className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors">
              <X size={28} />
            </button>

            {box.images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); step(-1); }}
                  aria-label="Previous"
                  className="absolute left-4 md:left-8 text-white/70 hover:text-white transition-colors"
                >
                  <ChevronLeft size={36} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); step(1); }}
                  aria-label="Next"
                  className="absolute right-4 md:right-8 text-white/70 hover:text-white transition-colors"
                >
                  <ChevronRight size={36} />
                </button>
              </>
            )}

            <motion.div
              key={box.index}
              className="relative max-w-3xl w-full"
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: luxe }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[70vh]">
                <Image src={box.images[box.index].url} alt={box.images[box.index].caption ?? "Lookbook"} fill className="object-contain" sizes="100vw" />
              </div>
              <div className="text-center mt-4">
                {box.images[box.index].caption && (
                  <p className="text-white/90 text-sm mb-3">{box.images[box.index].caption}</p>
                )}
                <Link href={box.href} className="btn-gold">Shop This Collection</Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
