"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatDate } from "@/lib/utils"
import { CheckCircle } from "lucide-react"
import type React from "react"
import { useState } from "react"

interface InvitationFormProps {
  countdown: {
    id: string
    title: string
    yourName: string
    partnerName: string
    eventDate: Date
    message: string
  }
  timeRemaining: {
    days: number
    hours: number
    minutes: number
    seconds: number
    isComplete: boolean
  }
  onInvitationSent: () => void
}

export function InvitationForm({ countdown, timeRemaining, onInvitationSent }: InvitationFormProps) {
  const [inviteeName, setInviteeName] = useState("")
  const [customMessage, setCustomMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showShareDialog, setShowShareDialog] = useState(false)

  const generateInvitationMessage = () => {
    const formattedDate = formatDate(countdown.eventDate)
    const formattedTime = countdown.eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    const greeting = inviteeName ? `Dear ${inviteeName},` : "Hello,"
    const baseMessage = `
${greeting}
${countdown.yourName} and ${countdown.partnerName} would like to invite you to their ${countdown.title} on ${formattedDate} at ${formattedTime}.
${timeRemaining.days > 0 ? `Only ${timeRemaining.days} days remaining until this special occasion!` : "The big day is today!"}
${customMessage ? `\n${customMessage}\n` : ""}
We hope you can join us in celebrating this momentous occasion.
Warmest regards,
${countdown.yourName} & ${countdown.partnerName}
    `.trim()
    return baseMessage
  }

  const handleShare = async () => {
    const message = generateInvitationMessage()
    const url = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Invitation to ${countdown.title}`,
          text: message,
          url: url,
        })
        setIsSuccess(true)
        setTimeout(() => {
          onInvitationSent()
        }, 2000)
      } catch (error) {
        console.error("Error sharing:", error)
        setError("Failed to share invitation. Please try again.")
      }
    } else {
      setShowShareDialog(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      await handleShare()
    } catch (error) {
      console.error("Error sending invitation:", error)
      setError("Failed to send invitation. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <h3 className="text-xl font-medium text-center">Invitation Sent!</h3>
        <p className="text-center text-gray-500 dark:text-gray-400">
          Your invitation has been successfully shared.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="inviteeName">Invitee&apos;s Name</Label>
        <Input
          id="inviteeName"
          placeholder="Enter the name of the person you're inviting"
          value={inviteeName}
          onChange={(e) => setInviteeName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="customMessage">Add a Personal Message (Optional)</Label>
        <Textarea
          id="customMessage"
          placeholder="Add a personal note to your invitation"
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          rows={3}
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="pt-4 flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onInvitationSent}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white"
        >
          {isLoading ? "Sending..." : "Send Invitation"}
        </Button>
      </div>
      {showShareDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-medium mb-4">Share Invitation</h3>
            <div className="space-y-2">
              <Button
                onClick={() => {
                  const message = generateInvitationMessage()
                  const url = window.location.href
                  const whatsappLink = `https://wa.me/?text=${encodeURIComponent(message + "\n\nView the countdown: " + url)}`
                  window.open(whatsappLink)
                  setShowShareDialog(false)
                }}
                className="w-full"
              >
                Share via WhatsApp
              </Button>
              <Button
                onClick={() => {
                  const message = generateInvitationMessage()
                  const url = window.location.href
                  const instagramLink = `https://www.instagram.com/?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message)}`
                  window.open(instagramLink)
                  setShowShareDialog(false)
                }}
                className="w-full"
              >
                Share via Instagram
              </Button>
              <Button
                onClick={() => {
                  const message = generateInvitationMessage()
                  const url = window.location.href
                  const facebookLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`
                  window.open(facebookLink)
                  setShowShareDialog(false)
                }}
                className="w-full"
              >
                Share via Facebook
              </Button>
              <Button
                onClick={() => {
                  const message = generateInvitationMessage()
                  const url = window.location.href
                  const twitterLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message)}`
                  window.open(twitterLink)
                  setShowShareDialog(false)
                }}
                className="w-full"
              >
                Share via Twitter
              </Button>
              <Button
                onClick={() => {
                  const message = generateInvitationMessage()
                  const url = window.location.href
                  const copyLink = `${message}\n\nView the countdown: ${url}`
                  navigator.clipboard.writeText(copyLink)
                  alert("Invitation copied to clipboard!")
                  setShowShareDialog(false)
                }}
                className="w-full"
              >
                Copy Link
              </Button>
            </div>
            <Button
              onClick={() => setShowShareDialog(false)}
              className="mt-4 w-full"
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </form>
  )
}