"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface DateTimePickerProps {
  date?: Date
  onSelect?: (date: Date | undefined) => void
}

export function DateTimePicker({ date, onSelect }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date)
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)
  const [isTimeOpen, setIsTimeOpen] = React.useState(false)

  React.useEffect(() => {
    if (date !== selectedDate) {
      setSelectedDate(date)
    }
  }, [date, selectedDate])

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      // Keep the time from the previously selected date if it exists
      if (selectedDate) {
        date.setHours(selectedDate.getHours())
        date.setMinutes(selectedDate.getMinutes())
      }
      setSelectedDate(date)
      if (onSelect) {
        onSelect(date)
      }
    }
  }

  const handleTimeChange = (type: "hour" | "minute", value: string) => {
    if (!selectedDate) return

    const newDate = new Date(selectedDate)

    if (type === "hour") {
      newDate.setHours(Number.parseInt(value))
    } else {
      newDate.setMinutes(Number.parseInt(value))
    }

    setSelectedDate(newDate)
    if (onSelect) {
      onSelect(newDate)
    }
  }

  // Generate hours and minutes for the select dropdowns
  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    const amPm = hour < 12 ? "AM" : "PM"
    return {
      value: hour.toString(),
      label: `${displayHour}:00 ${amPm}`,
    }
  })

  const minutes = Array.from({ length: 12 }, (_, i) => {
    const minute = i * 5
    return {
      value: minute.toString(),
      label: minute < 10 ? `0${minute}` : minute.toString(),
    }
  })

  return (
    <div className="flex flex-col space-y-2">
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              handleSelect(date)
              setIsCalendarOpen(false)
            }}
            initialFocus
            disabled={(date) => date < new Date()}
          />
        </PopoverContent>
      </Popover>

      <Popover open={isTimeOpen} onOpenChange={setIsTimeOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
          >
            <Clock className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, "h:mm a") : <span>Select time</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hour">Hour</Label>
                  <Select
                    value={selectedDate ? selectedDate.getHours().toString() : "12"}
                    onValueChange={(value) => handleTimeChange("hour", value)}
                  >
                    <SelectTrigger id="hour">
                      <SelectValue placeholder="Hour" />
                    </SelectTrigger>
                    <SelectContent>
                      {hours.map((hour) => (
                        <SelectItem key={hour.value} value={hour.value}>
                          {hour.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minute">Minute</Label>
                  <Select
                    value={selectedDate ? (Math.floor(selectedDate.getMinutes() / 5) * 5).toString() : "0"}
                    onValueChange={(value) => handleTimeChange("minute", value)}
                  >
                    <SelectTrigger id="minute">
                      <SelectValue placeholder="Minute" />
                    </SelectTrigger>
                    <SelectContent>
                      {minutes.map((minute) => (
                        <SelectItem key={minute.value} value={minute.value}>
                          {minute.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setIsTimeOpen(false)}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white"
            >
              Set Time
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
