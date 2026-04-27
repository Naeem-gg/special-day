'use client'

import { useEffect, useState } from 'react'
import { Star, CheckCircle, XCircle, Trash2, Globe, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '../ui/card'

export function TestimonialManager({ initialTestimonials }: { initialTestimonials?: any[] }) {
  const [testimonials, setTestimonials] = useState<any[]>(initialTestimonials || [])
  const [loading, setLoading] = useState(!initialTestimonials)

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/admin/testimonials')
      const data = await res.json()
      if (Array.isArray(data)) setTestimonials(data)
    } catch (error) {
      toast.error('Failed to fetch testimonials')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialTestimonials) {
      setLoading(false)
      return
    }
    fetchTestimonials()
  }, [initialTestimonials])

  const handleTogglePublic = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !currentStatus }),
      })

      if (res.ok) {
        toast.success(`Testimonial is now ${!currentStatus ? 'public' : 'private'}`)
        // Optimistic update
        setTestimonials((prev) =>
          prev.map((t) => (t.id === id ? { ...t, isPublic: !currentStatus } : t))
        )
      } else {
        toast.error('Update failed')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success('Testimonial deleted')
        setTestimonials((prev) => prev.filter((t) => t.id !== id))
      } else {
        toast.error('Delete failed')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  if (loading && !initialTestimonials)
    return <div className="p-8 text-center">Loading testimonials...</div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Manage Testimonials</h2>
          <p className="text-sm text-gray-500">Approve or reject customer feedback.</p>
        </div>
        <div className="text-sm text-muted-foreground">{testimonials.length} Submissions</div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-xl border border-dashed border-gray-300 text-gray-500">
            No testimonials yet.
          </div>
        ) : (
          testimonials.map((t) => (
            <Card key={t.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className={`h-1 w-full ${t.isPublic ? 'bg-green-500' : 'bg-gray-300'}`} />
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <div className="font-bold text-gray-900 line-clamp-1">{t.name}</div>
                    <div className="text-[10px] text-gray-500">{t.email}</div>
                  </div>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-sm text-gray-600 line-clamp-3 min-h-[3rem] italic">
                  "{t.message}"
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-gray-50">
                  <span className="text-[10px] text-gray-400">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </span>
                  <Button
                    size="sm"
                    variant={t.isPublic ? 'outline' : 'default'}
                    onClick={() => handleTogglePublic(t.id, t.isPublic)}
                    className={`h-7 text-xs ${t.isPublic ? 'border-amber-200 text-amber-600 hover:bg-amber-50' : 'bg-green-600 hover:bg-green-700'}`}
                  >
                    {t.isPublic ? (
                      <>
                        <Lock className="w-3 h-3 mr-1" /> Make Private
                      </>
                    ) : (
                      <>
                        <Globe className="w-3 h-3 mr-1" /> Publish Now
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
