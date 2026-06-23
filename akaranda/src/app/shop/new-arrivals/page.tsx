import ProductCard from "@/components/ui/ProductCard";
import { getNewArrivals } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function NewArrivalsPage() {
  const newArrivals = await getNewArrivals();
  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="bg-brand-brown text-white py-16 px-4 text-center">
        <p className="text-brand-secondary text-xs tracking-[0.3em] uppercase mb-3">Just Dropped</p>
        <h1 className="text-4xl md:text-5xl font-light">New Arrivals</h1>
        <p className="mt-3 text-white/70 text-sm">Fresh Afro-inspired designs added weekly</p>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <p className="text-brand-muted text-sm mb-8">{newArrivals.length} products</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
