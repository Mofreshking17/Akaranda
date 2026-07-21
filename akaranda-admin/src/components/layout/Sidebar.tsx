"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AdminRole } from "@/lib/types/database";
import { modulesForRole, type Module } from "@/lib/permissions";
import { useSidebar } from "./SidebarContext";
import {
  LayoutDashboard, ShoppingBag, ImageIcon, Package, Users, Shirt,
  BookImage, Newspaper, MessageSquareQuote, Mail, FileText, Settings, UserCog, X,
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
  const { open, close } = useSidebar();
  const allowed = new Set(modulesForRole(role));
  const items = NAV.filter((item) => allowed.has(item.module));

  return (
    <>
      {/* Backdrop — mobile only, shown while the drawer is open */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 max-w-[85vw] h-screen flex flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 ease-in-out
          md:static md:z-auto md:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="px-5 py-5 border-b border-sidebar-border flex items-center justify-between">
          <div>
            <p className="font-display text-2xl font-semibold tracking-tight text-foreground leading-none">
              AKARANDA<span className="text-primary">.</span>
            </p>
            <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mt-1.5">Admin Dashboard</p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close navigation menu"
            className="md:hidden w-8 h-8 shrink-0 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {items.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={close}
                className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 ${active ? "" : "group-hover:scale-110"}`} />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-border">
          <p className="text-sm font-medium text-foreground truncate">{fullName}</p>
          <p className="text-xs text-muted-foreground truncate">{email}</p>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground mt-1">{role.replace("_", " ")}</p>
        </div>
      </aside>
    </>
  );
}
