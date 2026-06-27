import Link from "next/link";
import { PackageOpen } from "lucide-react";

export default function EmptyState({
  title = "Nothing here yet",
  message = "We're curating new pieces for this collection. Check back soon.",
  ctaHref = "/shop",
  ctaLabel = "Browse All Products",
}: {
  title?: string;
  message?: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="text-center py-20">
      <PackageOpen size={48} className="text-brand-sand mx-auto mb-5" strokeWidth={1.5} />
      <h2 className="font-display text-2xl text-brand-brown mb-2">{title}</h2>
      <p className="text-brand-muted text-sm max-w-sm mx-auto mb-6">{message}</p>
      <Link href={ctaHref} className="btn-secondary">{ctaLabel}</Link>
    </div>
  );
}
