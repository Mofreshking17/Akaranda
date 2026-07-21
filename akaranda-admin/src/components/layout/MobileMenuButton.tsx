"use client";

import { Menu } from "lucide-react";
import { useSidebar } from "./SidebarContext";

export default function MobileMenuButton() {
  const { toggle } = useSidebar();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Open navigation menu"
      className="md:hidden -ml-1.5 w-9 h-9 shrink-0 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
    >
      <Menu className="w-5 h-5" />
    </button>
  );
}
