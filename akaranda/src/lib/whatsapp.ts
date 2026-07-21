// Central WhatsApp link/message builder. Keeping this in one place means
// switching to the WhatsApp Cloud API later only touches this file plus
// the server action that would call it — components stay unchanged.

export const DEFAULT_WHATSAPP_NUMBER = "2348140012132";
export const DEFAULT_WHATSAPP_LABEL = "AKARANDA Support & Sales Line";

export function cleanWhatsAppNumber(number?: string | null): string {
  const cleaned = (number || "").replace(/\D/g, "");
  return cleaned || DEFAULT_WHATSAPP_NUMBER;
}

export function buildWhatsAppLink(number: string | undefined | null, message: string): string {
  return `https://wa.me/${cleanWhatsAppNumber(number)}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_MESSAGES = {
  homepage: "Hello AKARANDA Fashion, I would like to learn more about your collections.",
  product: "Hello AKARANDA Fashion, I'm interested in this outfit. Could you please provide more information?",
  wardrobeKiddies: "Hello AKARANDA Fashion, I'd like to enquire about the Kiddies Wardrobe Change Service.",
  wardrobeChics: "Hello AKARANDA Fashion, I'd like to enquire about the Chic Wardrobe Refresh Service.",
  contact: "Hello AKARANDA Fashion. I have an enquiry.",
  cart: "Hello AKARANDA Fashion. I need assistance with my order.",
  order: "Hello AKARANDA Fashion, I'd like to ask about my order",
} as const;

const SHOP_CATEGORY_SLUGS = ["kids", "chics", "family", "best-sellers", "new-arrivals"];

/** Picks a contextual pre-filled message for the floating button based on the current route. */
export function messageForPath(pathname: string): string {
  if (pathname.startsWith("/wardrobe-services/kiddies")) return WHATSAPP_MESSAGES.wardrobeKiddies;
  if (pathname.startsWith("/wardrobe-services/chics")) return WHATSAPP_MESSAGES.wardrobeChics;
  if (pathname.startsWith("/contact")) return WHATSAPP_MESSAGES.contact;
  if (pathname.startsWith("/cart")) return WHATSAPP_MESSAGES.cart;
  if (pathname.startsWith("/order/")) return WHATSAPP_MESSAGES.order;
  if (pathname.startsWith("/shop/")) {
    const slug = pathname.split("/")[2];
    if (slug && !SHOP_CATEGORY_SLUGS.includes(slug)) return WHATSAPP_MESSAGES.product;
  }
  return WHATSAPP_MESSAGES.homepage;
}
