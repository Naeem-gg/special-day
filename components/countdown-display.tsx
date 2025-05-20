"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { HeartIcon, ShareIcon, CalendarIcon, Clock } from "lucide-react"

import { mockGetCountdown } from "@/lib/api-mock"
import { formatDate } from "@/lib/utils"
import { Confetti } from "./coinfetti"
import { FloatingHearts } from "./floating-hearts"
import { CountdownTimer } from "./countdown-timer"

interface CountdownParams {
  id?: string
  title?: string
  yourName?: string
  partnerName?: string
  date?: string
  message?: string
}

interface CountdownData {
  id: string
  title: string
  yourName: string
  partnerName: string
  eventDate: Date
  message: string
}

export function CountdownDisplay({ initialParams }: { initialParams: CountdownParams }) {
  const [showConfetti, setShowConfetti] = useState(true)
  const [countdown, setCountdown] = useState<CountdownData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
    isComplete: boolean
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: false })

  useEffect(() => {
    const fetchCountdown = async () => {
      try {
        // Try to get countdown from URL params first
        const { id, title, yourName, partnerName, date, message } = initialParams

        if (id) {
          // If we have an ID, fetch from mock API
          const data = await mockGetCountdown(id)
          setCountdown({
            ...data,
            eventDate: new Date(data.eventDate),
          })
        } else {
          // Otherwise, try to construct from URL params
          const countdownTitle = title || "Our Wedding Day"
          const countdownYourName = yourName || ""
          const countdownPartnerName = partnerName || ""
          const countdownMessage = message || "Can't wait to spend forever with you!"

          if (yourName && partnerName && date) {
            setCountdown({
              id: "shared",
              title: countdownTitle,
              yourName: countdownYourName,
              partnerName: countdownPartnerName,
              eventDate: new Date(date),
              message: countdownMessage,
            })
          } else {
            // No valid countdown data
            throw new Error("No valid countdown data found")
          }
        }
      } catch (error) {
        console.error("Error fetching countdown:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCountdown()

    // Hide confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [initialParams])

  // Handle share functionality
  const handleShare = async () => {
    if (!countdown) return

    const url = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Countdown to ${countdown.title}`,
          text: `${countdown.yourName} and ${countdown.partnerName} are counting down to their big day!`,
          url,
        })
      } catch (error) {
        console.error("Error sharing:", error)
        // Fallback to copy to clipboard
        copyToClipboard(url)
      }
    } else {
      // Fallback for browsers that don't support navigator.share
      copyToClipboard(url)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => alert("Link copied to clipboard!"))
      .catch((err) => console.error("Could not copy text: ", err))
  }

  // Get message based on time remaining
  const getMessage = () => {
    if (!countdown) return ""

    if (timeRemaining.isComplete) {
      return `Congratulations ${countdown.yourName} & ${countdown.partnerName}! Today is your BIG DAY! 🎉💍`
    }

    if (timeRemaining.days <= 3 && timeRemaining.days > 1) {
      return `Just ${timeRemaining.days} days to go! The excitement is building! 💕`
    }

    if (timeRemaining.days === 1) {
      return `Tomorrow is the BIG DAY! Can you believe it? 😍`
    }

    if (timeRemaining.days === 0 && !timeRemaining.isComplete) {
      return `It's happening TODAY! In just a few hours! 💖`
    }

    return countdown.message
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="text-center">
          <HeartIcon className="h-16 w-16 text-pink-500 animate-pulse mx-auto" />
          <h2 className="text-2xl font-semibold mt-4">Loading your countdown...</h2>
        </div>
      </div>
    )
  }

  if (!countdown) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white dark:from-slate-950 dark:to-slate-900">
        <Card className="max-w-md w-full p-6 text-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Countdown Not Found</h2>
            <p className="text-gray-500 dark:text-gray-400">
              We couldn&apos;t find the countdown you&apos;re looking for.
            </p>
            <Link href="/create">
              <Button>Create a New Countdown</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white dark:from-slate-950 dark:to-slate-900 py-12">
      {showConfetti && <Confetti />}
      <FloatingHearts />

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block bg-white dark:bg-slate-800 p-3 rounded-full shadow-lg mb-4">
              <HeartIcon className="h-12 w-12 text-pink-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
              {countdown.title}
            </h1>
            <div className="mt-2 text-xl text-gray-600 dark:text-gray-300 flex items-center justify-center gap-2">
              <span>{countdown.yourName}</span>
              <HeartIcon className="h-5 w-5 text-pink-500 inline animate-pulse" />
              <span>{countdown.partnerName}</span>
            </div>
            <div className="mt-2 flex flex-col md:flex-row items-center justify-center text-gray-500 dark:text-gray-400 gap-2">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>{formatDate(countdown.eventDate)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 ml-2" />
                <span>{formatTime(countdown.eventDate)}</span>
              </div>
            </div>
          </div>

          <Card className="p-6 md:p-8 shadow-xl border-pink-100 dark:border-pink-900 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <div className="text-center mb-6">
              <p className="text-xl md:text-2xl italic text-gray-700 dark:text-gray-200">{getMessage()}</p>
            </div>

            <CountdownTimer targetDate={countdown.eventDate} onTimeUpdate={setTimeRemaining} />

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={handleShare}
                className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white"
                size="lg"
              >
                <ShareIcon className="mr-2 h-4 w-4" />
                Share This Countdown
              </Button>

              <Link href="/create">
                <Button variant="outline" size="lg">
                  Create Your Own
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
