import { Mail, MessageCircle } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";
import { getBusinessContact, getSettings } from "@/lib/data";
import { buildWhatsAppLink, cleanWhatsAppNumber, DEFAULT_WHATSAPP_LABEL, WHATSAPP_MESSAGES } from "@/lib/whatsapp";

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
);
const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);

export default async function ContactPage() {
  const [businessContact, settings] = await Promise.all([getBusinessContact(), getSettings()]);
  const waNumberRaw = businessContact.whatsapp_number || (settings.whatsapp as { number?: string } | undefined)?.number;
  const waNumber = cleanWhatsAppNumber(waNumberRaw);
  const waLabel = businessContact.label || DEFAULT_WHATSAPP_LABEL;
  const waHref = buildWhatsAppLink(waNumberRaw, WHATSAPP_MESSAGES.contact);
  const hours = businessContact.business_hours || "Monday – Saturday, 9:00 AM – 6:00 PM";
  const email = businessContact.support_email || "hello@akaranda.com";

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

          {/* Official WhatsApp card */}
          <div className="bg-brand-brown text-white p-6 mb-8">
            <p className="text-brand-secondary text-xs tracking-widest uppercase mb-1">Official WhatsApp Support & Sales</p>
            <p className="text-2xl font-light mb-1">+{waNumber}</p>
            <p className="text-white/60 text-sm mb-1">{waLabel}</p>
            <p className="text-white/60 text-xs mb-5">Business Hours: {hours}</p>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1db954] text-white px-6 py-3 text-sm font-medium tracking-wide transition-colors"
            >
              <MessageCircle size={18} /> Chat on WhatsApp
            </a>
          </div>

          <div className="space-y-6 mb-10">
            <a href={`mailto:${email}`} className="flex items-start gap-4 group">
              <div className="w-10 h-10 bg-brand-primary text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Mail size={16} />
              </div>
              <div>
                <p className="text-xs tracking-widest uppercase text-brand-muted mb-0.5">Email</p>
                <p className="text-brand-brown font-medium group-hover:text-brand-primary transition-colors">{email}</p>
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
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
