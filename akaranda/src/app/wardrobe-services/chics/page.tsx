"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { submitWardrobeRequest } from "@/app/actions/public";
import { createClient } from "@/lib/supabase/client";
import { buildWhatsAppLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";

const steps = [
  { label: "Your Details" },
  { label: "Your Measurements" },
  { label: "Lifestyle & Style" },
  { label: "Order Details" },
  { label: "Review & Submit" },
];

export default function ChicsWardrobePage() {
  const [waNumber, setWaNumber] = useState<string | undefined>();
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("settings")
      .select("key, value")
      .in("key", ["business_contact", "whatsapp"])
      .then(({ data }) => {
        const businessContact = data?.find((r) => r.key === "business_contact")?.value as { whatsapp_number?: string } | undefined;
        const whatsapp = data?.find((r) => r.key === "whatsapp")?.value as { number?: string } | undefined;
        setWaNumber(businessContact?.whatsapp_number || whatsapp?.number);
      });
  }, []);

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", phone: "", email: "",
    size: "", ageRange: "", bodyType: "",
    lifestyle: [] as string[], style: "mixed", colors: "", budget: "",
    items: "5", occasion: "", notes: "",
  });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await submitWardrobeRequest({
      type: "chics",
      full_name: form.name,
      phone: form.phone,
      email: form.email || undefined,
      measurements: {
        size: form.size,
        age_range: form.ageRange,
        body_type: form.bodyType,
        lifestyle: form.lifestyle.join(", "),
        items_requested: form.items,
      },
      colour_preferences: form.colors.split(",").map((c) => c.trim()).filter(Boolean),
      style_preferences: [form.style, form.notes].filter(Boolean).join(" — "),
      occasion: form.occasion || undefined,
      budget_range: form.budget || undefined,
    });
    setSubmitting(false);
    if (res.ok) setSubmitted(true);
    else setError(res.message);
  };
  const toggleLifestyle = (v: string) =>
    setForm((f) => ({
      ...f,
      lifestyle: f.lifestyle.includes(v)
        ? f.lifestyle.filter((x) => x !== v)
        : [...f.lifestyle, v],
    }));

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">✅</div>
          <h2 className="text-3xl font-light text-brand-brown mb-4">Request Received!</h2>
          <p className="text-brand-muted mb-2">
            Thank you, {form.name}! Your Chic Wardrobe Refresh request is with us. We&apos;ll contact you within 24 hours to confirm your personalized wardrobe package.
          </p>
          <p className="text-brand-muted mb-6">
            For faster assistance, continue the conversation with our Fashion Consultant on WhatsApp.
          </p>
          <a href={buildWhatsAppLink(waNumber, WHATSAPP_MESSAGES.wardrobeChics)}
            className="btn-gold mr-3 inline-flex items-center gap-2" target="_blank" rel="noopener noreferrer">
            <MessageCircle size={16} /> Continue on WhatsApp
          </a>
          <Link href="/" className="btn-secondary">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="bg-brand-accent text-white py-12 px-4 text-center">
        <p className="text-brand-secondary text-xs tracking-[0.3em] uppercase mb-3">Premium Service</p>
        <h1 className="text-3xl md:text-4xl font-light">Chic Wardrobe Refresh</h1>
        <p className="text-white/70 text-sm mt-2">Curated fashion selections for the modern woman — delivered to your door.</p>
      </div>

      {/* Step Indicator */}
      <div className="bg-white border-b border-brand-sand px-4 py-5">
        <div className="max-w-2xl mx-auto flex items-center gap-0">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  i < step ? "bg-brand-accent text-white" :
                  i === step ? "bg-brand-primary text-white" :
                  "bg-brand-sand text-brand-muted"}`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <p className={`text-[10px] mt-1 tracking-wide hidden sm:block ${i === step ? "text-brand-primary" : "text-brand-muted"}`}>
                  {s.label}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 ${i < step ? "bg-brand-accent" : "bg-brand-sand"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-10">

        {step === 0 && (
          <div className="space-y-5">
            <h2 className="text-xl font-light text-brand-brown mb-6">Step 1 — Your Details</h2>
            <div>
              <label className="block text-xs tracking-widest uppercase text-brand-muted mb-2">Full Name *</label>
              <input required value={form.name} onChange={(e) => update("name", e.target.value)}
                className="w-full border border-brand-sand bg-white px-4 py-3 text-sm focus:outline-none focus:border-brand-primary text-brand-brown"
                placeholder="Your full name" />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-brand-muted mb-2">WhatsApp / Phone *</label>
              <input required value={form.phone} onChange={(e) => update("phone", e.target.value)}
                className="w-full border border-brand-sand bg-white px-4 py-3 text-sm focus:outline-none focus:border-brand-primary text-brand-brown"
                placeholder="+234..." />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-brand-muted mb-2">Email Address</label>
              <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)}
                className="w-full border border-brand-sand bg-white px-4 py-3 text-sm focus:outline-none focus:border-brand-primary text-brand-brown"
                placeholder="your@email.com" />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-light text-brand-brown mb-6">Step 2 — Your Measurements</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs tracking-widest uppercase text-brand-muted mb-2">Age Range *</label>
                <select required value={form.ageRange} onChange={(e) => update("ageRange", e.target.value)}
                  className="w-full border border-brand-sand bg-white px-4 py-3 text-sm focus:outline-none focus:border-brand-primary text-brand-brown">
                  <option value="">Select</option>
                  {["18–25","26–35","36–45","46–55","56+"].map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-brand-muted mb-2">Clothing Size *</label>
                <select required value={form.size} onChange={(e) => update("size", e.target.value)}
                  className="w-full border border-brand-sand bg-white px-4 py-3 text-sm focus:outline-none focus:border-brand-primary text-brand-brown">
                  <option value="">Select</option>
                  {["XS","S","M","L","XL","XXL","XXXL","Custom"].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-brand-muted mb-2">Body Type</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "petite", label: "Petite", icon: "🌸" },
                  { value: "average", label: "Average", icon: "💃🏾" },
                  { value: "plus", label: "Plus Size", icon: "🌺" },
                ].map((opt) => (
                  <button type="button" key={opt.value}
                    onClick={() => update("bodyType", opt.value)}
                    className={`p-3 border text-center transition-colors ${form.bodyType === opt.value
                      ? "border-brand-primary bg-brand-primary text-white"
                      : "border-brand-sand bg-white text-brand-brown hover:border-brand-primary"}`}
                  >
                    <div className="text-xl mb-1">{opt.icon}</div>
                    <p className="text-xs">{opt.label}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-brand-muted mb-2">Favourite Colours</label>
              <input value={form.colors} onChange={(e) => update("colors", e.target.value)}
                className="w-full border border-brand-sand bg-white px-4 py-3 text-sm focus:outline-none focus:border-brand-primary text-brand-brown"
                placeholder="e.g. Earthy tones, no yellow" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-xl font-light text-brand-brown mb-6">Step 3 — Lifestyle & Style</h2>
            <div>
              <label className="block text-xs tracking-widest uppercase text-brand-muted mb-3">Lifestyle Needs (Select all that apply)</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "corporate", label: "Corporate Wear", icon: "💼" },
                  { value: "casual", label: "Smart Casual", icon: "👚" },
                  { value: "events", label: "Events & Occasions", icon: "🎉" },
                  { value: "weekend", label: "Weekend Wear", icon: "☀️" },
                  { value: "church", label: "Church / Worship", icon: "🙏🏾" },
                  { value: "travel", label: "Travel Outfits", icon: "✈️" },
                ].map((opt) => (
                  <button type="button" key={opt.value}
                    onClick={() => toggleLifestyle(opt.value)}
                    className={`p-3 border text-left flex items-center gap-3 transition-colors ${
                      form.lifestyle.includes(opt.value)
                        ? "border-brand-primary bg-brand-primary/10 text-brand-primary"
                        : "border-brand-sand bg-white text-brand-brown hover:border-brand-primary"}`}
                  >
                    <span>{opt.icon}</span>
                    <span className="text-xs">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-brand-muted mb-2">Budget Range</label>
              <select value={form.budget} onChange={(e) => update("budget", e.target.value)}
                className="w-full border border-brand-sand bg-white px-4 py-3 text-sm focus:outline-none focus:border-brand-primary text-brand-brown">
                <option value="">Select budget</option>
                {["₦20,000 – ₦50,000","₦50,000 – ₦100,000","₦100,000 – ₦200,000","₦200,000+"].map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-xl font-light text-brand-brown mb-6">Step 4 — Order Details</h2>
            <div>
              <label className="block text-xs tracking-widest uppercase text-brand-muted mb-2">Number of Items *</label>
              <select required value={form.items} onChange={(e) => update("items", e.target.value)}
                className="w-full border border-brand-sand bg-white px-4 py-3 text-sm focus:outline-none focus:border-brand-primary text-brand-brown">
                {["3","5","7","10","15","20+"].map((n) => <option key={n} value={n}>{n} items</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-brand-muted mb-2">Special Occasion / Event</label>
              <input value={form.occasion} onChange={(e) => update("occasion", e.target.value)}
                className="w-full border border-brand-sand bg-white px-4 py-3 text-sm focus:outline-none focus:border-brand-primary text-brand-brown"
                placeholder="e.g. Wedding, office launch, holiday trip..." />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-brand-muted mb-2">Additional Notes</label>
              <textarea value={form.notes} onChange={(e) => update("notes", e.target.value)}
                rows={4}
                className="w-full border border-brand-sand bg-white px-4 py-3 text-sm focus:outline-none focus:border-brand-primary text-brand-brown resize-none"
                placeholder="Any additional preferences, things to avoid, or inspirations..." />
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-xl font-light text-brand-brown mb-6">Step 5 — Review Your Request</h2>
            <div className="bg-white border border-brand-sand p-6 space-y-3 mb-6">
              {[
                ["Name", form.name],
                ["Phone", form.phone],
                ["Email", form.email || "—"],
                ["Age Range", form.ageRange],
                ["Size", form.size],
                ["Body Type", form.bodyType || "—"],
                ["Colours", form.colors || "—"],
                ["Lifestyle", form.lifestyle.join(", ") || "—"],
                ["Budget", form.budget || "—"],
                ["Number of Items", form.items],
                ["Special Occasion", form.occasion || "—"],
                ["Notes", form.notes || "—"],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-4 text-sm">
                  <span className="text-brand-muted w-36 shrink-0">{label}</span>
                  <span className="text-brand-brown font-medium capitalize">{value}</span>
                </div>
              ))}
            </div>
            <div className="bg-brand-sand p-4 text-sm text-brand-muted mb-6">
              <strong className="text-brand-brown">What Happens Next:</strong> We&apos;ll review your request and contact you within 24 hours with your personalized wardrobe package and payment details.
            </div>
          </div>
        )}

        <div className="flex justify-between mt-10">
          <button type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className={`btn-secondary ${step === 0 ? "opacity-0 pointer-events-none" : ""}`}>
            ← Back
          </button>
          {step < steps.length - 1 ? (
            <button type="button" onClick={() => setStep((s) => s + 1)} className="btn-primary">Continue →</button>
          ) : (
            <button type="submit" disabled={submitting} className="btn-gold disabled:opacity-60">{submitting ? "Submitting..." : "Submit Request ✓"}</button>
          )}
        </div>
        {error && <p className="text-red-500 text-sm text-right mt-3">{error}</p>}
      </form>
    </div>
  );
}
