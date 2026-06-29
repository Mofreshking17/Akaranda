"use client";

import { useState } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  if (sent) {
    return (
      <div className="bg-brand-accent/10 border border-brand-accent p-8 text-center">
        <div className="text-4xl mb-3">✅</div>
        <p className="text-brand-brown font-medium mb-2">Message sent!</p>
        <p className="text-brand-muted text-sm">We&apos;ll get back to you within 24 hours. You can also reach us faster via WhatsApp.</p>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs tracking-widest uppercase text-brand-muted mb-2">Name *</label>
          <input required value={form.name} onChange={(e) => update("name", e.target.value)}
            className="w-full border border-brand-sand bg-white px-4 py-3 text-sm focus:outline-none focus:border-brand-primary text-brand-brown"
            placeholder="Your name" />
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase text-brand-muted mb-2">Phone</label>
          <input value={form.phone} onChange={(e) => update("phone", e.target.value)}
            className="w-full border border-brand-sand bg-white px-4 py-3 text-sm focus:outline-none focus:border-brand-primary text-brand-brown"
            placeholder="+234..." />
        </div>
      </div>
      <div>
        <label className="block text-xs tracking-widest uppercase text-brand-muted mb-2">Email *</label>
        <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)}
          className="w-full border border-brand-sand bg-white px-4 py-3 text-sm focus:outline-none focus:border-brand-primary text-brand-brown"
          placeholder="your@email.com" />
      </div>
      <div>
        <label className="block text-xs tracking-widest uppercase text-brand-muted mb-2">Subject *</label>
        <select required value={form.subject} onChange={(e) => update("subject", e.target.value)}
          className="w-full border border-brand-sand bg-white px-4 py-3 text-sm focus:outline-none focus:border-brand-primary text-brand-brown">
          <option value="">Select a subject</option>
          <option value="order">Place an Order</option>
          <option value="wardrobe">Wardrobe Service Enquiry</option>
          <option value="delivery">Delivery Enquiry</option>
          <option value="custom">Custom Design Request</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label className="block text-xs tracking-widest uppercase text-brand-muted mb-2">Message *</label>
        <textarea required value={form.message} onChange={(e) => update("message", e.target.value)}
          rows={5}
          className="w-full border border-brand-sand bg-white px-4 py-3 text-sm focus:outline-none focus:border-brand-primary text-brand-brown resize-none"
          placeholder="Tell us what you need..." />
      </div>
      <button type="submit" className="btn-primary w-full text-center">Send Message</button>
    </form>
  );
}
