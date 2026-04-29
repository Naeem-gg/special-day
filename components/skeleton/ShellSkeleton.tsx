import { Skeleton } from "@/components/ui/skeleton"

export function ShellSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Skeleton */}
      <div className="h-16 border-b flex items-center px-6 justify-between">
        <Skeleton className="h-8 w-32 rounded" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 container mx-auto px-6 py-12 space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-12 w-1/2 rounded-xl" />
          <Skeleton className="h-6 w-3/4 rounded-lg" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-6 rounded-2xl border space-y-4">
              <Skeleton className="h-48 w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4 rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-5/6 rounded" />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <Skeleton className="h-10 w-48 rounded-lg" />
          <div className="space-y-3">
             <Skeleton className="h-4 w-full rounded" />
             <Skeleton className="h-4 w-full rounded" />
             <Skeleton className="h-4 w-3/4 rounded" />
          </div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="h-24 border-t mt-auto flex items-center px-6">
        <Skeleton className="h-6 w-48 rounded" />
      </div>
    </div>
  )
}
