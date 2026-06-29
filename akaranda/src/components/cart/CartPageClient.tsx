"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Check, MessageCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/app/actions/public";
import { buildWhatsAppLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";

export default function CartPageClient({ whatsappNumber }: { whatsappNumber?: string }) {
  const { items, removeFromCart, updateQty, clearCart, totalItems, totalPrice } = useCart();
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "", address: "" });
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<string | null>(null);

  if (confirmed) {
    return (
      <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-brand-accent text-white flex items-center justify-center mb-6">
          <Check size={32} />
        </div>
        <h1 className="text-3xl font-light text-brand-brown mb-3">Order Placed!</h1>
        <p className="text-brand-muted mb-2 max-w-sm">
          Your order <span className="font-medium text-brand-brown">{confirmed}</span> has been received.
          We&apos;ll confirm availability and arrange payment within 24 hours.
        </p>
        <div className="bg-white border border-brand-sand p-6 mt-6 max-w-sm">
          <p className="text-brand-brown font-medium mb-1">Need to discuss your order?</p>
          <p className="text-brand-muted text-sm mb-4">Chat with AKARANDA Support on WhatsApp.</p>
          <a
            href={buildWhatsAppLink(whatsappNumber, `Hello AKARANDA Fashion, I'd like to discuss my order ${confirmed}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            <MessageCircle size={16} /> Chat on WhatsApp
          </a>
        </div>
        <Link href="/shop" className="btn-secondary mt-4">Continue Shopping</Link>
      </div>
    );
  }

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

  const whatsappItems = items
    .map((i) => `• ${i.name} (Size: ${i.selectedSize}) x${i.quantity} — ₦${(i.price * i.quantity).toLocaleString()}`)
    .join("\n");

  const orderWhatsappHref = buildWhatsAppLink(
    whatsappNumber,
    `Hello AKARANDA Fashion! 🛍️\n\nI would like to place an order:\n\n${whatsappItems}\n\nSubtotal: ₦${totalPrice.toLocaleString()}\nDelivery: ₦${delivery.toLocaleString()}\nTotal: ₦${orderTotal.toLocaleString()}\n\nPlease confirm availability and payment details. Thank you!`
  );

  async function handlePlaceOrder() {
    if (!customer.name || !customer.phone) {
      setError("Please enter your name and phone number.");
      return;
    }
    setPlacing(true);
    setError(null);
    const res = await createOrder({
      customer_name: customer.name,
      customer_phone: customer.phone,
      customer_email: customer.email || undefined,
      delivery_address: customer.address || undefined,
      items: items.map((i) => ({
        product_id: i.id,
        product_name: i.name,
        selected_size: i.selectedSize,
        quantity: i.quantity,
        unit_price: i.salePrice ?? i.price,
      })),
      subtotal: totalPrice,
      delivery_fee: delivery,
      total: orderTotal,
    });
    setPlacing(false);
    if (res.ok && res.orderNumber) {
      // Also open WhatsApp so the customer can chat with the brand
      window.open(orderWhatsappHref, "_blank");
      clearCart();
      setConfirmed(res.orderNumber);
    } else {
      setError(res.message);
    }
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
                <span className="text-brand-muted">Delivery</span>
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
                value={customer.phone}
                onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))}
                placeholder="WhatsApp / phone *"
                className="w-full border border-brand-sand bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary text-brand-brown"
              />
              <input
                type="email"
                value={customer.email}
                onChange={(e) => setCustomer((c) => ({ ...c, email: e.target.value }))}
                placeholder="Email (optional)"
                className="w-full border border-brand-sand bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary text-brand-brown"
              />
              <textarea
                value={customer.address}
                onChange={(e) => setCustomer((c) => ({ ...c, address: e.target.value }))}
                placeholder="Delivery address (optional)"
                rows={2}
                className="w-full border border-brand-sand bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary text-brand-brown resize-none"
              />
            </div>

            {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="block w-full text-center btn-primary mb-3 disabled:opacity-60"
            >
              {placing ? "Placing Order..." : "Place Order ✓"}
            </button>

            <p className="text-brand-muted text-xs text-center leading-relaxed mb-3">
              Your full order details will be sent to our WhatsApp. We&apos;ll confirm and arrange payment within 24 hours.
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
              { icon: "🔒", label: "Secure Order" },
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
