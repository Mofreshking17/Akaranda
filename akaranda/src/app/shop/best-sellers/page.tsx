import ProductCard from "@/components/ui/ProductCard";
import { getBestSellers } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function BestSellersPage() {
  const bestSellers = await getBestSellers();
  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="bg-brand-primary text-white py-16 px-4 text-center">
        <p className="text-brand-secondary text-xs tracking-[0.3em] uppercase mb-3">Customer Favourites</p>
        <h1 className="text-4xl md:text-5xl font-light">Best Sellers</h1>
        <p className="mt-3 text-white/70 text-sm">The pieces our customers love most</p>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <p className="text-brand-muted text-sm mb-8">{bestSellers.length} products</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {bestSellers.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
