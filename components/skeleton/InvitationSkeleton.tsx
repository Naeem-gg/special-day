import { Skeleton } from "@/components/ui/skeleton"

export function InvitationSkeleton() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 space-y-12">
      {/* Phone Frame Skeleton */}
      <div className="relative w-[320px] h-[600px] border-[8px] border-gray-900 rounded-[3rem] shadow-2xl overflow-hidden bg-white">
        <div className="h-full w-full flex flex-col p-8 space-y-8">
           <Skeleton className="h-40 w-full rounded-2xl" />
           <div className="space-y-4">
              <Skeleton className="h-10 w-3/4 mx-auto rounded" />
              <Skeleton className="h-6 w-1/2 mx-auto rounded" />
           </div>
           <div className="space-y-3">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
           </div>
           <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <Skeleton className="h-12 w-48 rounded-full" />
        <Skeleton className="h-4 w-64 rounded" />
      </div>
    </div>
  )
}
