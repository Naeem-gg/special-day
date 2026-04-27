'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Heart } from 'lucide-react'
import type { TemplateProps } from './types'
import RSVPModal from '@/components/invitation/RSVPModal'

export default function ClassicScriptTemplate({
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
}: TemplateProps) {
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
      className="min-h-screen bg-white text-zinc-900 overflow-hidden border-[24px] border-zinc-50"
      style={{ fontFamily: 'var(--font-cormorant), serif' }}
    >
      {/* --- HERO --- */}
      <section className={`relative flex flex-col items-center justify-center text-center px-6 ${isThumbnail ? 'min-h-[812px]' : 'min-h-screen'}`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="max-w-2xl border border-zinc-100 p-16 md:p-24 relative"
        >
          {/* Decorative Corners */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t border-l border-zinc-200" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t border-r border-zinc-200" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b border-l border-zinc-200" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b border-r border-zinc-200" />

          <p className="text-sm uppercase tracking-[0.6em] mb-12 text-zinc-400">Together with their families</p>
          <h1 className="text-6xl md:text-8xl font-normal mb-8 leading-none italic">
            {brideName}
          </h1>
          <p className="text-2xl font-light italic text-zinc-300 my-4">&amp;</p>
          <h1 className="text-6xl md:text-8xl font-normal mb-16 leading-none italic">
            {groomName}
          </h1>
          <p className="text-xl md:text-2xl font-light mb-2 tracking-widest">{fmt}</p>
          <p className="text-sm uppercase tracking-widest text-zinc-400">{venue}</p>
        </motion.div>
      </section>

      {/* --- STORY --- */}
      {ourStory && (
        <section className="py-32 px-6">
          <div className="max-w-xl mx-auto text-center border-y border-zinc-50 py-20">
            <h2 className="text-sm uppercase tracking-[0.5em] text-zinc-400 mb-10">Our Story</h2>
            <p className="text-2xl leading-relaxed italic text-zinc-600">
              "{ourStory}"
            </p>
          </div>
        </section>
      )}

      {/* --- SCHEDULE --- */}
      <section className="py-32 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-normal text-center mb-20 italic">Order of Events</h2>
          <div className="space-y-20">
            {events.map((ev, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <span className="text-xs uppercase tracking-[0.4em] text-zinc-300 block mb-4">{ev.time}</span>
                <h3 className="text-3xl font-normal mb-4 italic">{ev.name}</h3>
                <p className="text-zinc-500 max-w-sm mx-auto mb-4">{ev.description}</p>
                <p className="text-xs uppercase tracking-widest text-zinc-400 flex items-center justify-center gap-2">
                  <MapPin size={12} /> {ev.location}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- GALLERY --- */}
      {gallery.length > 0 && (
        <section className="py-32 px-4 bg-zinc-50">
          <div className="max-w-4xl mx-auto space-y-12">
            {gallery.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="p-4 bg-white shadow-sm border border-zinc-100"
              >
                <img src={img.url} alt="" className="w-full h-auto grayscale" />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* --- RSVP --- */}
      <section className="py-32 px-6 text-center">
        <Heart className="w-4 h-4 mx-auto mb-12 text-zinc-200" />
        <h2 className="text-4xl font-normal mb-12 italic">Kindly Respond</h2>
        {!isPreview && invitationId && <RSVPModal invitationId={invitationId} />}
      </section>
    </div>
  )
}
