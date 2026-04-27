'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CheckCircle2 } from 'lucide-react'

interface RSVPModalProps {
  invitationId: number
  inline?: boolean
}

export default function RSVPModal({ invitationId, inline = false }: RSVPModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    guests: '1',
    attending: 'yes',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invitationId,
          name: formData.name,
          guests: parseInt(formData.guests),
          attending: formData.attending === 'yes',
        }),
      })

      if (response.ok) {
        setIsSuccess(true)
        setTimeout(() => {
          setIsOpen(false)
          setIsSuccess(false)
          setFormData({ name: '', guests: '1', attending: 'yes' })
        }, 3000)
      }
    } catch (error) {
      console.error('RSVP Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div
          className={`${inline ? 'absolute' : 'fixed'} bottom-6 right-6 md:bottom-10 md:right-10 z-50`}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-900 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-medium tracking-widest uppercase text-[10px] md:text-xs shadow-2xl hover:bg-gray-800 transition-colors"
          >
            RSVP Now
          </motion.button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#faf9f6] border-none rounded-3xl">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="form"
            >
              <DialogHeader>
                <DialogTitle className="text-3xl font-serif text-center mb-4">
                  You&apos;re Invited
                </DialogTitle>
                <p className="text-center text-gray-500 text-sm font-light mb-8">
                  Please let us know if you can join our celebration.
                </p>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs uppercase tracking-widest text-gray-400">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Your Name"
                    required
                    className="bg-white border-gray-100 focus:ring-gray-200"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest text-gray-400">
                      Attending?
                    </Label>
                    <Select
                      defaultValue="yes"
                      onValueChange={(val) => setFormData({ ...formData, attending: val })}
                    >
                      <SelectTrigger className="bg-white border-gray-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes, I&apos;ll be there</SelectItem>
                        <SelectItem value="no">Sorry, I can&apos;t</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest text-gray-400">
                      Guests
                    </Label>
                    <Select
                      defaultValue="1"
                      onValueChange={(val) => setFormData({ ...formData, guests: val })}
                    >
                      <SelectTrigger className="bg-white border-gray-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <SelectItem key={n} value={n.toString()}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-6 rounded-xl transition-all"
                >
                  {isSubmitting ? 'Sending...' : 'Confirm Attendance'}
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              key="success"
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <CheckCircle2 className="w-16 h-16 text-green-500 mb-6" />
              <h3 className="text-2xl font-serif text-gray-900 mb-2">Thank You!</h3>
              <p className="text-gray-500 font-light">We&apos;ve received your RSVP.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
