'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock, Wind, Sun } from 'lucide-react'
import type { TemplateProps } from './types'
import RSVPModal from '@/components/invitation/RSVPModal'

export default function DesertSandTemplate({
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

  if (!mounted) return <div className="min-h-screen bg-[#FDF5E6]" />

  return (
    <div
      className="min-h-screen bg-[#FDF5E6] text-[#634133] overflow-hidden"
      style={{ fontFamily: 'var(--font-cormorant), serif' }}
    >
      {/* Decorative SVG Patterns (Boho Style) */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-[0.04]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="boho" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
             <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
             <path d="M50 10 L50 90 M10 50 L90 50" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#boho)" />
        </svg>
      </div>

      {/* --- HERO --- */}
      <section className={`relative flex flex-col items-center justify-center text-center px-6 ${isThumbnail ? 'min-h-[812px]' : 'min-h-screen'} bg-linear-to-tr from-[#FDF5E6] via-[#F5E6D3] to-[#FDF5E6]`}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative z-10"
        >
          <div className="flex justify-center mb-10 gap-2">
             {[...Array(3)].map((_, i) => (
               <div key={i} className="w-2 h-2 rounded-full bg-[#D2691E]/30" />
             ))}
          </div>
          <h2 className="text-sm font-sans uppercase tracking-[0.6em] mb-12 text-[#D2691E]">Wild &amp; Free</h2>
          <h1 className="text-7xl md:text-9xl font-normal tracking-tight mb-4 text-[#8B4513]">
            {brideName}
          </h1>
          <p className="text-3xl font-light italic my-6 text-[#D2691E]">&amp;</p>
          <h1 className="text-7xl md:text-9xl font-normal tracking-tight mb-16 text-[#8B4513]">
            {groomName}
          </h1>
          <div className="space-y-4">
             <p className="text-2xl font-light tracking-widest">{fmt}</p>
             <div className="w-40 h-[2px] bg-[#D2691E]/20 mx-auto" />
             <p className="text-sm font-sans uppercase tracking-[0.4em] text-[#D2691E]/80">{venue}</p>
          </div>
        </motion.div>

        {/* Animated Leaves/Dust particles */}
        <div className="absolute inset-0 pointer-events-none">
           {[...Array(12)].map((_, i) => (
             <motion.div
               key={i}
               className="absolute text-[#D2691E]/20"
               initial={{ 
                 top: `${Math.random() * 100}%`, 
                 left: `${Math.random() * 100}%`,
                 opacity: 0
               }}
               animate={{
                 x: [0, 100, 0],
                 y: [0, -50, 0],
                 rotate: [0, 360],
                 opacity: [0, 0.5, 0]
               }}
               transition={{
                 duration: 15 + Math.random() * 10,
                 repeat: Infinity,
                 delay: Math.random() * 5
               }}
             >
               <Wind size={20 + Math.random() * 20} />
             </motion.div>
           ))}
        </div>
      </section>

      {/* --- STORY --- */}
      {ourStory && (
        <section className="py-40 px-6 bg-[#634133] text-[#FDF5E6]">
          <div className="max-w-3xl mx-auto text-center relative">
             <Sun className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 opacity-10 animate-spin-slow" />
             <h2 className="text-5xl font-normal mb-16 italic">Our Desert Tale</h2>
             <p className="text-2xl leading-relaxed italic opacity-80">
                "{ourStory}"
             </p>
             <div className="mt-20 flex justify-center gap-8">
                <div className="h-px flex-1 bg-[#FDF5E6]/10" />
                <div className="w-3 h-3 rotate-45 border border-[#FDF5E6]/30" />
                <div className="h-px flex-1 bg-[#FDF5E6]/10" />
             </div>
          </div>
        </section>
      )}

      {/* --- SCHEDULE --- */}
      <section className="py-40 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-sm font-sans uppercase tracking-[0.6em] text-center mb-24 text-[#D2691E]">Ceremony Schedule</h2>
          <div className="space-y-32">
            {events.map((ev, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                <div className="text-6xl font-light opacity-5 absolute -top-12 left-1/2 -translate-x-1/2">{ev.time}</div>
                <h3 className="text-4xl font-normal mb-4 relative z-10">{ev.name}</h3>
                <p className="text-xl text-[#D2691E] mb-8 italic">{ev.description}</p>
                <div className="flex items-center justify-center gap-3 text-xs font-sans uppercase tracking-widest text-[#8B4513]">
                   <MapPin size={14} className="text-[#D2691E]" />
                   {ev.location}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- GALLERY --- */}
      {gallery.length > 0 && (
        <section className="py-40 px-4 bg-[#F5E6D3]/30">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-1 px-4">
            {gallery.map((img, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 0.98 }}
                className="aspect-square overflow-hidden"
              >
                <img src={img.url} alt="" className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700" />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* --- RSVP --- */}
      <section className="py-40 px-6 text-center">
        <div className="max-w-lg mx-auto bg-white/20 p-16 rounded-sm border border-[#D2691E]/10 backdrop-blur-sm">
          <h2 className="text-5xl font-normal mb-10 italic">Be Part of our Oasis</h2>
          {!isPreview && invitationId && <RSVPModal invitationId={invitationId} />}
          <p className="mt-16 text-[10px] font-sans uppercase tracking-widest text-[#D2691E]/60">
             {venue}
          </p>
        </div>
      </section>
    </div>
  )
}
