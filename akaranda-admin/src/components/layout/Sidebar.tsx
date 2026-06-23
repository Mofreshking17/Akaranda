"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AdminRole } from "@/lib/types/database";
import { modulesForRole, type Module } from "@/lib/permissions";
import {
  LayoutDashboard, ShoppingBag, ImageIcon, Package, Users, Shirt,
  BookImage, Newspaper, MessageSquareQuote, Mail, FileText, Settings, UserCog,
} from "lucide-react";

const NAV: { module: Module; label: string; href: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { module: "dashboard", label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { module: "products", label: "Products", href: "/products", icon: ShoppingBag },
  { module: "media", label: "Media Library", href: "/media", icon: ImageIcon },
  { module: "orders", label: "Orders", href: "/orders", icon: Package },
  { module: "customers", label: "Customers", href: "/customers", icon: Users },
  { module: "wardrobe", label: "Wardrobe Services", href: "/wardrobe", icon: Shirt },
  { module: "lookbook", label: "Lookbook", href: "/lookbook", icon: BookImage },
  { module: "blog", label: "Blog", href: "/blog", icon: Newspaper },
  { module: "testimonials", label: "Testimonials", href: "/testimonials", icon: MessageSquareQuote },
  { module: "newsletter", label: "Newsletter", href: "/newsletter", icon: Mail },
  { module: "content", label: "Website Content", href: "/content", icon: FileText },
  { module: "team", label: "Team", href: "/team", icon: UserCog },
  { module: "settings", label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar({ role, fullName, email }: { role: AdminRole; fullName: string; email: string }) {
  const pathname = usePathname();
  const allowed = new Set(modulesForRole(role));
  const items = NAV.filter((item) => allowed.has(item.module));

  return (
    <aside className="w-64 h-screen flex flex-col border-r border-neutral-200 bg-white">
      <div className="px-5 py-5 border-b border-neutral-100">
        <p className="font-semibold tracking-tight text-neutral-900">AKARANDA</p>
        <p className="text-xs text-neutral-400 mt-0.5">Admin Dashboard</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                active ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-neutral-100">
        <p className="text-sm font-medium text-neutral-800 truncate">{fullName}</p>
        <p className="text-xs text-neutral-400 truncate">{email}</p>
        <p className="text-[10px] uppercase tracking-wide text-neutral-400 mt-1">{role.replace("_", " ")}</p>
      </div>
    </aside>
  );
}
