'use client'

import { Star, CheckCircle } from 'lucide-react'

interface TestimonialCardProps {
  testimonial: {
    id: number
    name: string
    message: string
    rating: number
    createdAt: string
  }
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
            }`}
          />
        ))}
      </div>
      <p className="text-gray-600 italic flex-grow">"{testimonial.message}"</p>
      <div className="flex items-center gap-3 mt-2">
        <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold uppercase shrink-0">
          {testimonial.name.charAt(0)}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
            <div className="flex items-center gap-0.5 bg-green-50 text-green-700 text-[10px] px-1.5 py-0.5 rounded-full border border-green-100 font-bold uppercase tracking-tight">
              <CheckCircle className="w-2.5 h-2.5" /> Verified
            </div>
          </div>
          <p className="text-xs text-gray-400">
            {new Date(testimonial.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}
