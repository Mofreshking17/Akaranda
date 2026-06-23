const features = [
  {
    icon: "✦",
    title: "Afro-Inspired Designs",
    desc: "Every piece celebrates African culture, heritage, and artistry.",
  },
  {
    icon: "◈",
    title: "Unique Pieces",
    desc: "No two outfits are exactly alike — your style remains truly yours.",
  },
  {
    icon: "⟳",
    title: "Fast Delivery",
    desc: "24-hour express, 3-day priority, and 7-day standard delivery options.",
  },
  {
    icon: "◇",
    title: "Premium Quality",
    desc: "Carefully sourced fabrics with impeccable craftsmanship and finishing.",
  },
];

export default function WhyAkaranda() {
  return (
    <section className="bg-white py-16 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-subtitle">Why Choose Us</p>
          <h2 className="section-title">The AKARANDA Difference</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div key={i} className="text-center group">
              <div className="text-3xl text-brand-secondary mb-4">{f.icon}</div>
              <h3 className="text-brand-brown text-sm tracking-widest uppercase font-medium mb-3">{f.title}</h3>
              <p className="text-brand-muted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
