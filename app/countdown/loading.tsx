import { HeartIcon } from "lucide-react"

export default function CountdownLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="text-center">
        <HeartIcon className="h-16 w-16 text-pink-500 animate-pulse mx-auto" />
        <h2 className="text-2xl font-semibold mt-4">Loading your countdown...</h2>
      </div>
    </div>
  )
}
