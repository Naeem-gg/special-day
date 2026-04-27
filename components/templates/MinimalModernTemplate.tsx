'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock, Calendar, Heart } from 'lucide-react'
import type { StyleProps } from './types'
import RSVPModal from '@/components/invitation/RSVPModal'

export default function MinimalModernTemplate({
  brideName,
  groomName,
  date,
  venue,
  events,
  gallery,
  isPreview,
  isThumbnail,
  invitationId,
  ourStory,
  mapUrl,
}: StyleProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const fmt = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  if (!mounted) return <div className="min-h-screen bg-white" />

  return (
    <div
      className="min-h-screen bg-white text-zinc-900 overflow-hidden"
      style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
    >
      {/* --- HERO --- */}
      <section className={`relative flex flex-col items-center justify-center text-center px-6 ${isThumbnail ? 'min-h-[812px]' : 'min-h-screen'}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-xl"
        >
          <span className="text-[10px] tracking-[0.4em] uppercase text-zinc-400 mb-8 block">
            The Marriage of
          </span>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-4">
            {brideName}
          </h1>
          <div className="flex items-center justify-center gap-4 my-6">
            <div className="h-px w-8 bg-zinc-200" />
            <Heart className="w-4 h-4 text-zinc-300 fill-zinc-300" />
            <div className="h-px w-8 bg-zinc-200" />
          </div>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-12">
            {groomName}
          </h1>
          <p className="text-sm md:text-base tracking-widest text-zinc-500 uppercase">
            {fmt}
          </p>
          <p className="text-xs mt-2 text-zinc-400">{venue}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[9px] uppercase tracking-widest text-zinc-300">Scroll</span>
          <div className="w-px h-12 bg-zinc-100" />
        </motion.div>
      </section>

      {/* --- STORY --- */}
      {ourStory && (
        <section className="py-32 px-6 bg-zinc-50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xs uppercase tracking-[0.5em] text-zinc-400 mb-12">Our Story</h2>
            <p className="text-lg md:text-2xl font-light leading-relaxed text-zinc-700 italic">
              "{ourStory}"
            </p>
          </div>
        </section>
      )}

      {/* --- SCHEDULE --- */}
      <section className="py-32 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xs uppercase tracking-[0.5em] text-zinc-400 mb-20 text-center">Schedule</h2>
          <div className="space-y-16">
            {events.map((ev, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row md:items-start gap-8 border-l border-zinc-100 pl-8 relative"
              >
                <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-zinc-200" />
                <div className="md:w-32 pt-1">
                  <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">{ev.time}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-medium mb-2">{ev.name}</h3>
                  <p className="text-zinc-500 text-sm mb-4 leading-relaxed">{ev.description}</p>
                  <p className="text-zinc-400 text-[10px] uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> {ev.location}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- GALLERY --- */}
      {gallery.length > 0 && (
        <section className="py-32 px-4 bg-zinc-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xs uppercase tracking-[0.5em] text-zinc-400 mb-20 text-center">Moments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="aspect-[4/5] overflow-hidden bg-white"
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- RSVP --- */}
      <section className="py-32 px-6 text-center">
        <Heart className="w-6 h-6 mx-auto mb-8 text-zinc-200" />
        <h2 className="text-3xl md:text-4xl font-light mb-12">Will you join us?</h2>
        {!isPreview && invitationId && <RSVPModal invitationId={invitationId} />}
        <p className="mt-12 text-[10px] text-zinc-300 uppercase tracking-[0.3em]">
          {venue}
        </p>
      </section>
    </div>
  )
}
