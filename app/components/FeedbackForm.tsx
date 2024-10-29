'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SubmitHandler, useForm } from 'react-hook-form'
import { FeedbackFormData, submitFeedbackForm } from '@/components/actions'

export default function FeedbackForm() {
  const [isOpen, setIsOpen] = useState(false)
//   const [name, setName] = useState('')
//   const [phone, setPhone] = useState('')
//   const [message, setMessage] = useState('')

  const {register,handleSubmit} = useForm<FeedbackFormData>({})
  const handleFeedback:SubmitHandler<FeedbackFormData> = async(data) => {
   
    console.log('Feedback submitted:',data)
    await submitFeedbackForm(data)
    setIsOpen(false)
    // Reset form fields
    // setName('')
    // setPhone('')
    // setMessage('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Feedback</Button>
      </DialogTrigger>
      <DialogContent className="w-[80%]">
        <DialogHeader>
          <DialogTitle>{"Send us your feedback"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFeedback)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
            //   value={name}
            //   onChange={(e) => setName(e.target.value)}
            {...register("name")}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              {...register("phone")}
            //   value={phone}
            //   onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              {...register("message")}
            //   value={message}
            //   onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your feedback"
              required
            />
          </div>
          <Button type="submit" className="w-full">Submit Feedback</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}