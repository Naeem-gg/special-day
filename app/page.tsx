import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HeartIcon, CalendarHeartIcon, Clock10Icon, SparklesIcon } from "lucide-react"
import { FloatingHearts } from "@/components/floating-hearts"
import { AnimatedText } from "@/components/animated-text"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white dark:from-slate-950 dark:to-slate-900">
      <FloatingHearts />
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center min-h-screen">
        <div className="space-y-6 max-w-3xl">
          <div className="flex justify-center">
            <HeartIcon className="h-16 w-16 text-pink-500 animate-pulse" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
            BIG DAY
          </h1>

          <AnimatedText
            text="Count down to the moments that matter most"
            className="text-2xl md:text-3xl font-medium text-slate-700 dark:text-slate-200"
          />

          <div className="space-y-8 py-8">
            <div className="grid gap-6 md:grid-cols-3">
              <FeatureCard
                icon={<CalendarHeartIcon className="h-8 w-8 text-pink-500" />}
                title="Wedding Countdown"
                description="Count every heartbeat until you say 'I do' 💍"
              />
              <FeatureCard
                icon={<Clock10Icon className="h-8 w-8 text-pink-500" />}
                title="Never Miss a Moment"
                description="Track days, hours, minutes, and seconds to your special day ⏱️"
              />
              <FeatureCard
                icon={<SparklesIcon className="h-8 w-8 text-pink-500" />}
                title="Celebrate Together"
                description="Share your countdown with loved ones and celebrate together 🎉"
              />
            </div>

            <div className="prose prose-lg dark:prose-invert mx-auto">
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Your wedding day is approaching, and every second counts! Create a beautiful countdown to cherish the
                anticipation and share the excitement with your loved ones.
              </p>
              <p className="text-lg italic text-slate-500 dark:text-slate-400">
                Coming soon: Pregnancy journeys, new job celebrations, and custom events!
              </p>
            </div>
          </div>

          <div className="pt-6">
            <Link href="/create">
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white px-8 py-6 text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce"
              >
                Create Your Countdown ✨
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-pink-100 dark:border-slate-700">
      <div className="flex flex-col items-center space-y-3">
        {icon}
        <h3 className="text-xl font-semibold text-slate-800 dark:text-white">{title}</h3>
        <p className="text-slate-600 dark:text-slate-300">{description}</p>
      </div>
    </div>
  )
}
