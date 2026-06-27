"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Delay before this element animates in (seconds). */
  delay?: number;
  /** When true, children with `data-reveal-item` stagger in sequence. */
  stagger?: boolean;
  /** Per-child stagger gap in seconds (only with `stagger`). */
  staggerGap?: number;
  as?: "div" | "section" | "ul" | "li" | "span";
}

/**
 * Scroll-triggered reveal. Animates once when it enters the viewport.
 * Respects prefers-reduced-motion (renders statically).
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  stagger = false,
  staggerGap = 0.08,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const variants: Variants = stagger
    ? staggerContainer(staggerGap, delay)
    : { ...fadeUp, visible: { ...fadeUp.visible, transition: { ...(fadeUp.visible as { transition: object }).transition, delay } } };

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </MotionTag>
  );
}

/** Child wrapper to use inside a <Reveal stagger> parent. */
export function RevealItem({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}
