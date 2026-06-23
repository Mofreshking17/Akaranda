"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, User, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";

const shopLinks = [
  { label: "Kids Collection", href: "/shop/kids" },
  { label: "Chic Collection", href: "/shop/chics" },
  { label: "Family Collection", href: "/shop/family" },
  { label: "New Arrivals", href: "/shop/new-arrivals" },
  { label: "Best Sellers", href: "/shop/best-sellers" },
];

const wardrobeLinks = [
  { label: "Kiddies Wardrobe Change", href: "/wardrobe-services/kiddies" },
  { label: "Chic Wardrobe Refresh", href: "/wardrobe-services/chics" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [wardrobeOpen, setWardrobeOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <header className="bg-brand-cream border-b border-brand-sand sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/aka-logo1.jpg"
            alt="AKARANDA Fashion"
            width={120}
            height={40}
            className="object-contain h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8 text-xs tracking-widest uppercase text-brand-brown">
          <Link href="/" className="hover:text-brand-primary transition-colors">Home</Link>

          <div
            className="relative group"
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
          >
            <button className="flex items-center gap-1 hover:text-brand-primary transition-colors">
              Shop <ChevronDown size={12} />
            </button>
            {shopOpen && (
              <div className="absolute top-full left-0 bg-white shadow-lg border border-brand-sand min-w-[200px] py-2 animate-fade-in">
                {shopLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="block px-5 py-2.5 text-xs hover:bg-brand-sand hover:text-brand-primary transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div
            className="relative group"
            onMouseEnter={() => setWardrobeOpen(true)}
            onMouseLeave={() => setWardrobeOpen(false)}
          >
            <button className="flex items-center gap-1 hover:text-brand-primary transition-colors">
              Wardrobe Services <ChevronDown size={12} />
            </button>
            {wardrobeOpen && (
              <div className="absolute top-full left-0 bg-white shadow-lg border border-brand-sand min-w-[220px] py-2 animate-fade-in">
                {wardrobeLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="block px-5 py-2.5 text-xs hover:bg-brand-sand hover:text-brand-primary transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/lookbook" className="hover:text-brand-primary transition-colors">Lookbook</Link>
          <Link href="/about" className="hover:text-brand-primary transition-colors">About Us</Link>
          <Link href="/blog" className="hover:text-brand-primary transition-colors">Blog</Link>
          <Link href="/contact" className="hover:text-brand-primary transition-colors">Contact</Link>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-4 text-brand-brown">
          <button className="hover:text-brand-primary transition-colors hidden md:block">
            <Search size={18} />
          </button>
          <Link href="/account" className="hover:text-brand-primary transition-colors hidden md:block">
            <User size={18} />
          </Link>
          <Link href="/cart" className="hover:text-brand-primary transition-colors relative">
            <ShoppingBag size={18} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>
          <button
            className="lg:hidden hover:text-brand-primary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-brand-sand px-4 pb-6 animate-fade-in">
          <div className="space-y-1 pt-4">
            <Link href="/" className="block py-2 text-xs tracking-widest uppercase text-brand-brown hover:text-brand-primary" onClick={() => setMobileOpen(false)}>Home</Link>
            <div>
              <p className="py-2 text-xs tracking-widest uppercase text-brand-muted font-medium">Shop</p>
              {shopLinks.map((l) => (
                <Link key={l.href} href={l.href} className="block py-2 pl-4 text-xs tracking-wide text-brand-brown hover:text-brand-primary" onClick={() => setMobileOpen(false)}>{l.label}</Link>
              ))}
            </div>
            <div>
              <p className="py-2 text-xs tracking-widest uppercase text-brand-muted font-medium">Wardrobe Services</p>
              {wardrobeLinks.map((l) => (
                <Link key={l.href} href={l.href} className="block py-2 pl-4 text-xs tracking-wide text-brand-brown hover:text-brand-primary" onClick={() => setMobileOpen(false)}>{l.label}</Link>
              ))}
            </div>
            <Link href="/lookbook" className="block py-2 text-xs tracking-widest uppercase text-brand-brown hover:text-brand-primary" onClick={() => setMobileOpen(false)}>Lookbook</Link>
            <Link href="/about" className="block py-2 text-xs tracking-widest uppercase text-brand-brown hover:text-brand-primary" onClick={() => setMobileOpen(false)}>About Us</Link>
            <Link href="/blog" className="block py-2 text-xs tracking-widest uppercase text-brand-brown hover:text-brand-primary" onClick={() => setMobileOpen(false)}>Blog</Link>
            <Link href="/contact" className="block py-2 text-xs tracking-widest uppercase text-brand-brown hover:text-brand-primary" onClick={() => setMobileOpen(false)}>Contact</Link>
          </div>
        </div>
      )}
    </header>
  );
}
