import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import { getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

const filterLinks = [
  { label: "All", href: "/shop" },
  { label: "Kids", href: "/shop/kids" },
  { label: "Chics", href: "/shop/chics" },
  { label: "Family", href: "/shop/family" },
  { label: "New Arrivals", href: "/shop/new-arrivals" },
  { label: "Best Sellers", href: "/shop/best-sellers" },
];

export default async function ShopPage() {
  const products = await getProducts();
  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="bg-brand-brown text-white py-16 px-4 text-center">
        <p className="text-brand-secondary text-xs tracking-[0.3em] uppercase mb-3">Explore Our Collections</p>
        <h1 className="text-4xl md:text-5xl font-light">Shop AKARANDA</h1>
      </div>

      <div className="bg-white border-b border-brand-sand px-4 py-4 overflow-x-auto">
        <div className="flex gap-6 max-w-7xl mx-auto justify-center min-w-max">
          {filterLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-xs tracking-widest uppercase text-brand-muted hover:text-brand-primary transition-colors whitespace-nowrap pb-1 border-b-2 border-transparent hover:border-brand-primary"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <p className="text-brand-muted text-sm mb-8">{products.length} products</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
