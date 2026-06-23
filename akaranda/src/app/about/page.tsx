import Link from "next/link";
import Image from "next/image";

const values = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-brand-primary">
        <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: "Celebrate African Culture",
    desc: "Every piece honours the richness of African heritage through fabric, pattern, and craftsmanship.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-brand-primary">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: "Inspire Confidence",
    desc: "AKARANDA fashion is designed to make every woman and child feel their most confident self.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-brand-primary">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: "Promote Individuality",
    desc: "No two AKARANDA pieces are exactly alike — because no two people are exactly alike.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-brand-primary">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Deliver Excellence",
    desc: "From design to delivery, we hold ourselves to the highest standard of quality and service.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Hero */}
      <div className="bg-brand-brown text-white py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <p className="text-brand-secondary text-xs tracking-[0.3em] uppercase mb-4 relative">Our Story</p>
        <h1 className="text-5xl md:text-6xl font-light relative mb-4">About AKARANDA</h1>
        <p className="text-white/70 text-base max-w-xl mx-auto relative">
          Where Heritage Meets Modern Style
        </p>
      </div>

      {/* Brand Story */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative h-80 overflow-hidden">
            <Image
              src="/images/misc/meet-aranda.jpg"
              alt="Aranda — the inspiration behind AKARANDA Fashion"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/40 to-transparent" />
          </div>
          <div>
            <p className="text-brand-secondary text-xs tracking-[0.3em] uppercase mb-4">The Name Behind The Brand</p>
            <h2 className="text-3xl font-light text-brand-brown mb-4">Named After Aranda</h2>
            <p className="text-brand-muted leading-relaxed mb-4">
              AKARANDA Fashion is named after Aranda, a young girl whose charm, innocence, and elegance embody the very values of this brand. Her spirit — confident, bold, beautifully African — breathes life into every collection we create.
            </p>
            <p className="text-brand-muted leading-relaxed">
              Aranda serves as the face of AKARANDA Kids, showcasing new outfits and inspiring parents across Africa with her natural style and love for colour.
            </p>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-brand-primary text-white p-8">
            <div className="text-brand-secondary text-xs tracking-[0.3em] uppercase mb-3">Our Vision</div>
            <p className="text-lg font-light leading-relaxed">
              To become Africa&apos;s leading fashion lifestyle brand for children and women, recognized globally for originality, quality, cultural elegance, and exceptional customer experience.
            </p>
          </div>
          <div className="bg-brand-accent text-white p-8">
            <div className="text-brand-secondary text-xs tracking-[0.3em] uppercase mb-3">Our Mission</div>
            <p className="text-lg font-light leading-relaxed">
              To provide unique, stylish, and comfortable Afro-inspired fashion that empowers women and celebrates childhood while delivering outstanding customer service and convenience.
            </p>
          </div>
        </div>

        {/* Brand Values */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <p className="section-subtitle">What We Stand For</p>
            <h2 className="section-title">Our Brand Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white border border-brand-sand p-6 flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-brand-sand rounded-full flex items-center justify-center">
                  {v.icon}
                </div>
                <div>
                  <h3 className="text-brand-brown font-medium text-sm mb-2">{v.title}</h3>
                  <p className="text-brand-muted text-sm leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slogans */}
        <div className="bg-brand-brown text-white p-10 text-center mb-16">
          <p className="text-brand-secondary text-xs tracking-[0.3em] uppercase mb-6">Our Brand Mantras</p>
          <div className="space-y-4">
            <p className="text-2xl font-light">&ldquo;Uniquely Styled. Beautifully African.&rdquo;</p>
            <p className="text-white/50">—</p>
            <p className="text-xl font-light">&ldquo;Fashion for Little Stars and Elegant Queens.&rdquo;</p>
            <p className="text-white/50">—</p>
            <p className="text-xl font-light">&ldquo;Where Heritage Meets Modern Style.&rdquo;</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-brand-muted mb-6">Ready to experience the AKARANDA difference?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/shop" className="btn-primary">Shop Collections</Link>
            <Link href="/contact" className="btn-secondary">Get In Touch</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
