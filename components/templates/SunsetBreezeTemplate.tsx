'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock, Sun, Waves } from 'lucide-react'
import type { TemplateProps } from './types'
import RSVPModal from '@/components/invitation/RSVPModal'

export default function SunsetBreezeTemplate({
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

  if (!mounted) return <div className="min-h-screen bg-[#FFFBF0]" />

  return (
    <div
      className="min-h-screen bg-[#FFFBF0] text-[#5D4037] overflow-hidden"
      style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
    >
      {/* --- HERO --- */}
      <section className={`relative flex flex-col items-center justify-center text-center px-6 ${isThumbnail ? 'min-h-[812px]' : 'min-h-screen'} bg-linear-to-b from-[#FFE0B2] to-[#FFFBF0]`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-20 text-[#FFB74D] opacity-20"
        >
          <Sun size={120} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="relative z-10"
        >
          <Waves className="w-10 h-10 text-[#FFAB91] mx-auto mb-8" />
          <h2 className="text-sm font-bold uppercase tracking-[0.4em] mb-6 text-[#FF8A65]">The Adventure Begins</h2>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 text-[#4E342E]">
            {brideName} <span className="text-[#FFAB91]">&amp;</span> {groomName}
          </h1>
          <div className="bg-[#4E342E] text-white px-8 py-3 inline-block rounded-full mb-10 text-sm font-bold tracking-widest uppercase">
            {fmt}
          </div>
          <p className="text-xl font-medium italic opacity-70">{venue}</p>
        </motion.div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-24 fill-[#FFFBF0]">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C58.31,111.41,135.29,114.32,203.49,103,262.13,93.26,275.52,65,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* --- STORY --- */}
      {ourStory && (
        <section className="py-32 px-6">
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <h2 className="text-4xl font-bold text-[#4E342E]">Our Story</h2>
              <div className="w-16 h-2 bg-[#FFAB91]" />
              <p className="text-lg md:text-xl leading-relaxed opacity-80 italic">
                {ourStory}
              </p>
            </div>
            <div className="w-48 h-48 rounded-full border-4 border-[#FFAB91] p-2 rotate-12">
               <div className="w-full h-full rounded-full bg-[#FFE0B2] flex items-center justify-center">
                  <Sun className="w-12 h-12 text-[#FF8A65]" />
               </div>
            </div>
          </div>
        </section>
      )}

      {/* --- SCHEDULE --- */}
      <section className="py-32 px-6 bg-[#4E342E] text-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-6 mb-20">
            <h2 className="text-5xl font-bold">The Day</h2>
            <div className="h-px flex-1 bg-white/20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {events.map((ev, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <span className="text-[#FFAB91] font-bold tracking-widest">{ev.time}</span>
                <h3 className="text-2xl font-bold">{ev.name}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{ev.description}</p>
                <p className="text-xs flex items-center gap-2 text-[#FFAB91]"><MapPin className="w-3 h-3" /> {ev.location}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- GALLERY --- */}
      {gallery.length > 0 && (
        <section className="py-32 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((img, i) => (
              <motion.div
                key={i}
                whileHover={{ rotate: i % 2 === 0 ? 2 : -2, scale: 1.05 }}
                className="aspect-square bg-white p-3 shadow-lg rounded-sm"
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* --- RSVP --- */}
      <section className="py-32 px-6 text-center">
        <div className="bg-[#FFF3E0] max-w-2xl mx-auto p-16 rounded-[40px] shadow-inner">
          <h2 className="text-4xl font-bold text-[#4E342E] mb-6">RSVP</h2>
          <p className="mb-10 text-[#FF8A65] font-bold">We can't wait to celebrate with you!</p>
          {!isPreview && invitationId && <RSVPModal invitationId={invitationId} />}
        </div>
      </section>
    </div>
  )
}
