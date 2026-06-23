"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
);
const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="bg-brand-brown text-white py-16 px-4 text-center">
        <p className="text-brand-secondary text-xs tracking-[0.3em] uppercase mb-3">We&apos;re Here For You</p>
        <h1 className="text-4xl md:text-5xl font-light">Contact Us</h1>
        <p className="text-white/70 text-sm mt-2">Questions, orders, or just want to say hello? Reach out anytime.</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div>
          <h2 className="text-2xl font-light text-brand-brown mb-8">Get In Touch</h2>

          <div className="space-y-6 mb-10">
            <a
              href="https://wa.me/2348000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 group"
            >
              <div className="w-10 h-10 bg-[#25D366] text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              </div>
              <div>
                <p className="text-xs tracking-widest uppercase text-brand-muted mb-0.5">WhatsApp (Preferred)</p>
                <p className="text-brand-brown font-medium group-hover:text-brand-primary transition-colors">Chat with us on WhatsApp</p>
                <p className="text-brand-muted text-xs mt-0.5">Fastest response — typically within 1 hour</p>
              </div>
            </a>

            <a href="mailto:hello@akaranda.com" className="flex items-start gap-4 group">
              <div className="w-10 h-10 bg-brand-primary text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Mail size={16} />
              </div>
              <div>
                <p className="text-xs tracking-widest uppercase text-brand-muted mb-0.5">Email</p>
                <p className="text-brand-brown font-medium group-hover:text-brand-primary transition-colors">hello@akaranda.com</p>
              </div>
            </a>

            <a href="https://instagram.com/akarandafashion" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <InstagramIcon />
              </div>
              <div>
                <p className="text-xs tracking-widest uppercase text-brand-muted mb-0.5">Instagram</p>
                <p className="text-brand-brown font-medium group-hover:text-brand-primary transition-colors">@akarandafashion</p>
              </div>
            </a>

            <a href="https://facebook.com/akarandafashion" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
              <div className="w-10 h-10 bg-[#1877F2] text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <FacebookIcon />
              </div>
              <div>
                <p className="text-xs tracking-widest uppercase text-brand-muted mb-0.5">Facebook</p>
                <p className="text-brand-brown font-medium group-hover:text-brand-primary transition-colors">AKARANDA Fashion</p>
              </div>
            </a>
          </div>

          {/* Delivery Info */}
          <div className="bg-brand-sand p-6">
            <h3 className="text-brand-brown font-medium text-sm mb-4 tracking-widest uppercase">Delivery Options</h3>
            <div className="space-y-2">
              {[
                { label: "Express", time: "24 hours", icon: "🚀" },
                { label: "Priority", time: "3 days", icon: "⚡" },
                { label: "Standard", time: "7 days", icon: "📦" },
              ].map((d) => (
                <div key={d.label} className="flex justify-between items-center text-sm">
                  <span className="text-brand-muted">{d.icon} {d.label} Delivery</span>
                  <span className="text-brand-brown font-medium">{d.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-light text-brand-brown mb-8">Send a Message</h2>
          {sent ? (
            <div className="bg-brand-accent/10 border border-brand-accent p-8 text-center">
              <div className="text-4xl mb-3">✅</div>
              <p className="text-brand-brown font-medium mb-2">Message sent!</p>
              <p className="text-brand-muted text-sm">We&apos;ll get back to you within 24 hours. You can also reach us faster via WhatsApp.</p>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}
