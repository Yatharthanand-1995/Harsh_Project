/**
 * Loading skeleton for product grid
 * Shows animated placeholders while products load
 */
export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl bg-white p-4 shadow-lg"
        >
          {/* Image skeleton */}
          <div className="mb-4 aspect-square rounded-xl bg-gray-200" />

          {/* Title skeleton */}
          <div className="mb-2 h-6 rounded bg-gray-200" />

          {/* Description skeleton */}
          <div className="mb-4 space-y-2">
            <div className="h-4 rounded bg-gray-200" />
            <div className="h-4 w-3/4 rounded bg-gray-200" />
          </div>

          {/* Price and button skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-8 w-20 rounded bg-gray-200" />
            <div className="h-10 w-28 rounded-full bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
