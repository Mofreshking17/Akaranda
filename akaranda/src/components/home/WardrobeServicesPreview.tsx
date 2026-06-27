import Link from "next/link";
import Reveal, { RevealItem } from "@/components/ui/Reveal";

function KidsIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
      <circle cx="24" cy="12" r="7" stroke="#8B3A1A" strokeWidth="2" fill="#FAF7F2" />
      <path d="M10 40c0-7.732 6.268-14 14-14s14 6.268 14 14" stroke="#8B3A1A" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M18 28l-4 8M30 28l4 8" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function WomanIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
      <circle cx="24" cy="11" r="7" stroke="#C9A84C" strokeWidth="2" fill="#1C0A00" />
      <path d="M14 42V28c0-5.523 4.477-10 10-10s10 4.477 10 10v14" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M17 30h14" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const deliveryItems = [
  {
    label: "Standard",
    time: "7 Days",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-brand-primary">
        <rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 5v4h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    label: "Priority",
    time: "3 Days",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-brand-primary">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    label: "Express",
    time: "24 Hours",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-brand-primary">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
];

export default function WardrobeServicesPreview() {
  return (
    <section className="bg-white py-16 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-12">
          <p className="section-subtitle">Personalised Fashion</p>
          <h2 className="section-title">Wardrobe Services</h2>
          <p className="text-brand-muted text-sm max-w-xl mx-auto">
            Too busy to shop? Let AKARANDA curate and deliver a complete wardrobe to your door.
          </p>
        </Reveal>

        <Reveal stagger staggerGap={0.12} className="grid md:grid-cols-2 gap-6">
          {/* Kids */}
          <RevealItem className="relative overflow-hidden bg-brand-cream border border-brand-sand p-10 group hover:shadow-xl transition-shadow duration-500">
            <div className="mb-6"><KidsIcon /></div>
            <p className="text-brand-secondary text-xs tracking-[0.2em] uppercase mb-2">For Children</p>
            <h3 className="text-2xl font-light text-brand-brown mb-4">Kiddies Wardrobe Change</h3>
            <p className="text-brand-muted text-sm leading-relaxed mb-6">
              A complete wardrobe makeover for your child. Simply share your child&apos;s age, size, colour preferences, and occasion needs — AKARANDA handles the rest.
            </p>
            <ul className="space-y-2 mb-8">
              {["Age, gender & size selection", "Colour & style preferences", "Casual or formal options", "Sibling wardrobe packages available"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-brand-muted">
                  <span className="text-brand-secondary font-medium">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/wardrobe-services/kiddies" className="btn-primary">Start Now</Link>
          </RevealItem>

          {/* Chics */}
          <RevealItem className="relative overflow-hidden bg-brand-brown p-10 group hover:shadow-xl transition-shadow duration-500">
            <div className="mb-6"><WomanIcon /></div>
            <p className="text-brand-secondary text-xs tracking-[0.2em] uppercase mb-2">For Women</p>
            <h3 className="text-2xl font-light text-white mb-4">Chic Wardrobe Refresh</h3>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Upgrade your style effortlessly. Share your size, lifestyle needs, and colour preferences — AKARANDA creates a personalized wardrobe package just for you.
            </p>
            <ul className="space-y-2 mb-8">
              {["Corporate, casual & event wear", "Body type & size personalisation", "Lifestyle-matched selections", "Budget range options available"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-white/70">
                  <span className="text-brand-secondary font-medium">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/wardrobe-services/chics" className="btn-gold">Start Now</Link>
          </RevealItem>
        </Reveal>

        {/* Delivery Promise */}
        <Reveal stagger staggerGap={0.1} className="mt-10 grid grid-cols-3 gap-4 border-t border-brand-sand pt-10">
          {deliveryItems.map((d) => (
            <RevealItem key={d.label} className="text-center">
              <div className="flex justify-center mb-2">{d.icon}</div>
              <p className="text-brand-primary font-medium text-sm">{d.time}</p>
              <p className="text-brand-muted text-xs tracking-widest uppercase">{d.label} Delivery</p>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
