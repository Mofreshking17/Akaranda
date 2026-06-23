import Image from "next/image";
import Link from "next/link";
import { getLookbookCollections } from "@/lib/data";

export const dynamic = "force-dynamic";

const GROUP_HREF: Record<string, string> = {
  kids: "/shop/kids",
  chics: "/shop/chics",
  family: "/shop/family",
  seasonal: "/shop/new-arrivals",
};

export default async function LookbookPage() {
  const collections = await getLookbookCollections();

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="bg-brand-brown text-white py-20 px-4 text-center">
        <p className="text-brand-secondary text-xs tracking-[0.3em] uppercase mb-3">Visual Stories</p>
        <h1 className="text-5xl font-light mb-3">Lookbook</h1>
        <p className="text-white/70 text-sm">Explore our Afro-inspired collections through curated fashion stories</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        {collections.length === 0 && (
          <p className="text-center text-brand-muted py-10">No lookbook collections published yet.</p>
        )}

        {collections.map((col) => {
          const items = (col.lookbook_items ?? []).slice().sort((a, b) => a.sort_order - b.sort_order);
          const href = GROUP_HREF[col.collection_group] ?? "/shop";
          return (
            <div key={col.id}>
              <h2 className="text-2xl font-light text-brand-brown mb-2 border-b border-brand-sand pb-4">{col.title}</h2>
              {col.description && <p className="text-brand-muted text-sm mb-6">{col.description}</p>}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {items.map((item, i) => (
                  <Link key={i} href={href} className="group overflow-hidden block">
                    <div className="relative h-72 overflow-hidden bg-brand-sand">
                      <Image
                        src={item.url}
                        alt={item.caption ?? col.title}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    </div>
                    {item.caption && (
                      <p className="mt-3 text-brand-brown text-sm font-medium group-hover:text-brand-primary transition-colors">{item.caption}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        <div className="text-center pt-4">
          <Link href="/shop" className="btn-primary">Shop All Collections</Link>
        </div>
      </div>
    </div>
  );
}
