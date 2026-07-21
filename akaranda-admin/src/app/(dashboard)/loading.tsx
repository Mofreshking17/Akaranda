export default function DashboardLoading() {
  return (
    <div>
      <div className="h-16 border-b border-border bg-card flex items-center px-4 md:px-6">
        <div className="h-5 w-40 bg-muted rounded animate-pulse" />
      </div>
      <div className="p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-5">
              <div className="h-3 w-20 bg-muted rounded animate-pulse mb-3" />
              <div className="h-7 w-16 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="h-4 w-32 bg-muted rounded animate-pulse mb-4" />
          <div className="h-64 bg-muted/50 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
