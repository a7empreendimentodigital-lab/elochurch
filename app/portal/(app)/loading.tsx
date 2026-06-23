export default function PortalLoading() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse space-y-6 pb-20">
      <div className="space-y-3 border-b border-border pb-4">
        <div className="h-4 w-24 rounded bg-muted" />
        <div className="h-8 w-48 rounded bg-muted" />
        <div className="h-4 w-32 rounded bg-muted" />
      </div>
      <div className="grid grid-cols-3 gap-6 border-b border-border pb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-20 rounded bg-muted" />
            <div className="h-8 w-12 rounded bg-muted" />
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <div className="h-5 w-28 rounded bg-muted" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-12 rounded border border-border bg-muted/40" />
        ))}
      </div>
    </div>
  );
}
