interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`animate-pulse bg-warm rounded ${className}`}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3" role="status" aria-label="Loading product">
      <Skeleton className="aspect-square w-full" />
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-3 w-28" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1.5rem]"
      role="status"
      aria-label="Loading products"
    >
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 min-h-[480px]"
      role="status"
      aria-label="Loading hero"
    >
      <div className="bg-warm px-[3rem] py-[4rem] flex flex-col justify-center space-y-4">
        <Skeleton className="h-3 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-12 w-56" />
        </div>
        <Skeleton className="h-16 w-80" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
      <div className="bg-warm" />
    </div>
  );
}
