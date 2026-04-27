'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock, Star, Diamond, Crown, ChevronDown } from 'lucide-react'
import type { TemplateProps } from './types'
import RSVPModal from '@/components/invitation/RSVPModal'

function DiamondSparkle() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white"
          style={{
            width: Math.random() * 2 + 1,
            height: Math.random() * 2 + 1,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            borderRadius: '50%',
            boxShadow: '0 0 10px #fff, 0 0 20px #fff'
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 0.5],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 5
          }}
        />
      ))}
    </div>
  )
}

export default function DiamondRegalTemplate({
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

  if (!mounted) return <div className="min-h-screen bg-black" />

  return (
    <div
      className="min-h-screen bg-black text-white overflow-hidden"
      style={{ fontFamily: 'var(--font-playfair), serif' }}
    >
      {/* --- HERO --- */}
      <section className={`relative flex flex-col items-center justify-center text-center px-6 ${isThumbnail ? 'min-h-[812px]' : 'min-h-screen'}`}>
        <DiamondSparkle />
        
        {/* Platinum Geometric Accents */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
           <motion.div
             animate={{ rotate: 360 }}
             transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
             className="w-[120%] aspect-square border border-white max-w-[1200px]"
           />
           <motion.div
             animate={{ rotate: -360 }}
             transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
             className="absolute w-[80%] aspect-square border border-white max-w-[800px]"
           />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="mb-12"
          >
             <Crown size={60} className="mx-auto text-white" strokeWidth={1} />
          </motion.div>
          
          <h2 className="text-xs font-sans uppercase tracking-[0.8em] mb-16 text-zinc-500">The Royal Union Of</h2>
          
          <h1 className="text-7xl md:text-9xl font-black mb-6 tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white via-zinc-400 to-zinc-700" style={{ fontFamily: 'var(--font-cinzel)' }}>
            {brideName}
          </h1>
          <div className="flex items-center justify-center gap-10 my-12">
             <div className="h-px w-24 bg-linear-to-r from-transparent to-white/30" />
             <Diamond size={24} className="text-white animate-spin-slow" />
             <div className="h-px w-24 bg-linear-to-l from-transparent to-white/30" />
          </div>
          <h1 className="text-7xl md:text-9xl font-black mb-16 tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white via-zinc-400 to-zinc-700" style={{ fontFamily: 'var(--font-cinzel)' }}>
            {groomName}
          </h1>
          
          <p className="text-2xl md:text-4xl font-light mb-4 tracking-[0.2em] uppercase">{fmt}</p>
          <div className="h-[1px] w-20 bg-white/20 mx-auto my-8" />
          <p className="text-sm font-sans tracking-[0.5em] text-zinc-500 uppercase">{venue}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
           <ChevronDown className="animate-bounce text-zinc-700" />
        </motion.div>
      </section>

      {/* --- STORY --- */}
      {ourStory && (
        <section className="py-60 px-6 relative overflow-hidden bg-zinc-950">
           <DiamondSparkle />
           <div className="max-w-4xl mx-auto text-center relative z-10">
              <h2 className="text-5xl font-black mb-20 tracking-widest uppercase text-zinc-800" style={{ fontFamily: 'var(--font-cinzel)' }}>The Legacy</h2>
              <div className="relative group">
                 <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full scale-150 group-hover:bg-white/10 transition-all duration-1000" />
                 <p className="text-3xl md:text-5xl leading-relaxed font-light italic text-zinc-300 relative z-10 py-20 border-y border-white/5">
                   "{ourStory}"
                 </p>
              </div>
           </div>
        </section>
      )}

      {/* --- SCHEDULE --- */}
      <section className="py-40 px-6 bg-black border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-32">
             <h2 className="text-4xl font-black tracking-[0.4em] uppercase text-white mb-4" style={{ fontFamily: 'var(--font-cinzel)' }}>Itinerary</h2>
             <div className="w-12 h-1 bg-white mx-auto" />
          </div>
          <div className="space-y-1">
            {events.map((ev, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="group relative flex flex-col md:flex-row items-center justify-between p-16 border-b border-white/5 hover:bg-white/5 transition-all duration-700"
              >
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-full bg-white transition-all duration-700 group-hover:w-1" />
                <div className="mb-8 md:mb-0">
                   <span className="text-xs font-sans text-zinc-500 uppercase tracking-[0.5em] block mb-4">{ev.time}</span>
                   <h3 className="text-5xl font-normal group-hover:translate-x-4 transition-transform duration-700">{ev.name}</h3>
                </div>
                <div className="text-center md:text-right max-w-sm">
                   <p className="text-zinc-500 text-lg mb-6 leading-relaxed italic">{ev.description}</p>
                   <p className="text-[10px] uppercase tracking-widest text-zinc-400 flex items-center justify-center md:justify-end gap-3 font-bold">
                      <MapPin size={12} className="text-white" /> {ev.location}
                   </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- GALLERY --- */}
      {gallery.length > 0 && (
        <section className="py-60 px-4 bg-zinc-950 relative">
          <div className="max-w-7xl mx-auto">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 px-4">
                {gallery.map((img, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 0.95, filter: 'brightness(1.5)' }}
                    className="aspect-square overflow-hidden bg-black relative group"
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" />
                    <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 transition-all duration-1000" />
                  </motion.div>
                ))}
             </div>
          </div>
        </section>
      )}

      {/* --- RSVP --- */}
      <section className="py-60 px-6 text-center relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
        <div className="max-w-4xl mx-auto relative z-10">
           <Crown size={48} className="mx-auto mb-16 text-white/20" />
           <h2 className="text-6xl md:text-8xl font-normal mb-16 italic text-transparent bg-clip-text bg-linear-to-b from-white to-zinc-600">Secure Your Invitation</h2>
           {!isPreview && invitationId && <RSVPModal invitationId={invitationId} />}
           <div className="mt-40 text-[9px] font-sans tracking-[1em] text-zinc-700 uppercase font-bold">
              DNvites Diamond Series • Limited Edition
           </div>
        </div>
      </section>
    </div>
  )
}
