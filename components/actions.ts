'use server'

import { db } from '@/drizzle/db'
import { anonymousCollection, feedbacks } from '@/drizzle/schema'
import { z } from 'zod'
import {nanoid} from "nanoid"
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  partnerName: z.string().min(2, { message: "Partner's name must be at least 2 characters." }),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Please enter a valid date.",
  }),
})

export type FormData = z.infer<typeof formSchema>

const feedbackFormSchema = z.object({
  name: z.string(),
  phone: z.string().min(10).max(12),
  message: z.string(),
})

export type FeedbackFormData = z.infer<typeof feedbackFormSchema>
export async function submitForm(data: FormData) {
  const result = formSchema.safeParse(data)
  if (!result.success) {
    console.log(result.error)
    return { success: false, errors: result.error.flatten().fieldErrors }
  }
  await db.insert(anonymousCollection).values([{
    date:data.date,name:data.name,partnerName:data.partnerName,id:nanoid(15)
  }])

  return { success: true, message: "Form submitted successfully!" }
}

export async function submitFeedbackForm(data: FeedbackFormData) {
  const result = feedbackFormSchema.safeParse(data)
  if (!result.success) {
    console.log(result.error)
    return { success: false, errors: result.error.flatten().fieldErrors }
  }
  await db.insert(feedbacks).values([{
    id:nanoid(15),name:data.name,message:data.message,phone:data.phone
  }])

  return { success: true, message: "Form submitted successfully!" }
}