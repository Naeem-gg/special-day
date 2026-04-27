'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock, Calendar, Sparkles } from 'lucide-react'
import type { TemplateProps } from './types'
import RSVPModal from '@/components/invitation/RSVPModal'

export default function LavenderMistTemplate({
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

  if (!mounted) return <div className="min-h-screen bg-[#FDFBFF]" />

  return (
    <div
      className="min-h-screen bg-[#FDFBFF] text-[#4A3E54] overflow-hidden"
      style={{ fontFamily: 'var(--font-cormorant), serif' }}
    >
      {/* Decorative floating elements */}
      <div className="fixed inset-0 pointer-events-none opacity-30 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl bg-purple-200"
            style={{
              width: Math.random() * 400 + 200,
              height: Math.random() * 400 + 200,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      {/* --- HERO --- */}
      <section className={`relative flex flex-col items-center justify-center text-center px-6 ${isThumbnail ? 'min-h-[812px]' : 'min-h-screen'}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="relative z-10"
        >
          <Sparkles className="w-6 h-6 text-purple-300 mx-auto mb-8 animate-pulse" />
          <h2 className="text-xl md:text-2xl font-light italic mb-6 text-purple-400">Please Join Us for the Wedding of</h2>
          <h1 className="text-6xl md:text-8xl font-normal tracking-wide mb-8">
            {brideName} <span className="text-purple-300 block md:inline md:mx-4">&amp;</span> {groomName}
          </h1>
          <div className="w-24 h-px bg-purple-100 mx-auto mb-10" />
          <p className="text-2xl md:text-3xl font-light mb-2">{fmt}</p>
          <p className="text-lg text-purple-400 italic">{venue}</p>
        </motion.div>
      </section>

      {/* --- STORY --- */}
      {ourStory && (
        <section className="py-32 px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-light mb-12 italic text-purple-400">Our Journey</h2>
            <div className="p-12 border border-purple-50 bg-white/50 backdrop-blur-sm rounded-[100px_0_100px_0]">
              <p className="text-xl md:text-2xl leading-relaxed italic text-purple-900/70">
                {ourStory}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* --- SCHEDULE --- */}
      <section className="py-32 px-6 relative z-10 bg-white/30 backdrop-blur-md">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-light text-center mb-24 italic text-purple-400">Celebration Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {events.map((ev, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center p-8 bg-white/60 rounded-3xl border border-purple-50 shadow-sm"
              >
                <Clock className="w-5 h-5 mx-auto mb-4 text-purple-300" />
                <h3 className="text-2xl font-normal mb-4 text-purple-800">{ev.name}</h3>
                <p className="text-lg mb-6 text-purple-600/70">{ev.description}</p>
                <div className="flex flex-col items-center gap-2 text-sm text-purple-400">
                  <span className="font-bold">{ev.time}</span>
                  <span className="flex items-center gap-1 italic"><MapPin className="w-3 h-3" /> {ev.location}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- GALLERY --- */}
      {gallery.length > 0 && (
        <section className="py-32 px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
             <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
              {gallery.map((img, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className="rounded-3xl overflow-hidden shadow-xl shadow-purple-900/5"
                >
                  <img src={img.url} alt="" className="w-full object-cover" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- RSVP --- */}
      <section className="py-32 px-6 text-center relative z-10">
        <div className="max-w-xl mx-auto bg-white/80 p-16 rounded-full border border-purple-50">
          <h2 className="text-4xl font-light mb-10 italic">We Hope to See You There</h2>
          {!isPreview && invitationId && <RSVPModal invitationId={invitationId} />}
        </div>
      </section>
    </div>
  )
}
