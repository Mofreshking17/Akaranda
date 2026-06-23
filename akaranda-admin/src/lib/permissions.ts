import type { AdminRole } from "@/lib/types/database";

export type Module =
  | "dashboard"
  | "products"
  | "media"
  | "orders"
  | "customers"
  | "wardrobe"
  | "lookbook"
  | "blog"
  | "testimonials"
  | "newsletter"
  | "content"
  | "settings"
  | "team";

const ROLE_MODULES: Record<AdminRole, Module[]> = {
  super_admin: [
    "dashboard", "products", "media", "orders", "customers", "wardrobe",
    "lookbook", "blog", "testimonials", "newsletter", "content", "settings", "team",
  ],
  admin: ["dashboard", "products", "media", "orders", "customers", "wardrobe"],
  content_manager: ["dashboard", "media", "lookbook", "blog", "testimonials"],
};

export function canAccess(role: AdminRole, module: Module): boolean {
  return ROLE_MODULES[role]?.includes(module) ?? false;
}

export function modulesForRole(role: AdminRole): Module[] {
  return ROLE_MODULES[role] ?? [];
}
