"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const [showSizes, setShowSizes] = useState(false);

  const handleAddToCart = (size: string) => {
    addToCart(product, size);
    setShowSizes(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="group relative bg-white">
      {/* Image */}
      <div className="relative overflow-hidden h-72">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />

        {product.tag && (
          <span className="absolute top-3 left-3 bg-brand-primary text-white text-[10px] tracking-widest uppercase px-2 py-1 z-10">
            {product.tag}
          </span>
        )}

        <button
          onClick={() => setWished(!wished)}
          className="absolute top-3 right-3 bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <Heart
            size={14}
            className={wished ? "fill-brand-primary text-brand-primary" : "text-brand-brown"}
          />
        </button>

        {/* Size picker overlay */}
        {showSizes && (
          <div className="absolute inset-0 bg-brand-brown/90 flex flex-col items-center justify-center gap-2 p-4 z-20">
            <p className="text-white text-xs tracking-widest uppercase mb-2">Select Size</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => handleAddToCart(s)}
                  className="bg-white text-brand-brown text-xs px-3 py-1.5 hover:bg-brand-secondary hover:text-white transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowSizes(false)}
              className="text-white/60 text-xs mt-2 hover:text-white"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Add to Cart bar */}
        {!showSizes && (
          <button
            onClick={() => product.sizes.length === 1 ? handleAddToCart(product.sizes[0]) : setShowSizes(true)}
            className={`absolute bottom-0 left-0 right-0 py-3 text-center text-xs tracking-widest uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2 z-10 ${
              added
                ? "bg-brand-accent text-white"
                : "bg-brand-brown text-white hover:bg-brand-primary"
            }`}
          >
            {added ? (
              <><Check size={14} /> Added to Cart</>
            ) : (
              <><ShoppingBag size={14} /> Add to Cart</>
            )}
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-brand-muted text-[10px] tracking-widest uppercase mb-1">{product.category}</p>
        <Link href={`/shop/${product.slug}`}>
          <h3 className="text-brand-brown text-sm font-medium hover:text-brand-primary transition-colors leading-tight mb-2">
            {product.name}
          </h3>
        </Link>
        {product.salePrice != null ? (
          <p className="text-brand-primary font-medium text-sm">
            ₦{product.salePrice.toLocaleString()}
            <span className="text-brand-muted line-through ml-2 text-xs">₦{product.price.toLocaleString()}</span>
          </p>
        ) : (
          <p className="text-brand-primary font-medium text-sm">₦{product.price.toLocaleString()}</p>
        )}
      </div>
    </div>
  );
}
