"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

interface CountdownTimerProps {
  targetDate: Date
  onTimeUpdate?: (timeRemaining: {
    days: number
    hours: number
    minutes: number
    seconds: number
    isComplete: boolean
  }) => void
}

export function CountdownTimer({ targetDate, onTimeUpdate }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false,
  })

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      if (difference <= 0) {
        // Countdown is complete
        const newTimeRemaining = {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isComplete: true,
        }
        setTimeRemaining(newTimeRemaining)
        if (onTimeUpdate) onTimeUpdate(newTimeRemaining)
        return
      }

      // Calculate time units
      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      const newTimeRemaining = {
        days,
        hours,
        minutes,
        seconds,
        isComplete: false,
      }

      setTimeRemaining(newTimeRemaining)
      if (onTimeUpdate) onTimeUpdate(newTimeRemaining)
    }

    // Calculate immediately
    calculateTimeRemaining()

    // Update every second
    const interval = setInterval(calculateTimeRemaining, 1000)

    return () => clearInterval(interval)
  }, [targetDate, onTimeUpdate])

  const timeUnits = [
    { label: "Days", value: timeRemaining.days },
    { label: "Hours", value: timeRemaining.hours },
    { label: "Minutes", value: timeRemaining.minutes },
    { label: "Seconds", value: timeRemaining.seconds },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {timeUnits.map((unit) => (
        <Card
          key={unit.label}
          className="p-4 text-center bg-white dark:bg-slate-800 border-pink-100 dark:border-pink-900"
        >
          <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent animate-pulse">
            {unit.value}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{unit.label}</div>
        </Card>
      ))}
    </div>
  )
}
