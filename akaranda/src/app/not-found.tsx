import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-brand-cream flex items-center justify-center text-center px-4">
      <div>
        <p className="font-display text-7xl md:text-8xl text-brand-primary mb-2">404</p>
        <h1 className="font-display text-2xl md:text-3xl font-light text-brand-brown mb-4">This page took a different path</h1>
        <p className="text-brand-muted text-sm max-w-sm mx-auto mb-8">
          The page you&apos;re looking for may have moved or no longer exists. Let&apos;s find you something beautiful instead.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn-primary">Back Home</Link>
          <Link href="/shop" className="btn-secondary">Browse the Shop</Link>
        </div>
      </div>
    </div>
  );
}
