'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  X,
  Plus,
  Trash2,
  Calendar,
  Lock,
  Info,
  Sparkles,
  AlertCircle,
  Heart,
  Eye,
  Music,
  Upload,
  CheckCircle2,
  Clock,
  Loader2,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react'
import { STYLES, StyleEvent, StylePhoto } from '@/components/templates/types'
import CloudinaryUpload from '@/components/dashboard/CloudinaryUpload'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'
import { detectCurrency, Currency } from '@/lib/currency'

interface EditInvitationModalProps {
  isOpen: boolean
  onClose: () => void
  invitation: any
  onSaveSuccess: () => void
  isAdmin?: boolean
}

// Dynamically load Razorpay SDK
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

const TIER_BADGE_STYLE: Record<string, string> = {
  basic: 'bg-rose-50 text-rose-600 border-rose-100',
  standard: 'bg-blue-50 text-blue-600 border-blue-100',
  premium: 'bg-amber-50 text-amber-600 border-amber-100',
}

export function EditInvitationModal({
  isOpen,
  onClose,
  invitation,
  onSaveSuccess,
  isAdmin = false,
}: EditInvitationModalProps) {
  const [step, setStep] = useState<'details' | 'template'>('details')
  const [isSaving, setIsSaving] = useState(false)
  const [tiers, setTiers] = useState<any[]>([])
  const [currency, setCurrency] = useState<Currency>('INR')

  useEffect(() => {
    detectCurrency().then(setCurrency)
  }, [])

  // Form Details States
  const [formData, setFormData] = useState({
    brideName: '',
    groomName: '',
    date: '',
    venue: '',
    musicUrl: '',
    ourStory: '',
    mapUrl: '',
    events: [] as StyleEvent[],
    gallery: [] as StylePhoto[],
    template: '',
    tier: '',
    rsvpButtonText: '',
  })

  // Audio Upload States
  const [isUploadingMusic, setIsUploadingMusic] = useState(false)
  const [uploadedMusicName, setUploadedMusicName] = useState('')

  // Check 48h limit for users
  const isPast48Hours = (() => {
    if (!invitation) return false
    if (invitation.editWindowOverride) return false
    const createdDate = new Date(invitation.createdAt)
    const now = new Date()
    const diffInHours = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60)
    return diffInHours > 48
  })()

  // Fetch Tier Pricing on mount
  useEffect(() => {
    fetch('/api/tiers')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTiers(data)
        }
      })
      .catch((err) => console.error('Failed to fetch tiers:', err))
  }, [])

  // Initialize fields on open
  useEffect(() => {
    if (invitation && isOpen) {
      setStep('details')
      setFormData({
        brideName: invitation.brideName || '',
        groomName: invitation.groomName || '',
        date: invitation.date ? (() => {
          const d = new Date(invitation.date)
          const tzOffset = d.getTimezoneOffset() * 60000
          return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16)
        })() : '',
        venue: invitation.venue || '',
        musicUrl: invitation.musicUrl || '',
        ourStory: invitation.ourStory || '',
        mapUrl: invitation.mapUrl || '',
        events: invitation.events || [],
        gallery: invitation.gallery || [],
        template: invitation.template || 'rose-gold',
        tier: invitation.tier || 'basic',
        rsvpButtonText: invitation.rsvpButtonText || 'RSVP Now',
      })
      setUploadedMusicName('')
    }
  }, [invitation, isOpen])

  if (!invitation) return null

  // Calculate prices
  const currentPaid = invitation.paidAmount || 0
  const selectedTemplateDetails = STYLES.find((s) => s.slug === formData.template)
  const selectedTemplateTier = selectedTemplateDetails?.tier || 'basic'

  const TIER_ORDER: Record<string, number> = {
    basic: 1,
    standard: 2,
    premium: 3,
  }

  const currentTierOrder = TIER_ORDER[invitation.tier] || 1
  const selectedTierOrder = TIER_ORDER[selectedTemplateTier] || 1

  const getTierPrice = (tierSlug: string) => {
    const tier = tiers.find((t) => t.slug.toLowerCase() === tierSlug.toLowerCase())
    return tier ? tier.price : 0
  }

  const selectedTierPrice = getTierPrice(selectedTemplateTier)
  const upgradeCost = selectedTierOrder > currentTierOrder ? Math.max(0, selectedTierPrice - currentPaid) : 0
  const isUpgrading = selectedTierOrder > currentTierOrder && upgradeCost > 0

  // Standard Details Submission (PATCH)
  const handleSaveDetailsOnly = async (updatedFields: any = formData) => {
    setIsSaving(true)
    try {
      const res = await fetch(`/api/invitations/${invitation.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Invitation updated successfully!')
        onSaveSuccess()
        onClose()
      } else {
        toast.error(data.error || 'Failed to update invitation')
      }
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  // Handle template selection saving / checkout
  const handleSaveTemplateChange = async () => {
    if (isAdmin) {
      // Admin saves instantly, bypassing checkout
      await handleSaveDetailsOnly({
        ...formData,
        tier: selectedTemplateTier,
      })
      return
    }

    if (!isUpgrading) {
      // Same tier or downgrade (free template update)
      await handleSaveDetailsOnly({
        ...formData,
        tier: selectedTemplateTier,
      })
      return
    }

    // Upgrading: Process payment of difference
    setIsSaving(true)
    try {
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway. Please check your internet connection.')
        setIsSaving(false)
        return
      }

      // 1. Create upgrade order
      const orderRes = await fetch('/api/payments/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tierSlug: selectedTemplateTier,
          invitationSlug: invitation.slug,
          currency,
        }),
      })

      const orderData = await orderRes.json()
      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to prepare upgrade payment')
      }

      // If it ends up being free (e.g. promo or coupon covers it)
      if (orderData.isFree || orderData.amount === 0) {
        const verifyRes = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bypassPayment: true,
            invitationData: {
              ...formData,
              tier: selectedTemplateTier,
              isUpgrade: true,
              slug: invitation.slug,
              paidAmount: 0,
              currency,
            },
          }),
        })

        if (verifyRes.ok) {
          toast.success('Invitation upgraded successfully!')
          confetti({
            particleCount: 100,
            spread: 60,
            colors: ['#F43F8F', '#D4AF37'],
          })
          onSaveSuccess()
          onClose()
        } else {
          const verifyData = await verifyRes.json()
          toast.error(verifyData.error || 'Failed to verify upgrade.')
        }
        setIsSaving(false)
        return
      }

      // 2. Open Razorpay checkout for the difference
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'DNvites Upgrade',
        description: `Upgrade to ${selectedTemplateTier.toUpperCase()} Plan`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          setIsSaving(true)
          try {
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                invitationData: {
                  ...formData,
                  tier: selectedTemplateTier,
                  isUpgrade: true,
                  slug: invitation.slug,
                  paidAmount: upgradeCost,
                  currency,
                },
              }),
            })

            if (verifyRes.ok) {
              toast.success('Invitation upgraded successfully! 🎉')
              confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#F43F8F', '#D4AF37', '#FFFFFF'],
              })
              onSaveSuccess()
              onClose()
            } else {
              const verifyData = await verifyRes.json()
              toast.error(verifyData.error || 'Payment verification failed.')
            }
          } catch (err) {
            console.error(err)
            toast.error('An error occurred during verification.')
          } finally {
            setIsSaving(false)
          }
        },
        prefill: {
          name: formData.brideName + ' & ' + formData.groomName,
          email: invitation.userEmail || '',
        },
        theme: {
          color: '#F43F8F',
        },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.on('payment.failed', function (response: any) {
        toast.error(`Payment failed: ${response.error.description}`)
        setIsSaving(false)
      })
      rzp.open()
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'An error occurred during upgrade checkout.')
      setIsSaving(false)
    }
  }

  // Audio Upload Logic
  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size too large! Please upload a song smaller than 10MB.')
      return
    }

    setIsUploadingMusic(true)
    try {
      const data = new FormData()
      data.append('file', file)
      data.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
        { method: 'POST', body: data }
      )
      const result = await res.json()
      if (result.secure_url) {
        setFormData({ ...formData, musicUrl: result.secure_url })
        setUploadedMusicName(file.name)
        toast.success('Music uploaded successfully!')
      } else {
        toast.error('Failed to upload music.')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error uploading music.')
    } finally {
      setIsUploadingMusic(false)
    }
  }

  // Event Schedule helpers
  const handleAddEvent = () => {
    setFormData({
      ...formData,
      events: [
        ...formData.events,
        { name: '', time: '', location: '', date: '', googleMapsUrl: '', description: '' },
      ],
    })
  }

  const handleRemoveEvent = (index: number) => {
    setFormData({
      ...formData,
      events: formData.events.filter((_, i) => i !== index),
    })
  }

  const updateEvent = (index: number, field: string, value: string) => {
    const newEvents = [...formData.events]
    newEvents[index] = { ...newEvents[index], [field]: value }
    setFormData({ ...formData, events: newEvents })
  }

  // Gallery limits based on selected template tier
  const maxGalleryImages = selectedTemplateTier === 'premium' ? 10 : selectedTemplateTier === 'standard' ? 5 : 1

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="md:max-w-3xl w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto rounded-3xl p-4 sm:p-6 shadow-2xl border-rose-100">
        <DialogHeader className="pb-4 border-b border-rose-100/50">
          <DialogTitle className="text-2xl font-serif text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#F43F8F]" />
            {isAdmin ? 'Admin Edit Invitation' : 'Edit Your Invitation'}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            {step === 'details'
              ? 'Update the wedding details, events schedule, and photo album.'
              : 'Choose a style theme. Changing template tier might require payment difference.'}
          </DialogDescription>
        </DialogHeader>

        {/* Warning about 48h limit if standard details change and past 48h */}
        {!isAdmin && isPast48Hours && step === 'details' && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800 flex gap-2 items-start mt-2">
            <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Editing Window Closed (48h passed)</span>
              <p className="mt-1 text-[11px] leading-normal opacity-90">
                You cannot edit the invitation details anymore. You can still navigate to the next step and upgrade to a higher tier template by paying the difference.
              </p>
            </div>
          </div>
        )}

        {step === 'details' ? (
          /* STEP 1: EDIT DETAILS FORM */
          <div className="space-y-6 py-4">
            {/* Love Story Names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="brideName">Partner 1 Name 👰</Label>
                <Input
                  id="brideName"
                  value={formData.brideName}
                  onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
                  disabled={!isAdmin && isPast48Hours}
                  className="rounded-xl border-rose-200 focus:border-[#F43F8F] focus:ring-[#F43F8F]/10"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="groomName">Partner 2 Name 🤵</Label>
                <Input
                  id="groomName"
                  value={formData.groomName}
                  onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
                  disabled={!isAdmin && isPast48Hours}
                  className="rounded-xl border-rose-200 focus:border-[#F43F8F] focus:ring-[#F43F8F]/10"
                />
              </div>
            </div>

            {/* Date & Venue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="date">Wedding Date & Time 📅</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  disabled={!isAdmin && isPast48Hours}
                  className="rounded-xl border-rose-200 focus:border-[#F43F8F]"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="venue">Venue Details 📍</Label>
                <Input
                  id="venue"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  disabled={!isAdmin && isPast48Hours}
                  className="rounded-xl border-rose-200 focus:border-[#F43F8F]"
                />
              </div>
            </div>

            {/* Map link and Our Story */}
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="mapUrl">Google Maps Link 🗺️ (Optional)</Label>
                <Input
                  id="mapUrl"
                  placeholder="https://maps.google.com/..."
                  value={formData.mapUrl}
                  onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
                  disabled={!isAdmin && isPast48Hours}
                  className="rounded-xl border-rose-200 focus:border-[#F43F8F]"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="ourStory">Our Love Story ❤️ (Optional)</Label>
                <Textarea
                  id="ourStory"
                  placeholder="Share a short story about how you met..."
                  value={formData.ourStory}
                  onChange={(e) => setFormData({ ...formData, ourStory: e.target.value })}
                  disabled={!isAdmin && isPast48Hours}
                  className="rounded-xl border-rose-200 focus:border-[#F43F8F] min-h-[80px]"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="rsvpButtonText">RSVP Button Text 🏷️ (Optional)</Label>
                <Input
                  id="rsvpButtonText"
                  placeholder="e.g. RSVP Now, Will You Attend?"
                  value={formData.rsvpButtonText}
                  onChange={(e) => setFormData({ ...formData, rsvpButtonText: e.target.value })}
                  disabled={!isAdmin && isPast48Hours}
                  className="rounded-xl border-rose-200 focus:border-[#F43F8F]"
                />
              </div>
            </div>

            {/* Background Music */}
            <div className="space-y-2">
              <Label>Background Music 🎵 (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Paste direct audio URL or upload file"
                  value={uploadedMusicName ? `File Uploaded: ${uploadedMusicName}` : formData.musicUrl}
                  onChange={(e) => setFormData({ ...formData, musicUrl: e.target.value })}
                  disabled={(!isAdmin && isPast48Hours) || !!uploadedMusicName}
                  className="rounded-xl border-rose-200 focus:border-[#F43F8F] flex-1 min-w-0"
                />
                {!isPast48Hours || isAdmin ? (
                  <label className="shrink-0">
                    <div className="h-10 px-4 rounded-xl border border-dashed border-rose-300 bg-rose-50/30 hover:bg-rose-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer">
                      {isUploadingMusic ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F43F8F]" />
                      ) : (
                        <Upload className="w-3.5 h-3.5 text-[#F43F8F]" />
                      )}
                      Upload MP3
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="audio/*"
                      disabled={isUploadingMusic}
                      onChange={handleAudioUpload}
                    />
                  </label>
                ) : null}
              </div>
            </div>

            {/* Events schedule */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-bold text-slate-700">Wedding Events Schedule 🗓️</Label>
                {(!isPast48Hours || isAdmin) && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddEvent}
                    className="h-8 rounded-xl border-rose-200 text-[#F43F8F] hover:bg-rose-50"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Event
                  </Button>
                )}
              </div>

              {formData.events.length === 0 ? (
                <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400">
                  No events added. Add custom events like Ceremony, Dinner, or Reception.
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.events.map((event, index) => (
                    <div
                      key={index}
                      className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl relative"
                    >
                      {(!isPast48Hours || isAdmin) && (
                        <button
                          type="button"
                          onClick={() => handleRemoveEvent(index)}
                          className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <p className="text-xs font-bold text-[#F43F8F] uppercase tracking-wider mb-2">
                        Event {index + 1}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold text-slate-500">Event Name</Label>
                          <Input
                            placeholder="e.g. Wedding Reception"
                            value={event.name}
                            onChange={(e) => updateEvent(index, 'name', e.target.value)}
                            disabled={!isAdmin && isPast48Hours}
                            className="h-10 rounded-xl border-rose-100 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold text-slate-500">Time</Label>
                          <Input
                            placeholder="e.g. 7:00 PM"
                            value={event.time}
                            onChange={(e) => updateEvent(index, 'time', e.target.value)}
                            disabled={!isAdmin && isPast48Hours}
                            className="h-10 rounded-xl border-rose-100 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold text-slate-500">Date (Optional) 📅</Label>
                          <Input
                            type="date"
                            value={event.date || ''}
                            onChange={(e) => updateEvent(index, 'date', e.target.value)}
                            disabled={!isAdmin && isPast48Hours}
                            className="h-10 rounded-xl border-rose-100 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold text-slate-500">Venue Location</Label>
                          <Input
                            placeholder="e.g. Grand Hall, Room A"
                            value={event.location}
                            onChange={(e) => updateEvent(index, 'location', e.target.value)}
                            disabled={!isAdmin && isPast48Hours}
                            className="h-10 rounded-xl border-rose-100 text-sm"
                          />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <Label className="text-xs font-semibold text-slate-500">Google Maps Link (Optional)</Label>
                          <Input
                            placeholder="https://maps.google.com/..."
                            value={event.googleMapsUrl || ''}
                            onChange={(e) => updateEvent(index, 'googleMapsUrl', e.target.value)}
                            disabled={!isAdmin && isPast48Hours}
                            className="h-10 rounded-xl border-rose-100 text-sm"
                          />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <Label className="text-xs font-semibold text-slate-500">Description (Optional)</Label>
                          <Input
                            placeholder="Brief description of the event details..."
                            value={event.description || ''}
                            onChange={(e) => updateEvent(index, 'description', e.target.value)}
                            disabled={!isAdmin && isPast48Hours}
                            className="h-10 rounded-xl border-rose-100 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Photo album gallery */}
            <div className="space-y-3 pt-2">
              <Label className="text-sm font-bold text-slate-700">Photo Album Gallery 📸</Label>
              <CloudinaryUpload
                images={formData.gallery}
                maxUploads={maxGalleryImages}
                onUpload={(url, publicId) => {
                  if (!isAdmin && isPast48Hours) return
                  setFormData((prev) => ({
                    ...prev,
                    gallery: [...prev.gallery, { url, publicId }],
                  }))
                }}
                onRemove={(publicId) => {
                  if (!isAdmin && isPast48Hours) return
                  setFormData((prev) => ({
                    ...prev,
                    gallery: prev.gallery.filter((g) => g.publicId !== publicId),
                  }))
                }}
              />
              <p className="text-xs text-slate-400">
                Current template tier limit: {maxGalleryImages} images max. Upgrading allows more slots.
              </p>
            </div>

            {/* Footer Buttons step 1 */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between sm:items-center pt-4 border-t border-rose-50 mt-6">
              <Button variant="ghost" onClick={onClose} disabled={isSaving} className="w-full sm:w-auto">
                Cancel
              </Button>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                {(!isPast48Hours || isAdmin) && (
                  <Button
                    onClick={() => handleSaveDetailsOnly()}
                    disabled={isSaving}
                    variant="outline"
                    className="rounded-xl border-rose-200 text-slate-700 w-full sm:w-auto"
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Save details'
                    )}
                  </Button>
                )}
                <Button
                  onClick={() => setStep('template')}
                  className="bg-linear-to-r from-[#F43F8F] to-[#c73272] text-white rounded-xl shadow-md flex items-center justify-center gap-1.5 w-full sm:w-auto h-10"
                >
                  Choose Style / Theme
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* STEP 2: CHOOSE TEMPLATE & STYLE */
          <div className="space-y-6 py-4">
            {/* Refund and Upgrade warning message */}
            {!isAdmin && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800 space-y-1">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Refund & Upgrade Information</span>
                </div>
                <p className="leading-relaxed">
                  • Choosing a lower tier template than your current tier (<strong>{invitation.tier.toUpperCase()}</strong>) will not issue any partial refunds.
                </p>
                <p className="leading-relaxed">
                  • Choosing a higher tier template will require payment of the price difference between plans.
                </p>
              </div>
            )}

            {/* Grid layout of templates */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {STYLES.map((tmpl) => {
                const isSelected = formData.template === tmpl.slug
                return (
                  <div
                    key={tmpl.slug}
                    onClick={() => setFormData({ ...formData, template: tmpl.slug })}
                    className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all p-2 bg-white flex flex-col relative ${
                      isSelected
                        ? 'border-[#F43F8F] shadow-md shadow-rose-100'
                        : 'border-slate-100 hover:border-rose-100'
                    }`}
                  >
                    {/* Visual gradient box representing template color scheme */}
                    <div
                      className="h-20 w-full rounded-xl flex items-center justify-center relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${tmpl.palette[0] || '#FAF0E6'}, ${tmpl.palette[1] || '#B76E79'})`,
                      }}
                    >
                      <span className="text-2xl">{tmpl.emoji}</span>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#F43F8F] flex items-center justify-center ring-2 ring-white">
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="mt-2 space-y-1">
                      <p className="text-xs font-serif font-bold text-slate-800 truncate">
                        {tmpl.name}
                      </p>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            TIER_BADGE_STYLE[tmpl.tier]
                          }`}
                        >
                          {tmpl.tier}
                        </span>
                        {/* Cost calculation */}
                        {!isAdmin && TIER_ORDER[tmpl.tier] > TIER_ORDER[invitation.tier] && (
                          <span className="text-xs text-[#F43F8F] font-bold">
                            {getTierPrice(tmpl.tier) - currentPaid > 0
                              ? `+₹${getTierPrice(tmpl.tier) - currentPaid}`
                              : 'Free'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Display selected Upgrade Difference if any */}
            {!isAdmin && isUpgrading && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex justify-between items-center text-xs">
                <div>
                  <p className="text-sm font-bold text-rose-800">Plan Upgrade Required</p>
                  <p className="text-xs text-rose-700/80">
                    Upgrading from {invitation.tier.toUpperCase()} to {selectedTemplateTier.toUpperCase()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 font-medium font-sans">Upgrade Price Difference</p>
                  <p className="text-2xl font-serif font-bold text-[#F43F8F]">₹{upgradeCost}</p>
                </div>
              </div>
            )}

            {/* Footer Buttons step 2 */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center pt-4 border-t border-rose-50 mt-6">
              <Button
                variant="ghost"
                onClick={() => setStep('details')}
                disabled={isSaving}
                className="flex items-center justify-center gap-1 w-full sm:w-auto"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
              <Button
                onClick={handleSaveTemplateChange}
                disabled={isSaving}
                className="bg-linear-to-r from-[#F43F8F] to-[#c73272] text-white rounded-xl shadow-lg px-8 font-bold w-full sm:w-auto h-10"
              >
                {isSaving ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </div>
                ) : isUpgrading && !isAdmin ? (
                  `Pay difference & Save (₹${upgradeCost})`
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
