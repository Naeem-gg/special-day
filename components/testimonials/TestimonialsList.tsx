'use client'

import { useEffect, useState } from 'react'
import { TestimonialCard } from './TestimonialCard'
import { Quote } from 'lucide-react'

export function TestimonialsList({ initialTestimonials }: { initialTestimonials?: any[] }) {
  const [testimonials, setTestimonials] = useState<any[]>(initialTestimonials || [])
  const [loading, setLoading] = useState(!initialTestimonials)

  useEffect(() => {
    if (initialTestimonials) return
    fetch('/api/testimonials')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTestimonials(data)
      })
      .finally(() => setLoading(false))
  }, [initialTestimonials])

  if (loading && !initialTestimonials) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-rose-100 border-t-rose-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (testimonials.length === 0) return null

  return (
    <section className="py-24 bg-gradient-to-b from-white to-rose-50/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Decorative Elements */}
        <Quote className="absolute -top-10 -left-10 w-40 h-40 text-rose-100 opacity-50 -z-10" />

        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Loved by Couples <span className="text-rose-600">Worldwide</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See what our happy customers have to say about their experience with DNvites.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  )
}
