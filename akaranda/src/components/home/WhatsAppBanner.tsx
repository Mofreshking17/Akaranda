import { MessageCircle } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { getBusinessContact, getSettings } from "@/lib/data";
import { buildWhatsAppLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";

export default async function WhatsAppBanner() {
  const [businessContact, settings] = await Promise.all([getBusinessContact(), getSettings()]);
  const number = businessContact.whatsapp_number || (settings.whatsapp as { number?: string } | undefined)?.number;
  const href = buildWhatsAppLink(number, WHATSAPP_MESSAGES.homepage);

  return (
    <Reveal className="bg-brand-sand">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0">
            <MessageCircle size={20} />
          </div>
          <div>
            <p className="text-brand-brown font-medium">Need help choosing the perfect outfit?</p>
            <p className="text-brand-muted text-sm">Chat with our Fashion Consultant on WhatsApp.</p>
          </div>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary shrink-0 inline-flex items-center gap-2"
        >
          <MessageCircle size={16} /> Chat Now
        </a>
      </div>
    </Reveal>
  );
}
