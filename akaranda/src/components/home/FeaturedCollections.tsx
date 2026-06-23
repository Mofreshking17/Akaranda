import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import { getFeaturedProducts } from "@/lib/data";

export default async function FeaturedCollections() {
  const featured = await getFeaturedProducts(8);

  if (featured.length === 0) return null;

  return (
    <section className="bg-brand-cream py-16 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-subtitle">Handpicked For You</p>
          <h2 className="section-title">Featured Collections</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/shop" className="btn-secondary">View All Collections</Link>
        </div>
      </div>
    </section>
  );
}
