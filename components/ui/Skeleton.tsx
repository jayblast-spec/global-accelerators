export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function AcceleratorCardSkeleton() {
  return (
    <div className="rounded-2xl border p-5 flex flex-col gap-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="flex-1">
          <Skeleton className="h-3.5 w-32 mb-1.5" />
          <Skeleton className="h-2.5 w-20" />
        </div>
      </div>
      <Skeleton className="h-2.5 w-full" />
      <Skeleton className="h-2.5 w-3/4" />
      <div className="flex gap-2 mt-1">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
  );
}
