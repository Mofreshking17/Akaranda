"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, ShoppingBag, User, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { luxe } from "@/lib/motion";

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

const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [wardrobeOpen, setWardrobeOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const reduce = useReducedMotion();

  return (
    <header className="bg-brand-cream border-b border-brand-sand sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/aka-logo1.jpg" alt="AKARANDA Fashion" width={120} height={40} className="object-contain h-10 w-auto" priority />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8 text-xs tracking-widest uppercase text-brand-brown">
          <Link href="/" className="hover:text-brand-primary transition-colors duration-300">Home</Link>

          <div className="relative" onMouseEnter={() => setShopOpen(true)} onMouseLeave={() => setShopOpen(false)}>
            <button className="flex items-center gap-1 hover:text-brand-primary transition-colors duration-300">
              Shop <ChevronDown size={12} className={`transition-transform duration-300 ${shopOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {shopOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden" animate="visible" exit="hidden"
                  transition={{ duration: 0.22, ease: luxe }}
                  className="absolute top-full left-0 bg-white shadow-xl border border-brand-sand min-w-[200px] py-2"
                >
                  {shopLinks.map((l) => (
                    <Link key={l.href} href={l.href} className="block px-5 py-2.5 text-xs hover:bg-brand-sand hover:text-brand-primary transition-colors duration-200">
                      {l.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative" onMouseEnter={() => setWardrobeOpen(true)} onMouseLeave={() => setWardrobeOpen(false)}>
            <button className="flex items-center gap-1 hover:text-brand-primary transition-colors duration-300">
              Wardrobe Services <ChevronDown size={12} className={`transition-transform duration-300 ${wardrobeOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {wardrobeOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden" animate="visible" exit="hidden"
                  transition={{ duration: 0.22, ease: luxe }}
                  className="absolute top-full left-0 bg-white shadow-xl border border-brand-sand min-w-[220px] py-2"
                >
                  {wardrobeLinks.map((l) => (
                    <Link key={l.href} href={l.href} className="block px-5 py-2.5 text-xs hover:bg-brand-sand hover:text-brand-primary transition-colors duration-200">
                      {l.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/lookbook" className="hover:text-brand-primary transition-colors duration-300">Lookbook</Link>
          <Link href="/about" className="hover:text-brand-primary transition-colors duration-300">About Us</Link>
          <Link href="/blog" className="hover:text-brand-primary transition-colors duration-300">Blog</Link>
          <Link href="/contact" className="hover:text-brand-primary transition-colors duration-300">Contact</Link>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-4 text-brand-brown">
          <button aria-label="Search" className="hover:text-brand-primary transition-colors duration-300 hidden md:block">
            <Search size={18} />
          </button>
          <Link href="/account" aria-label="Account" className="hover:text-brand-primary transition-colors duration-300 hidden md:block">
            <User size={18} />
          </Link>
          <button onClick={openCart} aria-label="Open cart" className="hover:text-brand-primary transition-colors duration-300 relative">
            <ShoppingBag size={18} />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={reduce ? false : { scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 18 }}
                  className="absolute -top-2 -right-2 bg-brand-primary text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center"
                >
                  {totalItems > 9 ? "9+" : totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button className="lg:hidden hover:text-brand-primary transition-colors duration-300" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: luxe }}
            className="lg:hidden bg-white border-t border-brand-sand overflow-hidden"
          >
            <div className="px-4 pb-6 space-y-1 pt-4">
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
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
