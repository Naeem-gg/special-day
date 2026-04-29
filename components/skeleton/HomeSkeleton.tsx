import { Skeleton } from "@/components/ui/skeleton"

export function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Nav Skeleton */}
      <div className="h-20 border-b border-amber-100/50 flex items-center px-6 md:px-12 justify-between">
        <Skeleton className="h-10 w-32 rounded-lg" />
        <div className="hidden md:flex gap-8 items-center">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-10 w-40 rounded-full" />
        </div>
        <Skeleton className="h-8 w-8 rounded md:hidden" />
      </div>

      {/* Hero Skeleton */}
      <div className="container mx-auto px-6 pt-24 pb-12 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <Skeleton className="h-10 w-64 rounded-full" />
          <div className="space-y-4">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-3/4 rounded-xl" />
          </div>
          <Skeleton className="h-20 w-full rounded-2xl" />
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-14 w-48 rounded-full" />
            <Skeleton className="h-14 w-48 rounded-full" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-10 w-10 rounded-full border-2 border-white" />)}
            </div>
            <Skeleton className="h-8 w-40 rounded" />
          </div>
        </div>
        <div className="relative flex justify-center">
          <Skeleton className="h-[600px] w-[300px] rounded-[3rem]" />
        </div>
      </div>

      {/* Features Grid Skeleton */}
      <div className="bg-amber-50/30 py-24">
        <div className="container mx-auto px-6 space-y-12">
          <div className="flex flex-col items-center space-y-4">
             <Skeleton className="h-4 w-32 rounded-full" />
             <Skeleton className="h-12 w-96 rounded-xl" />
             <Skeleton className="h-1 w-24 rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-10 bg-white rounded-[2.5rem] border border-amber-100 space-y-6">
                <Skeleton className="h-16 w-16 rounded-2xl" />
                <Skeleton className="h-8 w-3/4 rounded-lg" />
                <div className="space-y-2">
                   <Skeleton className="h-4 w-full rounded" />
                   <Skeleton className="h-4 w-5/6 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
