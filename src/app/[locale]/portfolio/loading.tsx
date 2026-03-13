import { Skeleton } from '@/components/landing-v2';

export default function Loading() {
  return (
    <div>
      {/* Hero skeleton */}
      <div className="px-4 pb-16 pt-40 sm:px-6 md:pb-20 md:pt-48">
        <div className="mx-auto max-w-6xl">
          <Skeleton className="mb-4 h-4 w-20" />
          <Skeleton className="mb-3 h-12 w-72 max-w-full" />
          <Skeleton className="h-5 w-96 max-w-full" />
        </div>
      </div>

      {/* Portfolio grid skeleton */}
      <div className="relative z-10 bg-[#050505] pb-20">
        <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
          {/* Filter bar */}
          <div className="mb-12 flex flex-wrap justify-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={`filter-${i.toString()}`} className="h-9 w-24 rounded-full" />
            ))}
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`card-${i.toString()}`}>
                <Skeleton className="mb-4 aspect-[4/3] w-full rounded-2xl" />
                <Skeleton className="mb-2 h-5 w-40" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
