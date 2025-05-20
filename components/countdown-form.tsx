"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { UserPlusIcon, GlobeIcon } from "lucide-react"
import { mockCreateCountdown } from "@/lib/api-mock"
import { DateTimePicker } from "./date-picker"

export function CountdownForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [accountType, setAccountType] = useState("anonymous")
  const [activeTab, setActiveTab] = useState("countdown")
  const [displayText, setDisplayText] = useState(false)
  const [formData, setFormData] = useState({
    yourName: "",
    partnerName: "",
    eventDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days from now
    eventTitle: "Our Wedding Day",
    message: "Can't wait to spend forever with you!",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateTimeChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, eventDate: date }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Mock API call
      const countdownId = await mockCreateCountdown(formData, accountType)
      // Create URL with search params for sharing
      const params = new URLSearchParams()
      params.set("id", countdownId)
      params.set("title", formData.eventTitle)
      params.set("your", formData.yourName)
      params.set("partner", formData.partnerName)
      params.set("date", formData.eventDate.toISOString())
      params.set("message", formData.message)
      // Redirect to countdown page
      router.push(`/countdown?${params.toString()}`)
    } catch (error) {
      console.error("Error creating countdown:", error)
      setIsLoading(false)
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="countdown">Countdown Details</TabsTrigger>
        <TabsTrigger value="account">Account Options</TabsTrigger>
      </TabsList>
      <form onSubmit={handleSubmit}>
        <TabsContent value="countdown">
          <Card>
            <CardHeader>
              <CardTitle>Your Big Day Details</CardTitle>
              <CardDescription>
                Tell us about your special day so we can create a personalized countdown
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="yourName">Your Name</Label>
                  <Input
                    id="yourName"
                    name="yourName"
                    placeholder="Enter your name"
                    value={formData.yourName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partnerName">Partner&apos;s Name</Label>
                  <Input
                    id="partnerName"
                    name="partnerName"
                    placeholder="Enter your partner's name"
                    value={formData.partnerName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventTitle">Event Title</Label>
                <Input
                  id="eventTitle"
                  name="eventTitle"
                  placeholder="e.g., Our Wedding Day"
                  value={formData.eventTitle}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Event Date & Time</Label>
                <DateTimePicker date={formData.eventDate} onSelect={handleDateTimeChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Personal Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Add a personal message to display on your countdown"
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href="/">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button type="button" onClick={() => setActiveTab("account")}>
                Next
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Options</CardTitle>
              <CardDescription>Choose how you want to save your countdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    accountType === "account"
                      ? "border-pink-500 select-none bg-gray-50 dark:bg-slate-800 rounded-lg"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                  onTouchStart={() => setDisplayText(true)}
                  onTouchEnd={() => setDisplayText(false)}
                  onMouseEnter={() => setDisplayText(true)}
                  onMouseLeave={() => setDisplayText(false)}
                >
                  <div className={"flex flex-col items-center text-center space-y-2 p-4"}>
                    {displayText && (
                      <p className="text-sm text-gray-500 absolute bg-white dark:bg-slate-700 p-2 rounded shadow-md">
                        Coming Soon...
                      </p>
                    )}
                    <UserPlusIcon className="h-10 w-10 text-pink-500" />
                    <h3 className="font-medium text-lg">Create Account</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Save your countdown and access it from any device
                    </p>
                    <div className="text-xs text-pink-600 dark:text-pink-400 font-medium">
                      ✓ Never lose your countdown
                      <br />✓ Create multiple countdowns
                      <br />✓ Access from any device
                    </div>
                  </div>
                </div>
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    accountType === "anonymous"
                      ? "border-pink-500 bg-pink-50 dark:bg-pink-950"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                  onClick={() => setAccountType("anonymous")}
                >
                  <div className="flex flex-col items-center text-center space-y-2 p-4">
                    <GlobeIcon className="h-10 w-10 text-pink-500" />
                    <h3 className="font-medium text-lg">Continue as Guest</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Quick and easy, but limited to this device only
                    </p>
                    <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                      ⚠️ Countdown saved on this device only
                      <br />
                      ⚠️ Cannot be recovered if lost
                      <br />✓ Shareable link available
                    </div>
                  </div>
                </div>
              </div>
              {accountType === "account" && (
                <div className="space-y-4 border border-pink-200 dark:border-pink-900 rounded-lg p-4 bg-pink-50 dark:bg-pink-950/30">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="Create a password" />
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Already have an account?{" "}
                    <Link href="#" className="text-pink-600 dark:text-pink-400 hover:underline">
                      Log in
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setActiveTab("countdown")}>
                Back
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Countdown"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </form>
    </Tabs>
  )
}
