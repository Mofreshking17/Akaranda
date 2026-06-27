"use client";

import { motion, useReducedMotion } from "framer-motion";
import { luxe } from "@/lib/motion";

// Subtle fade + rise on every route change. Next.js remounts templates on navigation.
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: luxe }}
    >
      {children}
    </motion.div>
  );
}
