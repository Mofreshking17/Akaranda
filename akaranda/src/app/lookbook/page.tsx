import Link from "next/link";
import { getLookbookCollections } from "@/lib/data";
import LookbookGallery from "@/components/lookbook/LookbookGallery";

export const dynamic = "force-dynamic";

export default async function LookbookPage() {
  const collections = await getLookbookCollections();

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="bg-brand-brown text-white py-20 px-4 text-center">
        <p className="text-brand-secondary text-xs tracking-[0.3em] uppercase mb-3">Visual Stories</p>
        <h1 className="font-display text-5xl md:text-6xl font-light mb-3">Lookbook</h1>
        <p className="text-white/70 text-sm">Explore our Afro-inspired collections through curated fashion stories</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {collections.length === 0 ? (
          <p className="text-center text-brand-muted py-10">No lookbook collections published yet.</p>
        ) : (
          <LookbookGallery collections={collections} />
        )}

        <div className="text-center pt-16">
          <Link href="/shop" className="btn-primary">Shop All Collections</Link>
        </div>
      </div>
    </div>
  );
}
