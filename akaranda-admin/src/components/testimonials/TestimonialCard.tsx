"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import type { Testimonial } from "@/lib/types/database";
import { deleteTestimonial, toggleTestimonialFeatured, toggleTestimonialHomepage } from "@/app/(dashboard)/testimonials/actions";

export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    try {
      await fn();
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-5 space-y-3">
      <div className="flex items-center gap-3">
        {testimonial.customer_photo ? (
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image src={testimonial.customer_photo} alt={testimonial.customer_name} fill className="object-cover" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-sm font-medium text-neutral-600">
            {testimonial.customer_name.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-medium text-neutral-900 text-sm">{testimonial.customer_name}</p>
          <p className="text-xs text-neutral-400">{testimonial.location}</p>
        </div>
      </div>
      <p className="text-sm text-neutral-600 line-clamp-3">{testimonial.testimonial_text}</p>

      <div className="flex items-center justify-between text-sm">
        <span className="text-neutral-500">Homepage</span>
        <Switch checked={testimonial.show_on_homepage} disabled={busy} onCheckedChange={(v) => run(() => toggleTestimonialHomepage(testimonial.id, v))} />
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-neutral-500">Featured</span>
        <Switch checked={testimonial.is_featured} disabled={busy} onCheckedChange={(v) => run(() => toggleTestimonialFeatured(testimonial.id, v))} />
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="text-red-600 w-full justify-start px-0"
        disabled={busy}
        onClick={() => {
          if (confirm(`Delete testimonial from ${testimonial.customer_name}?`)) run(() => deleteTestimonial(testimonial.id));
        }}
      >
        <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
      </Button>
    </div>
  );
}
