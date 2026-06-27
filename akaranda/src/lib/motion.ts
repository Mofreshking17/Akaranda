import type { Variants, Transition } from "framer-motion";

// Restrained editorial-luxury easing (ease-out-expo-ish) used across the storefront.
export const luxe: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const durations = {
  reveal: 0.6,
  hero: 1.0,
  micro: 0.3,
} as const;

export const baseTransition: Transition = {
  duration: durations.reveal,
  ease: luxe,
};

// A single element rising into place.
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: baseTransition },
};

// Gentler fade with no displacement (for images / overlays).
export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: baseTransition },
};

// Parent that staggers its children's reveal.
export const staggerContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

// Child used inside a staggerContainer.
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: baseTransition },
};
