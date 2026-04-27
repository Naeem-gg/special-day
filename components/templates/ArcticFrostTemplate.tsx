'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock, Snowflake, Shield } from 'lucide-react'
import type { StyleProps } from './types'
import RSVPModal from '@/components/invitation/RSVPModal'

export default function ArcticFrostTemplate({
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
}: StyleProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const fmt = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  if (!mounted) return <div className="min-h-screen bg-[#F0F8FF]" />

  return (
    <div
      className="min-h-screen bg-[#F0F8FF] text-[#1A2A3A] overflow-hidden"
      style={{ fontFamily: 'var(--font-inter), sans-serif' }}
    >
      {/* Snowfall Effect */}
      <div className="fixed inset-0 pointer-events-none z-0">
         {[...Array(30)].map((_, i) => (
           <motion.div
             key={i}
             className="absolute text-blue-200/40"
             initial={{ 
               top: -20, 
               left: `${Math.random() * 100}%` 
             }}
             animate={{
               top: '110%',
               x: [0, 20, -20, 0],
               rotate: 360
             }}
             transition={{
               duration: 5 + Math.random() * 10,
               repeat: Infinity,
               delay: Math.random() * 5,
               ease: "linear"
             }}
           >
             <Snowflake size={10 + Math.random() * 20} />
           </motion.div>
         ))}
      </div>

      {/* --- HERO --- */}
      <section className={`relative flex flex-col items-center justify-center text-center px-6 ${isThumbnail ? 'min-h-[812px]' : 'min-h-screen'} bg-linear-to-b from-blue-100/50 to-[#F0F8FF]`}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="relative z-10"
        >
          <div className="w-24 h-24 mx-auto mb-12 flex items-center justify-center border-4 border-blue-200 rounded-full bg-white/40 backdrop-blur-md shadow-lg shadow-blue-900/5">
             <Snowflake className="w-12 h-12 text-blue-400 animate-pulse" />
          </div>
          <h2 className="text-xs uppercase tracking-[0.6em] mb-12 text-blue-500 font-bold">The Winter Celebration</h2>
          <h1 className="text-6xl md:text-9xl font-black mb-6 text-transparent bg-clip-text bg-linear-to-b from-[#1A2A3A] to-[#4682B4]" style={{ fontFamily: 'var(--font-cinzel)' }}>
            {brideName}
          </h1>
          <div className="flex items-center justify-center gap-6 my-10">
             <div className="h-[2px] w-16 bg-blue-200" />
             <span className="italic text-4xl font-light text-blue-300">with</span>
             <div className="h-[2px] w-16 bg-blue-200" />
          </div>
          <h1 className="text-6xl md:text-9xl font-black mb-16 text-transparent bg-clip-text bg-linear-to-b from-[#1A2A3A] to-[#4682B4]" style={{ fontFamily: 'var(--font-cinzel)' }}>
            {groomName}
          </h1>
          <p className="text-xl md:text-2xl font-light mb-2 tracking-widest text-blue-900/60 uppercase font-bold">{fmt}</p>
          <p className="text-sm font-medium tracking-[0.2em] text-blue-400 uppercase italic">{venue}</p>
        </motion.div>
      </section>

      {/* --- STORY --- */}
      {ourStory && (
        <section className="py-40 px-6 relative bg-white/20 backdrop-blur-sm border-y border-white/50">
          <div className="max-w-3xl mx-auto text-center">
             <h2 className="text-4xl font-black mb-16 text-[#1A2A3A]" style={{ fontFamily: 'var(--font-cinzel)' }}>A Frozen Tale</h2>
             <div className="p-12 md:p-20 bg-linear-to-br from-white/60 to-white/20 rounded-3xl border border-white shadow-2xl shadow-blue-900/5 relative overflow-hidden">
                <Snowflake className="absolute -top-10 -right-10 w-40 h-40 opacity-5 text-blue-500 rotate-12" />
                <p className="text-2xl md:text-3xl leading-relaxed font-light text-blue-900/70 italic relative z-10">
                  "{ourStory}"
                </p>
             </div>
          </div>
        </section>
      )}

      {/* --- SCHEDULE --- */}
      <section className="py-40 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-1 px-4">
          {events.map((ev, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-10 border border-blue-100 bg-white/40 text-center flex flex-col items-center gap-6 group hover:bg-blue-50 transition-colors"
            >
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-400 group-hover:bg-blue-400 group-hover:text-white transition-all">
                 <Clock size={20} />
              </div>
              <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">{ev.time}</span>
              <h3 className="text-2xl font-black" style={{ fontFamily: 'var(--font-cinzel)' }}>{ev.name}</h3>
              <p className="text-blue-900/50 text-sm leading-relaxed">{ev.description}</p>
              <div className="mt-auto pt-6 border-t border-blue-100 w-full">
                 <p className="text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 font-bold text-blue-400">
                   <MapPin size={12} /> {ev.location}
                 </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- GALLERY --- */}
      {gallery.length > 0 && (
        <section className="py-40 px-4 bg-linear-to-b from-transparent to-blue-50">
          <div className="max-w-6xl mx-auto">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {gallery.map((img, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05, zIndex: 10 }}
                    className="aspect-square overflow-hidden border-2 border-white shadow-xl"
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                  </motion.div>
                ))}
             </div>
          </div>
        </section>
      )}

      {/* --- RSVP --- */}
      <section className="py-40 px-6 text-center">
        <div className="max-w-xl mx-auto p-20 bg-white/60 rounded-[40px] border border-white shadow-inner">
           <Snowflake size={32} className="mx-auto mb-10 text-blue-300" />
           <h2 className="text-4xl font-black mb-10 text-[#1A2A3A]" style={{ fontFamily: 'var(--font-cinzel)' }}>Warm Your Heart With Us</h2>
           {!isPreview && invitationId && <RSVPModal invitationId={invitationId} />}
           <p className="mt-16 text-[10px] font-bold text-blue-400 uppercase tracking-[0.5em]">
              Arctic Series Collection
           </p>
        </div>
      </section>
    </div>
  )
}
