import Link from "next/link";
import { getProductBySlug, getRelatedProducts, getSettings } from "@/lib/data";
import ProductDetail from "@/components/shop/ProductDetail";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductBySlug(id);

  if (!product) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center text-center px-4">
        <div>
          <p className="text-brand-muted text-6xl mb-4">404</p>
          <h1 className="text-2xl font-light text-brand-brown mb-4">Product Not Found</h1>
          <Link href="/shop" className="btn-primary">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const [related, settings] = await Promise.all([
    getRelatedProducts(product.collection, product.slug, 4),
    getSettings(),
  ]);

  const whatsappNumber =
    (settings.whatsapp?.number as string)?.replace(/\D/g, "") || "2348000000000";

  return <ProductDetail product={product} related={related} whatsappNumber={whatsappNumber} />;
}
