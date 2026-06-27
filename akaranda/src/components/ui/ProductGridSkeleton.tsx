// Server-safe skeleton (no client JS) shown via Suspense loading.tsx while products load.
export default function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white">
          <div className="h-72 bg-brand-sand/60 animate-pulse" />
          <div className="p-4 space-y-2">
            <div className="h-2.5 w-1/3 bg-brand-sand/60 animate-pulse rounded" />
            <div className="h-3.5 w-4/5 bg-brand-sand/60 animate-pulse rounded" />
            <div className="h-3 w-1/4 bg-brand-sand/60 animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
