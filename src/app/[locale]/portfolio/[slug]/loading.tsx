import { Skeleton } from '@/components/landing-v2';

export default function Loading() {
  return (
    <div>
      {/* Hero skeleton */}
      <div className="px-4 pb-16 pt-40 sm:px-6 md:pb-20 md:pt-48">
        <div className="mx-auto max-w-6xl">
          <Skeleton className="mb-8 h-4 w-48" />
          <Skeleton className="h-12 w-72 max-w-full" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="relative z-10 bg-[#050505]">
        {/* Summary strip */}
        <div className="border-y border-white/[0.06] bg-white/[0.02]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`summary-${i.toString()}`} className="px-5 py-6">
                  <Skeleton className="mb-2 h-3 w-16" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Challenge text */}
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 md:py-28">
          <Skeleton className="mb-4 h-3 w-20" />
          <Skeleton className="mb-6 h-8 w-full" />
          <Skeleton className="mb-3 h-4 w-full" />
          <Skeleton className="mb-3 h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Full-width image */}
        <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:pb-28">
          <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
        </div>

        {/* Two-column approach */}
        <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 md:pb-28">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <Skeleton className="mb-4 h-3 w-32" />
              <Skeleton className="mb-3 h-4 w-full" />
              <Skeleton className="mb-3 h-4 w-full" />
              <Skeleton className="mb-6 h-4 w-2/3" />
              <Skeleton className="mb-3 h-4 w-full" />
              <Skeleton className="mb-3 h-4 w-full" />
            </div>
            <Skeleton className="aspect-[3/2] w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
