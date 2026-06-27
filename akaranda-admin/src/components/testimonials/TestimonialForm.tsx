"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import MediaPicker from "@/components/media/MediaPicker";

export default function TestimonialForm({
  onSubmit,
}: {
  onSubmit: (values: {
    customer_name: string;
    location: string;
    customer_photo: string;
    rating: number;
    testimonial_text: string;
    related_collection: string;
    is_featured: boolean;
    show_on_homepage: boolean;
  }) => Promise<void>;
}) {
  const [customerName, setCustomerName] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState<string[]>([]);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [relatedCollection, setRelatedCollection] = useState("");
  const [featured, setFeatured] = useState(false);
  const [showOnHomepage, setShowOnHomepage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        customer_name: customerName,
        location,
        customer_photo: photo[0] ?? "",
        rating,
        testimonial_text: text,
        related_collection: relatedCollection,
        is_featured: featured,
        show_on_homepage: showOnHomepage,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <section className="bg-card border border-border rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Customer Name</Label>
            <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
          </div>
          <div>
            <Label>Location</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Lagos" />
          </div>
        </div>
        <div>
          <Label>Customer Photo</Label>
          <MediaPicker selected={photo} onChange={(urls) => setPhoto(urls.slice(-1))} folder="testimonials" />
        </div>
        <div>
          <Label>Rating (1â€“5)</Label>
          <Input type="number" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} />
        </div>
        <div>
          <Label>Testimonial Text</Label>
          <Textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} required />
        </div>
        <div>
          <Label>Related Collection</Label>
          <Input value={relatedCollection} onChange={(e) => setRelatedCollection(e.target.value)} placeholder="AKARANDA Chics" />
        </div>
      </section>

      <section className="bg-card border border-border rounded-lg p-6 grid grid-cols-2 gap-4">
        <div className="flex items-center justify-between border border-border rounded-md px-4 py-3">
          <Label>Featured</Label>
          <Switch checked={featured} onCheckedChange={setFeatured} />
        </div>
        <div className="flex items-center justify-between border border-border rounded-md px-4 py-3">
          <Label>Show on Homepage</Label>
          <Switch checked={showOnHomepage} onCheckedChange={setShowOnHomepage} />
        </div>
      </section>

      <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Add Testimonial"}</Button>
    </form>
  );
}
