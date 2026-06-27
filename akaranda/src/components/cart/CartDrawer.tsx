"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { luxe } from "@/lib/motion";

const FREE_DELIVERY_THRESHOLD = 50000;

export default function CartDrawer() {
  const { items, isCartOpen, closeCart, removeFromCart, updateQty, totalItems, totalPrice } = useCart();
  const reduce = useReducedMotion();

  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - totalPrice);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
          />

          {/* Panel */}
          <motion.aside
            className="fixed top-0 right-0 h-full w-full max-w-md bg-brand-cream z-[61] flex flex-col shadow-2xl"
            initial={reduce ? { opacity: 0 } : { x: "100%" }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: 0.5, ease: luxe }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-sand">
              <h2 className="font-display text-2xl text-brand-brown">
                Your Cart {totalItems > 0 && <span className="text-brand-muted text-base">({totalItems})</span>}
              </h2>
              <button onClick={closeCart} aria-label="Close cart" className="text-brand-muted hover:text-brand-brown transition-colors">
                <X size={22} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                <ShoppingBag size={48} className="text-brand-sand mb-4" />
                <p className="text-brand-brown font-display text-xl mb-2">Your cart is empty</p>
                <p className="text-brand-muted text-sm mb-6">Discover pieces made to be loved.</p>
                <button onClick={closeCart} className="btn-primary">Continue Shopping</button>
              </div>
            ) : (
              <>
                {/* Free delivery progress */}
                <div className="px-6 py-3 bg-brand-sand/50 text-center text-xs text-brand-muted">
                  {remaining > 0 ? (
                    <>Add <span className="text-brand-primary font-medium">₦{remaining.toLocaleString()}</span> more for free delivery</>
                  ) : (
                    <span className="text-brand-accent font-medium">✓ You&apos;ve unlocked free delivery</span>
                  )}
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {items.map((item) => (
                    <div key={`${item.id}__${item.selectedSize}`} className="flex gap-4">
                      <div className="relative w-20 h-24 bg-brand-sand flex-shrink-0 overflow-hidden">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2">
                          <p className="text-brand-brown text-sm font-medium leading-tight">{item.name}</p>
                          <button
                            onClick={() => removeFromCart(item.id, item.selectedSize)}
                            aria-label="Remove item"
                            className="text-brand-muted hover:text-brand-primary transition-colors flex-shrink-0"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <p className="text-brand-muted text-xs mt-0.5">Size: {item.selectedSize}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-brand-sand">
                            <button
                              onClick={() => updateQty(item.id, item.selectedSize, item.quantity - 1)}
                              className="px-2 py-1 text-brand-muted hover:text-brand-brown transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="px-2 text-sm text-brand-brown min-w-[28px] text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQty(item.id, item.selectedSize, item.quantity + 1)}
                              className="px-2 py-1 text-brand-muted hover:text-brand-brown transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <p className="text-brand-primary text-sm font-medium">
                            ₦{((item.salePrice ?? item.price) * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t border-brand-sand px-6 py-5 space-y-4">
                  <div className="flex justify-between text-brand-brown">
                    <span className="text-sm text-brand-muted">Subtotal</span>
                    <span className="font-display text-xl">₦{totalPrice.toLocaleString()}</span>
                  </div>
                  <Link href="/cart" onClick={closeCart} className="btn-primary w-full text-center">
                    View Cart &amp; Checkout
                  </Link>
                  <button onClick={closeCart} className="w-full text-center text-xs tracking-widest uppercase text-brand-muted hover:text-brand-brown transition-colors">
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
