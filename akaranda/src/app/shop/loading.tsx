import ProductGridSkeleton from "@/components/ui/ProductGridSkeleton";

export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="bg-brand-brown text-white py-16 px-4 text-center">
        <p className="text-brand-secondary text-xs tracking-[0.3em] uppercase mb-3">Explore Our Collections</p>
        <h1 className="font-display text-4xl md:text-5xl font-light">Shop AKARANDA</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <ProductGridSkeleton count={12} />
      </div>
    </div>
  );
}
