'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock, Heart, Star, ChevronDown } from 'lucide-react'
import type { TemplateProps } from './types'
import RSVPModal from '@/components/invitation/RSVPModal'

function GoldPetals() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-[#D4AF37]"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 8 + 4,
            top: -20,
            left: `${Math.random() * 100}%`,
            borderRadius: '100% 0 100% 0',
            boxShadow: '0 0 10px rgba(212,175,55,0.5)'
          }}
          animate={{
            top: '110%',
            x: [0, 50, -50, 0],
            rotate: 360,
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )
}

export default function OpulentRubyTemplate({
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

  if (!mounted) return <div className="min-h-screen bg-[#4A0404]" />

  return (
    <div
      className="min-h-screen bg-[#4A0404] text-[#D4AF37] overflow-hidden"
      style={{ fontFamily: 'var(--font-playfair), serif' }}
    >
      {/* --- HERO --- */}
      <section className={`relative flex flex-col items-center justify-center text-center px-6 ${isThumbnail ? 'min-h-[812px]' : 'min-h-screen'} bg-linear-to-b from-[#2A0202] via-[#4A0404] to-[#2A0202]`}>
        <GoldPetals />
        
        {/* Ornate Gold Border */}
        <div className="absolute inset-8 border border-[#D4AF37]/30 pointer-events-none">
           <div className="absolute top-[-10px] left-[-10px] w-20 h-20 border-t-2 border-l-2 border-[#D4AF37]" />
           <div className="absolute top-[-10px] right-[-10px] w-20 h-20 border-t-2 border-r-2 border-[#D4AF37]" />
           <div className="absolute bottom-[-10px] left-[-10px] w-20 h-20 border-b-2 border-l-2 border-[#D4AF37]" />
           <div className="absolute bottom-[-10px] right-[-10px] w-20 h-20 border-b-2 border-r-2 border-[#D4AF37]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-4xl"
        >
          <motion.div 
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="mb-12"
          >
             <Star size={48} className="mx-auto fill-[#D4AF37]" />
          </motion.div>
          
          <h2 className="text-sm font-sans uppercase tracking-[1em] mb-16 text-[#D4AF37]/50 font-bold">The Grand Celebration Of</h2>
          
          <h1 className="text-7xl md:text-[10rem] font-black mb-8 tracking-tight leading-none text-transparent bg-clip-text bg-linear-to-b from-[#D4AF37] via-[#FFF5D1] to-[#B8860B]" style={{ fontFamily: 'var(--font-cinzel)' }}>
            {brideName}
          </h1>
          <div className="flex items-center justify-center gap-12 my-12">
             <div className="h-px w-32 bg-[#D4AF37]/20" />
             <Heart size={32} className="text-[#D4AF37]/80 fill-[#D4AF37]/20" />
             <div className="h-px w-32 bg-[#D4AF37]/20" />
          </div>
          <h1 className="text-7xl md:text-[10rem] font-black mb-16 tracking-tight leading-none text-transparent bg-clip-text bg-linear-to-b from-[#D4AF37] via-[#FFF5D1] to-[#B8860B]" style={{ fontFamily: 'var(--font-cinzel)' }}>
            {groomName}
          </h1>

          <div className="space-y-8">
             <p className="text-3xl md:text-5xl font-light italic text-[#D4AF37]/90">{fmt}</p>
             <p className="text-xl tracking-[0.4em] font-sans uppercase font-bold text-white/40">{venue}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2"
        >
           <ChevronDown className="animate-bounce w-8 h-8 opacity-40" />
        </motion.div>
      </section>

      {/* --- STORY --- */}
      {ourStory && (
        <section className="py-60 px-6 relative bg-black">
          <div className="absolute inset-0 bg-[#4A0404]/30" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
             <h2 className="text-6xl font-black mb-24 tracking-[0.3em] uppercase text-white/5" style={{ fontFamily: 'var(--font-cinzel)' }}>Our Passion</h2>
             <div className="relative group">
                <div className="absolute inset-0 bg-[#D4AF37]/5 blur-3xl rounded-full scale-150" />
                <p className="text-3xl md:text-5xl leading-relaxed font-light italic text-[#D4AF37]/80 relative z-10 px-6 py-20 border-x border-[#D4AF37]/10">
                   "{ourStory}"
                </p>
             </div>
          </div>
        </section>
      )}

      {/* --- SCHEDULE --- */}
      <section className="py-40 px-6 relative border-y border-[#D4AF37]/10 bg-linear-to-b from-[#2A0202] to-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 px-4">
            {events.map((ev, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-16 border border-[#D4AF37]/5 bg-black/40 hover:bg-[#4A0404]/20 transition-all duration-1000 group"
              >
                <div className="flex flex-col items-center gap-10">
                   <div className="w-16 h-px bg-[#D4AF37]/20 group-hover:w-32 transition-all duration-700" />
                   <div className="text-center">
                      <span className="text-xs font-sans font-bold uppercase tracking-[0.6em] text-white/30 block mb-6">{ev.time}</span>
                      <h3 className="text-5xl font-normal mb-8 text-[#EAD8A0]">{ev.name}</h3>
                      <p className="text-[#D4AF37]/40 text-xl italic mb-10">{ev.description}</p>
                      <div className="flex items-center justify-center gap-3 text-xs font-sans uppercase tracking-[0.3em] text-[#D4AF37] font-bold">
                         <MapPin size={14} className="text-white/20" />
                         {ev.location}
                      </div>
                   </div>
                   <div className="w-16 h-px bg-[#D4AF37]/20 group-hover:w-32 transition-all duration-700" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- GALLERY --- */}
      {gallery.length > 0 && (
        <section className="py-60 px-4 relative overflow-hidden">
          <GoldPetals />
          <div className="max-w-7xl mx-auto relative z-10">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
                {gallery.map((img, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05, filter: 'contrast(1.2)' }}
                    className={`aspect-[3/4] overflow-hidden border border-[#D4AF37]/20 shadow-2xl shadow-black ${i % 2 === 0 ? 'translate-y-12' : ''}`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover grayscale-[0.5] hover:grayscale-0 transition-all duration-1000" />
                  </motion.div>
                ))}
             </div>
          </div>
        </section>
      )}

      {/* --- RSVP --- */}
      <section className="py-60 px-6 text-center relative bg-black">
        <div className="max-w-2xl mx-auto p-24 border-2 border-[#D4AF37]/20 bg-linear-to-b from-[#4A0404]/50 to-transparent">
           <Heart size={48} className="mx-auto mb-16 text-[#D4AF37] opacity-20" />
           <h2 className="text-6xl md:text-8xl font-normal mb-16 italic text-transparent bg-clip-text bg-linear-to-b from-[#D4AF37] to-[#B8860B]">Join the Dynasty</h2>
           {!isPreview && invitationId && <RSVPModal invitationId={invitationId} />}
           <div className="mt-40 text-[10px] font-sans tracking-[0.8em] text-[#D4AF37]/30 font-bold uppercase">
              Opulent Series • DNvites Premium
           </div>
        </div>
      </section>
    </div>
  )
}
