"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, MessageCircle, Lock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { initiateCheckout } from "@/app/actions/checkout";
import { buildWhatsAppLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT (Abuja)", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
  "Taraba", "Yobe", "Zamfara",
];

export default function CartPageClient({ whatsappNumber }: { whatsappNumber?: string }) {
  const { items, removeFromCart, updateQty, clearCart, totalItems, totalPrice } = useCart();
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "", address: "", city: "", state: "" });
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shortfalls, setShortfalls] = useState<{ product_name: string; available: number }[] | null>(null);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center px-4 text-center">
        <ShoppingBag size={64} className="text-brand-sand mb-6" />
        <h1 className="text-3xl font-light text-brand-brown mb-3">Your Cart is Empty</h1>
        <p className="text-brand-muted mb-8 max-w-sm">
          You haven&apos;t added any items yet. Explore our collections and find something beautiful.
        </p>
        <Link href="/shop" className="btn-primary">Browse Collections</Link>
      </div>
    );
  }

  const delivery = totalPrice >= 50000 ? 0 : 3500;
  const orderTotal = totalPrice + delivery;

  async function handlePayWithPaystack() {
    if (!customer.name || !customer.phone || !customer.email || !customer.address || !customer.city || !customer.state) {
      setError("Please fill in your name, email, phone, address, city, and state.");
      return;
    }
    setPlacing(true);
    setError(null);
    setShortfalls(null);

    const callbackUrl = `${window.location.origin}/checkout/callback`;
    const res = await initiateCheckout({
      customer,
      items: items.map((i) => ({
        product_id: i.id,
        product_name: i.name,
        selected_size: i.selectedSize,
        quantity: i.quantity,
        unit_price: i.salePrice ?? i.price,
      })),
      subtotal: totalPrice,
      shippingFee: delivery,
      discount: 0,
      total: orderTotal,
      callbackUrl,
    });

    if (res.ok) {
      clearCart();
      window.location.href = res.authorizationUrl;
      return;
    }
    setError(res.message);
    if (res.shortfalls) setShortfalls(res.shortfalls);
    setPlacing(false);
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <div className="bg-brand-brown text-white py-12 px-4 text-center">
        <p className="text-brand-secondary text-xs tracking-[0.3em] uppercase mb-2">Your Selection</p>
        <h1 className="text-4xl font-light">Shopping Cart</h1>
        <p className="text-white/60 text-sm mt-1">{totalItems} {totalItems === 1 ? "item" : "items"}</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <Link href="/shop" className="flex items-center gap-2 text-brand-muted text-xs tracking-widest uppercase hover:text-brand-primary transition-colors">
              <ArrowLeft size={14} /> Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-brand-muted text-xs tracking-widest uppercase hover:text-red-500 transition-colors"
            >
              Clear All
            </button>
          </div>

          {items.map((item) => (
            <div key={`${item.id}-${item.selectedSize}`} className="bg-white flex gap-4 p-4">
              {/* Image */}
              <div className="relative w-24 h-28 shrink-0 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <div>
                    <p className="text-brand-muted text-[10px] tracking-widest uppercase mb-0.5">{item.category}</p>
                    <h3 className="text-brand-brown font-medium text-sm leading-tight">{item.name}</h3>
                    <p className="text-brand-muted text-xs mt-1">Size: <span className="text-brand-brown font-medium">{item.selectedSize}</span></p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id, item.selectedSize)}
                    className="text-brand-muted hover:text-red-500 transition-colors shrink-0"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  {/* Qty */}
                  <div className="flex items-center border border-brand-sand">
                    <button
                      onClick={() => updateQty(item.id, item.selectedSize, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-brand-sand transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 h-8 flex items-center justify-center text-sm text-brand-brown font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, item.selectedSize, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-brand-sand transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Price */}
                  <p className="text-brand-primary font-medium text-sm">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 sticky top-24">
            <h2 className="text-brand-brown font-medium text-sm tracking-widest uppercase mb-6 pb-4 border-b border-brand-sand">
              Order Summary
            </h2>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={`${item.id}-${item.selectedSize}-summary`} className="flex justify-between text-sm">
                  <span className="text-brand-muted truncate max-w-[150px]">
                    {item.name} ×{item.quantity}
                  </span>
                  <span className="text-brand-brown">₦{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-brand-sand pt-4 space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">Subtotal</span>
                <span className="text-brand-brown">₦{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">Shipping</span>
                <span className={delivery === 0 ? "text-brand-accent font-medium" : "text-brand-brown"}>
                  {delivery === 0 ? "FREE" : `₦${delivery.toLocaleString()}`}
                </span>
              </div>
              {delivery > 0 && (
                <p className="text-brand-muted text-xs">
                  Add ₦{(50000 - totalPrice).toLocaleString()} more for free delivery
                </p>
              )}
              <div className="flex justify-between font-medium pt-2 border-t border-brand-sand">
                <span className="text-brand-brown">Total</span>
                <span className="text-brand-primary text-lg">₦{orderTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Customer details for the order */}
            <div className="space-y-3 mb-4">
              <input
                value={customer.name}
                onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))}
                placeholder="Full name *"
                className="w-full border border-brand-sand bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary text-brand-brown"
              />
              <input
                type="email"
                value={customer.email}
                onChange={(e) => setCustomer((c) => ({ ...c, email: e.target.value }))}
                placeholder="Email *"
                className="w-full border border-brand-sand bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary text-brand-brown"
              />
              <input
                value={customer.phone}
                onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))}
                placeholder="WhatsApp / phone *"
                className="w-full border border-brand-sand bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary text-brand-brown"
              />
              <textarea
                value={customer.address}
                onChange={(e) => setCustomer((c) => ({ ...c, address: e.target.value }))}
                placeholder="Delivery address *"
                rows={2}
                className="w-full border border-brand-sand bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary text-brand-brown resize-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={customer.city}
                  onChange={(e) => setCustomer((c) => ({ ...c, city: e.target.value }))}
                  placeholder="City *"
                  className="w-full border border-brand-sand bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary text-brand-brown"
                />
                <select
                  value={customer.state}
                  onChange={(e) => setCustomer((c) => ({ ...c, state: e.target.value }))}
                  className="w-full border border-brand-sand bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary text-brand-brown"
                >
                  <option value="">State *</option>
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="mb-3">
                <p className="text-red-500 text-xs">{error}</p>
                {shortfalls && (
                  <ul className="text-red-500 text-xs mt-1 list-disc list-inside">
                    {shortfalls.map((s) => (
                      <li key={s.product_name}>{s.product_name} — only {s.available} left in stock</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <button
              onClick={handlePayWithPaystack}
              disabled={placing}
              className="flex items-center justify-center gap-2 w-full text-center btn-primary mb-3 disabled:opacity-60"
            >
              <Lock size={14} /> {placing ? "Redirecting to Paystack..." : "Pay with Paystack"}
            </button>

            <p className="text-brand-muted text-xs text-center leading-relaxed mb-3">
              You&apos;ll be redirected to Paystack&apos;s secure checkout to complete payment by card, bank transfer, or USSD.
            </p>

            <a
              href={buildWhatsAppLink(whatsappNumber, WHATSAPP_MESSAGES.cart)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-brand-primary text-xs tracking-widest uppercase hover:text-brand-secondary transition-colors mb-6"
            >
              <MessageCircle size={14} /> Need help? Chat on WhatsApp
            </a>

            {/* Delivery options reminder */}
            <div className="bg-brand-sand p-4 space-y-2">
              <p className="text-brand-brown text-xs font-medium tracking-widest uppercase mb-2">Delivery Options</p>
              {[
                { label: "Express", time: "24 hours", icon: "🚀" },
                { label: "Priority", time: "3 days", icon: "⚡" },
                { label: "Standard", time: "7 days", icon: "📦" },
              ].map((d) => (
                <div key={d.label} className="flex justify-between text-xs">
                  <span className="text-brand-muted">{d.icon} {d.label}</span>
                  <span className="text-brand-brown">{d.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { icon: "🔒", label: "Secure Payment" },
              { icon: "↩️", label: "Easy Returns" },
              { icon: "🎁", label: "Gift Wrapping" },
            ].map((b) => (
              <div key={b.label} className="bg-white p-3 text-center">
                <div className="text-xl mb-1">{b.icon}</div>
                <p className="text-brand-muted text-[10px] tracking-wide">{b.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
