import type { Metadata } from "next";
import "./globals.css";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { CartProvider } from "@/context/CartContext";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "AKARANDA Fashion — Uniquely Styled. Beautifully African.",
  description:
    "AKARANDA Fashion is an Afro-inspired premium fashion brand for children and women. Shop our Kids, Chics, and Family matching collections.",
  keywords: ["African fashion", "kids fashion Nigeria", "Ankara dress", "African women fashion", "AKARANDA"],
  openGraph: {
    title: "AKARANDA Fashion",
    description: "Fashion for Little Stars and Elegant Queens.",
    siteName: "AKARANDA Fashion",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const whatsappNumber = ((settings.whatsapp ?? {}) as { number?: string }).number || "2348000000000";

  return (
    <html lang="en">
      <body>
        <CartProvider>
          <AnnouncementBar />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton number={whatsappNumber} />
        </CartProvider>
      </body>
    </html>
  );
}
