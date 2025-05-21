"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { mockGetCountdown } from "@/lib/api-mock"
import { formatDate } from "@/lib/utils"
import { CalendarIcon, Clock, InboxIcon as EnvelopeIcon, HeartIcon, ShareIcon } from 'lucide-react'
import Link from "next/link"
import { useEffect, useState } from "react"
import { Confetti } from "./coinfetti"
import { CountdownTimer } from "./countdown-timer"
import { FloatingHearts } from "./floating-hearts"
import { InvitationForm } from "./invitation-form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"


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
  const [showInviteDialog, setShowInviteDialog] = useState(false)

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

  // Generate a professional share message based on the countdown details
  const generateShareMessage = () => {
    if (!countdown) return ""

    const formattedDate = formatDate(countdown.eventDate)
    const formattedTime = formatTime(countdown.eventDate)
    
    // Different messages based on time remaining
    if (timeRemaining.isComplete) {
      return `Today is the day! ${countdown.yourName} and ${countdown.partnerName}'s ${countdown.title.toLowerCase()} is happening now!`
    }
    
    if (timeRemaining.days === 0) {
      return `${countdown.yourName} and ${countdown.partnerName}'s ${countdown.title} is happening today at ${formattedTime}! Join us in the celebration!`
    }
    
    if (timeRemaining.days === 1) {
      return `${countdown.yourName} and ${countdown.partnerName}'s ${countdown.title} is tomorrow! The excitement is building for their special day on ${formattedDate} at ${formattedTime}.`
    }
    
    if (timeRemaining.days <= 7) {
      return `Just ${timeRemaining.days} days until ${countdown.yourName} and ${countdown.partnerName}'s ${countdown.title}! Mark your calendar for ${formattedDate} at ${formattedTime}.`
    }
    
    if (timeRemaining.days <= 30) {
      return `${countdown.yourName} and ${countdown.partnerName} are counting down to their ${countdown.title} on ${formattedDate} at ${formattedTime}. ${timeRemaining.days} days to go!`
    }
    
    // Default message for longer countdowns
    return `${countdown.yourName} and ${countdown.partnerName} invite you to celebrate their ${countdown.title} on ${formattedDate} at ${formattedTime}. Save the date!`
  }

  // Handle share functionality with enhanced message
  const handleShare = async () => {
    if (!countdown) return

    const url = window.location.href
    const shareMessage = generateShareMessage()
    const shareTitle = `Countdown to ${countdown.title}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareMessage,
          url,
        })
      } catch (error) {
        console.error("Error sharing:", error)
        // Fallback to copy to clipboard
        copyToClipboard(url, shareMessage)
      }
    } else {
      // Fallback for browsers that don't support navigator.share
      copyToClipboard(url, shareMessage)
    }
  }

  const copyToClipboard = (url: string, message: string) => {
    const textToCopy = `${message}\n\n${url}`
    
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => alert("Invitation copied to clipboard!"))
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
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
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

              <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="lg">
                    <EnvelopeIcon className="mr-2 h-4 w-4" />
                    Send Invitation
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Send a Personal Invitation</DialogTitle>
                    <DialogDescription>
                      Invite someone special to join your countdown celebration.
                    </DialogDescription>
                  </DialogHeader>
                  <InvitationForm 
                    countdown={countdown} 
                    timeRemaining={timeRemaining}
                    onInvitationSent={() => setShowInviteDialog(false)}
                  />
                </DialogContent>
              </Dialog>

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
