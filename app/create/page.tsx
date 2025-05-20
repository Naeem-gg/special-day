import { CountdownForm } from "@/components/countdown-form"
import { PageHeader } from "@/components/page-header"
import { HeartIcon } from "lucide-react"


export default function CreatePageShell() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white dark:from-slate-950 dark:to-slate-900 py-12">
      <div className="container mx-auto px-4">
        <PageHeader
          title="Create Your Countdown"
          description="Set up a beautiful countdown to your special day"
          icon={<HeartIcon className="h-10 w-10 text-pink-500" />}
        />

        <div className="max-w-3xl mx-auto mt-8">
          <CountdownForm />
        </div>
      </div>
    </div>
  )
}
