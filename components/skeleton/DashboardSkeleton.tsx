import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50/50 via-white to-amber-50/30 p-4 md:p-8 space-y-10">
      {/* Header Skeleton */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3 w-full md:w-auto">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-5 w-48 rounded-lg" />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Skeleton className="h-12 w-32 rounded-2xl" />
          <Skeleton className="h-12 w-40 rounded-2xl" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10">
        {/* Left Column: Form Areas */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Info Card */}
          <div className="bg-white/60 backdrop-blur-sm rounded-[2.5rem] p-8 border border-white shadow-sm space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-8 w-40 rounded-lg" />
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Skeleton className="h-8 w-48 rounded-lg" />
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Style Grid Header */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div className="space-y-2">
                <Skeleton className="h-8 w-64 rounded-lg" />
                <Skeleton className="h-4 w-96 rounded-lg" />
              </div>
              <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
            
            {/* Template Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="rounded-2xl border border-gray-100 overflow-hidden bg-white">
                  <Skeleton className="aspect-[3/4] w-full" />
                  <div className="p-3 space-y-2">
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-7 w-20 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Preview/Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-[2.5rem] bg-white border border-rose-100 shadow-xl overflow-hidden">
               <div className="p-6 bg-rose-50/50 border-b border-rose-100">
                  <Skeleton className="h-6 w-32 rounded" />
               </div>
               <div className="p-6 space-y-4">
                  <Skeleton className="aspect-[9/16] w-full rounded-2xl mx-auto max-w-[280px]" />
                  <Skeleton className="h-14 w-full rounded-2xl" />
               </div>
            </div>
            
            <div className="rounded-[2rem] bg-amber-50/50 border border-amber-100 p-6 space-y-3">
               <Skeleton className="h-5 w-40 rounded" />
               <Skeleton className="h-3 w-full rounded" />
               <Skeleton className="h-3 w-2/3 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
