'use server'

import { db } from '@/drizzle/db'
import { anonymousCollection } from '@/drizzle/schema'
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

export async function submitForm(data: FormData) {
  const result = formSchema.safeParse(data)
  
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors }
  }

  // Here you would typically save the data to a database
  await db.insert(anonymousCollection).values([{
    date:data.date,name:data.name,partnerName:data.partnerName,id:nanoid(15)
  }])

  // Simulate a delay to show loading state
  // await new Promise(resolve => setTimeout(resolve, 1000))

  return { success: true, message: "Form submitted successfully!" }
}