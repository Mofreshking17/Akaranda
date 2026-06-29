import Link from "next/link";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { getSettings, getContactInfo, getBusinessContact } from "@/lib/data";
import NewsletterForm from "@/components/layout/NewsletterForm";
import { buildWhatsAppLink, cleanWhatsAppNumber, DEFAULT_WHATSAPP_LABEL, WHATSAPP_MESSAGES } from "@/lib/whatsapp";

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
);
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);
const TiktokIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg>
);

export default async function Footer() {
  const [settings, contact, businessContact] = await Promise.all([
    getSettings(),
    getContactInfo(),
    getBusinessContact(),
  ]);
  const social = (settings.social_links ?? {}) as { instagram?: string; facebook?: string; tiktok?: string };
  const whatsapp = (settings.whatsapp ?? {}) as { number?: string };
  const brand = (settings.brand ?? {}) as { name?: string; tagline?: string };

  const waNumberRaw = businessContact.whatsapp_number || whatsapp.number;
  const waNumber = cleanWhatsAppNumber(waNumberRaw);
  const waLabel = businessContact.label || DEFAULT_WHATSAPP_LABEL;
  const waHref = buildWhatsAppLink(waNumberRaw, WHATSAPP_MESSAGES.contact);
  const email = businessContact.support_email || contact.email || "hello@akaranda.com";
  const igUrl = social.instagram || "https://instagram.com";
  const fbUrl = social.facebook || "https://facebook.com";
  const ttUrl = social.tiktok || "https://tiktok.com";

  return (
    <footer className="bg-brand-brown text-brand-sand">
      {/* Newsletter */}
      <div className="bg-brand-primary py-12 px-4 text-center">
        <h3 className="text-2xl font-light tracking-widest uppercase text-white mb-1">Join The AKARANDA Family</h3>
        <p className="text-white/70 text-sm mb-6 tracking-wide">Be the first to know about new collections, exclusive offers, and style tips</p>
        <NewsletterForm />
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <Image src="/aka-logo1.jpg" alt="AKARANDA" width={120} height={40} className="object-contain mb-4 brightness-0 invert opacity-80" />
          <p className="text-brand-sand/70 text-sm leading-relaxed mb-4">
            {brand.tagline || "Uniquely Styled. Beautifully African."}<br />
            Fashion for Little Stars and Elegant Queens.
          </p>
          <div className="flex gap-4">
            <a href={igUrl} target="_blank" rel="noopener noreferrer" className="text-brand-sand/60 hover:text-brand-secondary transition-colors"><InstagramIcon /></a>
            <a href={fbUrl} target="_blank" rel="noopener noreferrer" className="text-brand-sand/60 hover:text-brand-secondary transition-colors"><FacebookIcon /></a>
            <a href={ttUrl} target="_blank" rel="noopener noreferrer" className="text-brand-sand/60 hover:text-brand-secondary transition-colors"><TiktokIcon /></a>
          </div>
        </div>

        <div>
          <h4 className="text-white text-xs tracking-widest uppercase mb-5 font-medium">Quick Links</h4>
          <ul className="space-y-2.5">
            {[
              { label: "Kids Collection", href: "/shop/kids" },
              { label: "Chic Collection", href: "/shop/chics" },
              { label: "Family Collection", href: "/shop/family" },
              { label: "New Arrivals", href: "/shop/new-arrivals" },
              { label: "Lookbook", href: "/lookbook" },
              { label: "About Us", href: "/about" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-brand-sand/70 text-sm hover:text-brand-secondary transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white text-xs tracking-widest uppercase mb-5 font-medium">Our Services</h4>
          <ul className="space-y-2.5">
            {[
              { label: "Kiddies Wardrobe Change", href: "/wardrobe-services/kiddies" },
              { label: "Chic Wardrobe Refresh", href: "/wardrobe-services/chics" },
              { label: "Family Matching Sets", href: "/shop/family" },
              { label: "Express Delivery (24hr)", href: "/contact" },
              { label: "Delivery Policy", href: "/delivery-policy" },
              { label: "Refund Policy", href: "/refund-policy" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-brand-sand/70 text-sm hover:text-brand-secondary transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white text-xs tracking-widest uppercase mb-5 font-medium">Contact Us</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-brand-sand/70 text-sm">
              <Phone size={14} className="text-brand-secondary shrink-0 mt-0.5" />
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="hover:text-brand-secondary transition-colors">
                <span className="block text-white/90 text-xs tracking-wide">{waLabel}</span>
                <span>+{waNumber}</span>
              </a>
            </li>
            <li className="flex items-center gap-3 text-brand-sand/70 text-sm">
              <Mail size={14} className="text-brand-secondary shrink-0" />
              <a href={`mailto:${email}`} className="hover:text-brand-secondary transition-colors">{email}</a>
            </li>
            <li className="flex items-center gap-3 text-brand-sand/70 text-sm">
              <span className="text-brand-secondary shrink-0"><InstagramIcon /></span>
              <a href={igUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-secondary transition-colors">Follow us</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center">
        <p className="text-brand-sand/40 text-xs tracking-wide">© {new Date().getFullYear()} {brand.name || "AKARANDA Fashion"}. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
