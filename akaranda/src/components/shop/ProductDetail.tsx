"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Heart, Check, ArrowLeft, Truck, RotateCcw, Shield } from "lucide-react";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ui/ProductCard";
import type { Product } from "@/lib/products";

export default function ProductDetail({
  product,
  related,
  whatsappNumber,
}: {
  product: Product;
  related: Product[];
  whatsappNumber: string;
}) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  const displayPrice = product.salePrice ?? product.price;

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addToCart(product, selectedSize || "One Size");
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const waText = encodeURIComponent(
    `Hello AKARANDA! I'd like to order:\n\n• ${product.name}\n  Size: ${selectedSize || "TBD"}\n  Price: ₦${displayPrice.toLocaleString()}\n\nPlease confirm availability. Thank you!`
  );

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="bg-white border-b border-brand-sand px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-brand-muted">
          <Link href="/shop" className="hover:text-brand-primary flex items-center gap-1">
            <ArrowLeft size={12} /> Shop
          </Link>
          <span>/</span>
          <Link href={`/shop/${product.collection}`} className="hover:text-brand-primary capitalize">
            {product.collection}
          </Link>
          <span>/</span>
          <span className="text-brand-brown truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 mb-20">
          <div className="relative h-[500px] md:h-[620px] overflow-hidden bg-brand-sand">
            <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority />
            {product.tag && (
              <span className="absolute top-4 left-4 bg-brand-primary text-white text-xs tracking-widest uppercase px-3 py-1">
                {product.tag}
              </span>
            )}
            <button onClick={() => setWished(!wished)} className="absolute top-4 right-4 bg-white p-2.5 hover:bg-brand-sand transition-colors">
              <Heart size={16} className={wished ? "fill-brand-primary text-brand-primary" : "text-brand-brown"} />
            </button>
          </div>

          <div className="flex flex-col">
            <p className="text-brand-muted text-xs tracking-widest uppercase mb-2">{product.category}</p>
            <h1 className="text-3xl md:text-4xl font-light text-brand-brown mb-3 leading-tight">{product.name}</h1>
            <p className="text-3xl text-brand-primary font-light mb-6">
              ₦{displayPrice.toLocaleString()}
              {product.salePrice != null && (
                <span className="text-brand-muted line-through text-lg ml-3">₦{product.price.toLocaleString()}</span>
              )}
            </p>

            <p className="text-brand-muted text-sm leading-relaxed mb-8">{product.description}</p>

            {product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs tracking-widest uppercase text-brand-brown font-medium">Select Size</label>
                  {sizeError && <span className="text-red-500 text-xs">Please select a size</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setSelectedSize(s); setSizeError(false); }}
                      className={`px-4 py-2 border text-xs tracking-wide transition-colors ${
                        selectedSize === s
                          ? "border-brand-primary bg-brand-primary text-white"
                          : "border-brand-sand bg-white text-brand-brown hover:border-brand-primary"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-colors font-medium ${
                  added ? "bg-brand-accent text-white" : "bg-brand-primary text-white hover:bg-brand-brown"
                }`}
              >
                {added ? <><Check size={15} /> Added to Cart</> : <><ShoppingBag size={15} /> Add to Cart</>}
              </button>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 border border-brand-primary text-brand-primary text-xs tracking-widest uppercase hover:bg-brand-primary hover:text-white transition-colors flex items-center gap-2 font-medium"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                Order
              </a>
            </div>

            <div className="grid grid-cols-3 gap-3 border-t border-brand-sand pt-6">
              {[
                { icon: <Truck size={16} />, label: "Fast Delivery", sub: "24hr–7 days" },
                { icon: <RotateCcw size={16} />, label: "Easy Returns", sub: "30% refund policy" },
                { icon: <Shield size={16} />, label: "Quality Promise", sub: "Premium fabric" },
              ].map((g) => (
                <div key={g.label} className="text-center">
                  <div className="text-brand-secondary flex justify-center mb-1">{g.icon}</div>
                  <p className="text-brand-brown text-xs font-medium">{g.label}</p>
                  <p className="text-brand-muted text-[10px]">{g.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div>
            <div className="text-center mb-10">
              <p className="section-subtitle">You May Also Like</p>
              <h2 className="section-title">Related Products</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
