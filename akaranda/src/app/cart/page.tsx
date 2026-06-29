import CartPageClient from "@/components/cart/CartPageClient";
import { getBusinessContact, getSettings } from "@/lib/data";

export default async function CartPage() {
  const [businessContact, settings] = await Promise.all([getBusinessContact(), getSettings()]);
  const whatsappNumber = businessContact.whatsapp_number || (settings.whatsapp as { number?: string } | undefined)?.number;

  return <CartPageClient whatsappNumber={whatsappNumber} />;
}
