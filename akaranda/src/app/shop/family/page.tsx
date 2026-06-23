import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import { getProductsByCollection } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function FamilyShopPage() {
  const family = await getProductsByCollection("family");
  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="bg-brand-secondary text-white py-16 px-4 text-center">
        <p className="text-white/70 text-xs tracking-[0.3em] uppercase mb-3">Signature Collection</p>
        <h1 className="text-4xl md:text-5xl font-light">Family Collection</h1>
        <p className="mt-3 text-white/80 text-sm max-w-md mx-auto">Style that connects generations — matching outfits for the whole family</p>
      </div>
      <div className="bg-brand-sand py-8 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-light text-brand-brown mb-2">Build Your Family Matching Outfits</h2>
          <p className="text-brand-muted text-sm mb-4">All family pieces are custom-sized — we tailor to every family member</p>
          <Link href="/wardrobe-services/kiddies" className="btn-primary">Start Building →</Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <p className="text-brand-muted text-sm mb-8">{family.length} products</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {family.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
