/**
 * Loading skeleton for cart page
 * Shows animated placeholders while cart loads
 */
export function CartSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Cart items skeleton */}
      <div className="lg:col-span-2">
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <div className="mb-6 h-8 w-48 animate-pulse rounded bg-gray-200" />

          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex animate-pulse gap-4 rounded-xl border-2 border-gray-200 p-4"
              >
                {/* Image skeleton */}
                <div className="h-24 w-24 flex-shrink-0 rounded-lg bg-gray-200" />

                {/* Content skeleton */}
                <div className="flex-1 space-y-2">
                  <div className="h-6 w-3/4 rounded bg-gray-200" />
                  <div className="h-4 w-1/2 rounded bg-gray-200" />
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-32 rounded-full bg-gray-200" />
                    <div className="h-6 w-20 rounded bg-gray-200" />
                  </div>
                </div>

                {/* Remove button skeleton */}
                <div className="h-10 w-10 rounded-lg bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order summary skeleton */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 animate-pulse rounded-2xl bg-white p-6 shadow-lg">
          <div className="mb-6 h-8 w-40 rounded bg-gray-200" />

          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="h-5 w-24 rounded bg-gray-200" />
              <div className="h-5 w-16 rounded bg-gray-200" />
            </div>
            <div className="flex justify-between">
              <div className="h-5 w-24 rounded bg-gray-200" />
              <div className="h-5 w-16 rounded bg-gray-200" />
            </div>
            <div className="flex justify-between">
              <div className="h-5 w-24 rounded bg-gray-200" />
              <div className="h-5 w-16 rounded bg-gray-200" />
            </div>

            <div className="border-t-2 pt-4">
              <div className="flex justify-between">
                <div className="h-8 w-20 rounded bg-gray-200" />
                <div className="h-8 w-24 rounded bg-gray-200" />
              </div>
            </div>

            <div className="h-12 w-full rounded-full bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
