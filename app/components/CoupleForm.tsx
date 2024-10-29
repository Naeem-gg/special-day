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
import { CalendarIcon, Loader2 } from "lucide-react"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

export default function CoupleForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message?: string } | null>(null)
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    // resolver: zodResolver(),
  })
  const router = useRouter()

  useEffect(()=>{
    if(localStorage.getItem('name') && localStorage.getItem('partnerName') && localStorage.getItem('date')) {
      router.push("/confetti")
    }
  },[router])
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true)
    setSubmitResult({success: true,message:`Calculation in process...`})
    const result = await submitForm(data)
    if(result.success) {
      setIsSubmitting(false)
      localStorage.setItem('name', data.name)
      localStorage.setItem('partnerName', data.partnerName)
      localStorage.setItem('date', data.date)
      setSubmitResult({success: true,message:`Redirecting...`})
      router.push("/confetti")

    }
    if(!result.success){
      setIsSubmitting(false)
      setSubmitResult({success:false,message:JSON.stringify(result.errors)})
    }
  }

  const date = watch('date')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-xl w-96"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">BIG DAY</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              {...register('name')}
              className={errors.name ? 'border-red-500' : ''}
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
            <Label htmlFor="partnerName">Partner&apos;s Name</Label>
            <Input
              id="partnerName"
              {...register('partnerName')}
              className={errors.partnerName ? 'border-red-500' : ''}
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
            <Label htmlFor="date">Special Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-full justify-start text-left font-normal ${
                    !date && "text-muted-foreground"
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
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
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit'
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
              className={`mt-4 p-3 rounded-md ${
                submitResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {submitResult.message}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}