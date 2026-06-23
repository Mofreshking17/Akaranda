import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    title: "AKARANDA Kids",
    desc: "Babies · Toddlers · Children · Pre-teens",
    href: "/shop/kids",
    image: "/images/categories/kids.jpg",
  },
  {
    title: "AKARANDA Chics",
    desc: "Corporate · Casual · Gowns · Kaftans",
    href: "/shop/chics",
    image: "/images/categories/chics.jpg",
  },
  {
    title: "Family Collection",
    desc: "Mother & Daughter · Matching Sets",
    href: "/shop/family",
    image: "/images/categories/family.jpg",
  },
  {
    title: "New Arrivals",
    desc: "Fresh designs added weekly",
    href: "/shop/new-arrivals",
    image: "/images/categories/new-arrivals.jpg",
  },
];

export default function ShopByCategory() {
  return (
    <section className="bg-brand-cream py-16 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-subtitle">Browse Our Collections</p>
          <h2 className="section-title">Shop By Category</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <Link key={cat.href} href={cat.href} className="group relative overflow-hidden block h-80">
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <h3 className="text-sm tracking-widest uppercase font-medium mb-1">{cat.title}</h3>
                <p className="text-white/70 text-xs mb-3">{cat.desc}</p>
                <span className="text-xs tracking-[0.2em] uppercase border-b border-brand-secondary pb-0.5 text-brand-secondary group-hover:tracking-[0.3em] transition-all duration-300">
                  Shop Now →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
