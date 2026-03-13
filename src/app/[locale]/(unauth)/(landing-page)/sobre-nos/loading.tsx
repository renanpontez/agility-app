import { Skeleton } from '@/components/landing-v2';

export default function Loading() {
  return (
    <div>
      {/* Hero skeleton */}
      <div className="px-4 pb-16 pt-40 sm:px-6 md:pb-20 md:pt-48">
        <div className="mx-auto max-w-6xl">
          <Skeleton className="mb-4 h-4 w-20" />
          <Skeleton className="mb-3 h-12 w-80 max-w-full" />
          <Skeleton className="h-5 w-96 max-w-full" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="relative z-10 bg-[#050505]">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <Skeleton className="mb-6 h-40 w-full rounded-2xl" />
        </div>

        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={`card-${i.toString()}`} className="h-72 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
