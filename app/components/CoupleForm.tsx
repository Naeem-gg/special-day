'use client'

import { FormData, submitForm } from '@/components/actions'
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

export default function CoupleForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message?: string } | null>(null)
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>()
  const router = useRouter()

  useEffect(() => {
    if (localStorage.getItem('name') && localStorage.getItem('partnerName') && localStorage.getItem('date')) {
      router.push("/")
    }
  }, [router])

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true)
    setSubmitResult({ success: true, message: `Calculation in process...` })
    const result = await submitForm(data)
    if (result.success) {
      setIsSubmitting(false)
      localStorage.setItem('name', data.name)
      localStorage.setItem('partnerName', data.partnerName)
      localStorage.setItem('date', data.date)
      setSubmitResult({ success: true, message: `Redirecting...` })
      router.push("/confetti")
    }
    if (!result.success) {
      setIsSubmitting(false)
      setSubmitResult({ success: false, message: JSON.stringify(result.errors) })
    }
  }

  const date = watch('date')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-auto"
    >
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Your Big Day</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-lg">Your Name</Label>
          <Input
            id="name"
            {...register('name', { required: "Your name is required" })}
            className={`text-lg p-3 ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Enter your name"
          />
          {errors.name && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm"
            >
              {errors.name.message}
            </motion.p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="partnerName" className="text-lg">Partner&apos;s Name</Label>
          <Input
            id="partnerName"
            {...register('partnerName', { required: "Partner's name is required" })}
            className={`text-lg p-3 ${errors.partnerName ? 'border-red-500' : ''}`}
            placeholder="Enter partner's name"
          />
          {errors.partnerName && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm"
            >
              {errors.partnerName.message}
            </motion.p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date" className="text-lg">Special Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-full justify-start text-left font-normal text-lg p-3 ${
                  !date && "text-muted-foreground"
                }`}
              >
                <CalendarIcon className="mr-2 h-5 w-5" />
                {date ? format(new Date(date), "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date ? new Date(date) : undefined}
                onSelect={(date) => setValue('date', date?.toISOString() ?? '')}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.date && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm"
            >
              {errors.date.message}
            </motion.p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full text-lg py-3"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            'Start Countdown'
          )}
        </Button>
      </form>

      <AnimatePresence>
        {submitResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`mt-6 p-4 rounded-md text-center ${
              submitResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {submitResult.message}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

