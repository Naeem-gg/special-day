'use client'

import { useState } from 'react'
import { Star, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export function TestimonialForm({
  initialName = '',
  initialEmail = '',
  onSuccess,
}: {
  initialName?: string
  initialEmail?: string
  onSuccess?: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [rating, setRating] = useState(5)
  const [hover, setHover] = useState(0)
  const [formData, setFormData] = useState({
    name: initialName,
    email: initialEmail,
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, rating }),
      })

      if (res.ok) {
        toast.success('Thank you for your feedback! It will be visible once approved.')
        setFormData({ ...formData, message: '' })
        // Don't reset name/email if they are passed as props
        setRating(5)
        if (onSuccess) onSuccess()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to submit. Please try again.')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-1">Share Your Experience</h3>
        <p className="text-gray-500 text-sm">
          Your feedback helps us grow. <br />
          <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">
            Verified purchase required
          </span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center gap-2 mb-4">
          <p className="text-sm font-medium text-gray-700">How would you rate us?</p>
          <div className="flex gap-1 sm:gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="p-2 transition-all hover:scale-110 active:scale-90"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setRating(star)
                }}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                <Star
                  className={`w-10 h-10 sm:w-8 sm:h-8 transition-colors ${
                    star <= (hover || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-xs font-bold text-rose-500">
            {rating === 5
              ? 'Excellent!'
              : rating === 4
                ? 'Very Good'
                : rating === 3
                  ? 'Good'
                  : rating === 2
                    ? 'Fair'
                    : 'Poor'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Name</label>
            <Input
              required
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="rounded-xl border-gray-200 focus:ring-rose-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <Input
              required
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="rounded-xl border-gray-200 focus:ring-rose-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Message</label>
          <Textarea
            required
            rows={4}
            placeholder="Tell us what you loved..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="rounded-xl border-gray-200 focus:ring-rose-500 resize-none"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-all hover:shadow-lg hover:shadow-rose-200 disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              Submitting...{' '}
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Submit Feedback <Send className="w-4 h-4" />
            </span>
          )}
        </Button>
      </form>
    </div>
  )
}
