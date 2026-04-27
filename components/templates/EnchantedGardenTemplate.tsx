'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock, Leaf, Sparkles, ChevronDown } from 'lucide-react'
import type { StyleProps } from './types'
import RSVPModal from '@/components/invitation/RSVPModal'

function Fireflies() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-yellow-200 rounded-full"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            boxShadow: '0 0 10px #fef08a, 0 0 20px #fef08a'
          }}
          animate={{
            opacity: [0, 0.8, 0],
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 5
          }}
        />
      ))}
    </div>
  )
}

export default function EnchantedGardenTemplate({
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

  if (!mounted) return <div className="min-h-screen bg-[#0B2010]" />

  return (
    <div
      className="min-h-screen bg-[#0B2010] text-[#D4AF37] overflow-hidden"
      style={{ fontFamily: 'var(--font-cormorant), serif' }}
    >
      {/* Decorative Garden Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-900 blur-[150px] rounded-full" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-950 blur-[150px] rounded-full" />
      </div>

      {/* --- HERO --- */}
      <section className={`relative flex flex-col items-center justify-center text-center px-6 ${isThumbnail ? 'min-h-[812px]' : 'min-h-screen'}`}>
        <Fireflies />
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="relative z-10"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="mb-12 text-green-500/30"
          >
             <Leaf size={80} strokeWidth={1} />
          </motion.div>

          <h2 className="text-sm font-sans uppercase tracking-[0.5em] mb-12 text-[#D4AF37]/60 italic font-bold">In the Heart of the Forest</h2>
          
          <h1 className="text-7xl md:text-9xl font-normal tracking-wide mb-6 text-[#EAD8A0]" style={{ fontFamily: 'var(--font-playfair)' }}>
            {brideName}
          </h1>
          <div className="flex items-center justify-center gap-6 my-10">
             <div className="w-12 h-px bg-[#D4AF37]/30" />
             <Sparkles className="text-[#D4AF37] animate-pulse" />
             <div className="w-12 h-px bg-[#D4AF37]/30" />
          </div>
          <h1 className="text-7xl md:text-9xl font-normal tracking-wide mb-16 text-[#EAD8A0]" style={{ fontFamily: 'var(--font-playfair)' }}>
            {groomName}
          </h1>

          <div className="space-y-6">
             <p className="text-2xl md:text-3xl font-light italic text-[#D4AF37]/80">{fmt}</p>
             <div className="flex justify-center gap-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-[#D4AF37]/20" />
                ))}
             </div>
             <p className="text-lg tracking-[0.2em] font-sans uppercase font-bold text-green-500/60">{venue}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
           <ChevronDown className="animate-bounce" />
        </motion.div>
      </section>

      {/* --- STORY --- */}
      {ourStory && (
        <section className="py-40 px-6 relative bg-emerald-950/30">
          <Fireflies />
          <div className="max-w-3xl mx-auto text-center relative z-10">
             <h2 className="text-5xl font-normal mb-16 italic text-[#EAD8A0]">The Enchantment</h2>
             <div className="relative p-12 md:p-24 border border-[#D4AF37]/10 bg-black/20 backdrop-blur-sm rounded-[60px_0_60px_0]">
                <p className="text-2xl md:text-4xl leading-relaxed italic text-[#D4AF37]/70">
                   "{ourStory}"
                </p>
                <Leaf className="absolute -bottom-8 -right-8 w-16 h-16 opacity-10 rotate-45" />
             </div>
          </div>
        </section>
      )}

      {/* --- SCHEDULE --- */}
      <section className="py-40 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-normal text-center mb-32 italic text-[#EAD8A0]">Forest Gathering</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {events.map((ev, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="group p-12 bg-black/40 border border-[#D4AF37]/5 rounded-[40px] hover:border-[#D4AF37]/20 transition-all duration-700"
              >
                <div className="flex justify-between items-center mb-10">
                   <div className="p-4 bg-green-950/50 rounded-2xl group-hover:bg-green-900 transition-colors">
                      <Clock size={24} className="text-[#D4AF37]" />
                   </div>
                   <span className="text-xs font-sans font-bold uppercase tracking-[0.4em] text-green-500">{ev.time}</span>
                </div>
                <h3 className="text-4xl font-normal mb-6 text-[#EAD8A0]">{ev.name}</h3>
                <p className="text-[#D4AF37]/50 text-xl mb-10 italic">{ev.description}</p>
                <div className="flex items-center gap-3 text-sm font-sans uppercase tracking-widest text-[#D4AF37]/80">
                   <MapPin size={16} className="text-green-500" />
                   {ev.location}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- GALLERY --- */}
      {gallery.length > 0 && (
        <section className="py-40 px-4 relative">
          <Fireflies />
          <div className="max-w-6xl mx-auto relative z-10">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {gallery.map((img, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -10 }}
                    className={`rounded-[30px] overflow-hidden border border-[#D4AF37]/10 ${i % 2 === 0 ? 'mt-12' : ''}`}
                  >
                    <img src={img.url} alt="" className="w-full h-[500px] object-cover saturate-150 brightness-75 hover:brightness-100 transition-all duration-1000" />
                  </motion.div>
                ))}
             </div>
          </div>
        </section>
      )}

      {/* --- RSVP --- */}
      <section className="py-40 px-6 text-center relative">
        <div className="max-w-2xl mx-auto p-20 bg-emerald-950/20 backdrop-blur-md rounded-full border border-[#D4AF37]/10 shadow-2xl shadow-green-950/50">
           <Leaf size={40} className="mx-auto mb-10 text-green-500 opacity-20" />
           <h2 className="text-5xl font-normal mb-12 italic text-[#EAD8A0]">Enter the Garden</h2>
           {!isPreview && invitationId && <RSVPModal invitationId={invitationId} />}
           <div className="mt-20 text-[10px] font-sans tracking-[0.4em] text-green-900 font-bold uppercase">
              The Enchanted Collection — DNvites
           </div>
        </div>
      </section>
    </div>
  )
}
