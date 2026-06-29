"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { submitWardrobeRequest } from "@/app/actions/public";
import { createClient } from "@/lib/supabase/client";
import { buildWhatsAppLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";

const steps = [
  { label: "Your Details" },
  { label: "Child Info" },
  { label: "Style Preference" },
  { label: "Order Details" },
  { label: "Review & Submit" },
];

export default function KiddiesWardrobePage() {
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
    parentName: "", phone: "", email: "",
    childName: "", age: "", gender: "", size: "",
    colors: "", occasion: "mixed",
    items: "5", siblings: "no", notes: "",
    photo: null as File | null,
  });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await submitWardrobeRequest({
      type: "kiddies",
      full_name: form.parentName,
      phone: form.phone,
      email: form.email || undefined,
      measurements: {
        child_name: form.childName,
        age: form.age,
        gender: form.gender,
        size: form.size,
        items_requested: form.items,
        siblings: form.siblings,
      },
      colour_preferences: form.colors.split(",").map((c) => c.trim()).filter(Boolean),
      style_preferences: form.notes || undefined,
      occasion: form.occasion,
    });
    setSubmitting(false);
    if (res.ok) setSubmitted(true);
    else setError(res.message);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">✅</div>
          <h2 className="text-3xl font-light text-brand-brown mb-4">Request Received!</h2>
          <p className="text-brand-muted mb-2">
            Thank you for your request. We&apos;ll review it and contact you within 24 hours to confirm your Kiddies Wardrobe package and arrange payment.
          </p>
          <p className="text-brand-muted mb-6">
            For faster assistance, continue the conversation with our Fashion Consultant on WhatsApp.
          </p>
          <a
            href={buildWhatsAppLink(waNumber, WHATSAPP_MESSAGES.wardrobeKiddies)}
            className="btn-primary mr-3 inline-flex items-center gap-2"
            target="_blank" rel="noopener noreferrer"
          >
            <MessageCircle size={16} /> Continue on WhatsApp
          </a>
          <Link href="/" className="btn-secondary">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Banner */}
      <div className="bg-brand-primary text-white py-12 px-4 text-center">
        <p className="text-brand-secondary text-xs tracking-[0.3em] uppercase mb-3">Premium Service</p>
        <h1 className="text-3xl md:text-4xl font-light">Kiddies Wardrobe Change</h1>
        <p className="text-white/70 text-sm mt-2">Complete wardrobe makeover for your child — curated & delivered.</p>
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
                  "bg-brand-sand text-brand-muted"
                }`}>
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-10">

        {/* Step 0: Parent Details */}
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="text-xl font-light text-brand-brown mb-6">Step 1 — Your Details</h2>
            <div>
              <label className="block text-xs tracking-widest uppercase text-brand-muted mb-2">Full Name *</label>
              <input required value={form.parentName} onChange={(e) => update("parentName", e.target.value)}
                className="w-full border border-brand-sand bg-white px-4 py-3 text-sm focus:outline-none focus:border-brand-primary text-brand-brown"
                placeholder="Your full name" />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-brand-muted mb-2">WhatsApp / Phone Number *</label>
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

        {/* Step 1: Child Info */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-light text-brand-brown mb-6">Step 2 — Child Information</h2>
            <div>
              <label className="block text-xs tracking-widest uppercase text-brand-muted mb-2">Child&apos;s Name</label>
              <input value={form.childName} onChange={(e) => update("childName", e.target.value)}
                className="w-full border border-brand-sand bg-white px-4 py-3 text-sm focus:outline-none focus:border-brand-primary text-brand-brown"
                placeholder="Child's name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs tracking-widest uppercase text-brand-muted mb-2">Age *</label>
                <select required value={form.age} onChange={(e) => update("age", e.target.value)}
                  className="w-full border border-brand-sand bg-white px-4 py-3 text-sm focus:outline-none focus:border-brand-primary text-brand-brown">
                  <option value="">Select age</option>
                  {["0-6 months","6-12 months","1 year","2 years","3 years","4 years","5 years","6 years","7 years","8 years","9 years","10 years","11 years","12 years"].map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-brand-muted mb-2">Gender *</label>
                <select required value={form.gender} onChange={(e) => update("gender", e.target.value)}
                  className="w-full border border-brand-sand bg-white px-4 py-3 text-sm focus:outline-none focus:border-brand-primary text-brand-brown">
                  <option value="">Select gender</option>
                  <option value="girl">Girl</option>
                  <option value="boy">Boy</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-brand-muted mb-2">Size / Measurements</label>
              <input value={form.size} onChange={(e) => update("size", e.target.value)}
                className="w-full border border-brand-sand bg-white px-4 py-3 text-sm focus:outline-none focus:border-brand-primary text-brand-brown"
                placeholder="e.g. Age 4, or chest 56cm / height 100cm" />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-brand-muted mb-2">Favourite Colours</label>
              <input value={form.colors} onChange={(e) => update("colors", e.target.value)}
                className="w-full border border-brand-sand bg-white px-4 py-3 text-sm focus:outline-none focus:border-brand-primary text-brand-brown"
                placeholder="e.g. Pink, yellow, blue — no dark colours" />
            </div>
          </div>
        )}

        {/* Step 2: Style Preference */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-xl font-light text-brand-brown mb-6">Step 3 — Style Preference</h2>
            <div>
              <label className="block text-xs tracking-widest uppercase text-brand-muted mb-3">Occasion Type *</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "casual", label: "Casual", icon: "👕" },
                  { value: "formal", label: "Formal", icon: "👗" },
                  { value: "mixed", label: "Mixed", icon: "🎨" },
                ].map((opt) => (
                  <button type="button" key={opt.value}
                    onClick={() => update("occasion", opt.value)}
                    className={`p-4 border text-center transition-colors ${form.occasion === opt.value
                      ? "border-brand-primary bg-brand-primary text-white"
                      : "border-brand-sand bg-white text-brand-brown hover:border-brand-primary"}`}
                  >
                    <div className="text-2xl mb-1">{opt.icon}</div>
                    <p className="text-xs tracking-wide">{opt.label}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-brand-muted mb-2">Sibling Wardrobe?</label>
              <div className="flex gap-4">
                {["no", "yes"].map((v) => (
                  <button type="button" key={v}
                    onClick={() => update("siblings", v)}
                    className={`px-6 py-2.5 border text-xs tracking-widest uppercase transition-colors ${form.siblings === v
                      ? "border-brand-primary bg-brand-primary text-white"
                      : "border-brand-sand bg-white text-brand-brown hover:border-brand-primary"}`}
                  >
                    {v === "yes" ? "Yes — include sibling" : "No"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Order Details */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-xl font-light text-brand-brown mb-6">Step 4 — Order Details</h2>
            <div>
              <label className="block text-xs tracking-widest uppercase text-brand-muted mb-2">Number of Items Needed *</label>
              <select required value={form.items} onChange={(e) => update("items", e.target.value)}
                className="w-full border border-brand-sand bg-white px-4 py-3 text-sm focus:outline-none focus:border-brand-primary text-brand-brown">
                {["3","5","7","10","15","20+"].map((n) => (
                  <option key={n} value={n}>{n} items</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-brand-muted mb-2">Upload Child Photo (Optional)</label>
              <input type="file" accept="image/*"
                onChange={(e) => setForm((f) => ({ ...f, photo: e.target.files?.[0] ?? null }))}
                className="w-full border border-brand-sand bg-white px-4 py-3 text-sm text-brand-muted file:mr-4 file:text-xs file:border-0 file:bg-brand-primary file:text-white file:px-3 file:py-1" />
              <p className="text-brand-muted text-xs mt-1">Helps us understand your child&apos;s style better</p>
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-brand-muted mb-2">Additional Notes</label>
              <textarea value={form.notes} onChange={(e) => update("notes", e.target.value)}
                rows={4}
                className="w-full border border-brand-sand bg-white px-4 py-3 text-sm focus:outline-none focus:border-brand-primary text-brand-brown resize-none"
                placeholder="Any special requests, occasions, or design preferences..." />
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-light text-brand-brown mb-6">Step 5 — Review Your Request</h2>
            <div className="bg-white border border-brand-sand p-6 space-y-3 mb-6">
              {[
                ["Parent Name", form.parentName],
                ["Phone / WhatsApp", form.phone],
                ["Email", form.email || "—"],
                ["Child Name", form.childName || "—"],
                ["Age", form.age],
                ["Gender", form.gender],
                ["Size", form.size || "—"],
                ["Favourite Colours", form.colors || "—"],
                ["Style", form.occasion],
                ["Number of Items", form.items],
                ["Sibling Wardrobe", form.siblings],
                ["Additional Notes", form.notes || "—"],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-4 text-sm">
                  <span className="text-brand-muted w-40 shrink-0">{label}</span>
                  <span className="text-brand-brown font-medium capitalize">{value}</span>
                </div>
              ))}
            </div>
            <div className="bg-brand-sand p-4 text-sm text-brand-muted mb-6">
              <strong className="text-brand-brown">Delivery Promise:</strong> We will contact you within 24 hours to confirm your order and arrange payment. Standard delivery within 7 days.
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-10">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className={`btn-secondary ${step === 0 ? "opacity-0 pointer-events-none" : ""}`}
          >
            ← Back
          </button>
          {step < steps.length - 1 ? (
            <button type="button" onClick={() => setStep((s) => s + 1)} className="btn-primary">
              Continue →
            </button>
          ) : (
            <button type="submit" disabled={submitting} className="btn-gold disabled:opacity-60">
              {submitting ? "Submitting..." : "Submit Request ✓"}
            </button>
          )}
        </div>
        {error && <p className="text-red-500 text-sm text-right mt-3">{error}</p>}
      </form>
    </div>
  );
}
