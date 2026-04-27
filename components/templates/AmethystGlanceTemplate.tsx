'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock, Gem, Sparkles } from 'lucide-react'
import type { TemplateProps } from './types'
import RSVPModal from '@/components/invitation/RSVPModal'

export default function AmethystGlanceTemplate({
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

  if (!mounted) return <div className="min-h-screen bg-[#1A0B2E]" />

  return (
    <div
      className="min-h-screen bg-[#1A0B2E] text-purple-100 overflow-hidden"
      style={{ fontFamily: 'var(--font-inter), sans-serif' }}
    >
      {/* Crystalline Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[120px] rounded-full" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      {/* --- HERO --- */}
      <section className={`relative flex flex-col items-center justify-center text-center px-6 ${isThumbnail ? 'min-h-[812px]' : 'min-h-screen'}`}>
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2 }}
          className="relative z-10 p-12 md:p-24 border border-white/10 bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl"
        >
          {/* Glass Glint Effect */}
          <motion.div 
            className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-transparent skew-x-[-20deg]"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 5 }}
          />

          <h2 className="font-sans text-[10px] uppercase tracking-[0.8em] mb-16 text-purple-300 flex items-center justify-center gap-4">
             <div className="h-px w-8 bg-purple-500/30" />
             The Radiance of Love
             <div className="h-px w-8 bg-purple-500/30" />
          </h2>

          <h1 className="text-5xl md:text-8xl font-black mb-4 tracking-tighter text-white" style={{ fontFamily: 'var(--font-cinzel)' }}>
            {brideName}
          </h1>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="my-10 text-purple-400"
          >
             <Gem size={40} className="mx-auto" />
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-black mb-16 tracking-tighter text-white" style={{ fontFamily: 'var(--font-cinzel)' }}>
            {groomName}
          </h1>

          <p className="text-xl md:text-2xl font-light mb-2 tracking-widest text-purple-200 uppercase">{fmt}</p>
          <p className="text-sm tracking-[0.3em] text-purple-400/80 font-medium">{venue}</p>
        </motion.div>

        {/* Floating Sparkles */}
        {[...Array(20)].map((_, i) => (
           <motion.div
             key={i}
             className="absolute text-purple-300/40"
             style={{
               top: `${Math.random() * 100}%`,
               left: `${Math.random() * 100}%`,
             }}
             animate={{
               opacity: [0.1, 0.5, 0.1],
               scale: [1, 1.5, 1],
             }}
             transition={{
               duration: 2 + Math.random() * 3,
               repeat: Infinity,
               delay: Math.random() * 5
             }}
           >
             <Sparkles size={Math.random() * 10 + 5} />
           </motion.div>
        ))}
      </section>

      {/* --- STORY --- */}
      {ourStory && (
        <section className="py-40 px-6">
          <div className="max-w-3xl mx-auto text-center border-y border-white/5 py-32 bg-white/2">
             <h2 className="text-3xl font-bold mb-12 text-purple-300" style={{ fontFamily: 'var(--font-cinzel)' }}>Our Crystalline Journey</h2>
             <p className="text-xl md:text-3xl leading-relaxed font-light text-purple-100/70 italic">
                "{ourStory}"
             </p>
          </div>
        </section>
      )}

      {/* --- SCHEDULE --- */}
      <section className="py-40 px-6 relative">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
           {events.map((ev, i) => (
             <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group p-10 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-500 hover:border-purple-500/30"
             >
                <div className="flex justify-between items-start mb-8">
                   <Clock className="text-purple-400 group-hover:scale-110 transition-transform" />
                   <span className="text-xs font-mono text-purple-500 font-bold uppercase tracking-widest">{ev.time}</span>
                </div>
                <h3 className="text-3xl font-bold mb-4 text-white" style={{ fontFamily: 'var(--font-cinzel)' }}>{ev.name}</h3>
                <p className="text-purple-200/50 mb-8 leading-relaxed">{ev.description}</p>
                <div className="flex items-center gap-2 text-sm text-purple-300/70">
                   <MapPin size={14} />
                   {ev.location}
                </div>
             </motion.div>
           ))}
        </div>
      </section>

      {/* --- GALLERY --- */}
      {gallery.length > 0 && (
        <section className="py-40 px-4">
          <div className="max-w-6xl mx-auto">
             <div className="columns-2 md:columns-3 gap-4 space-y-4">
                {gallery.map((img, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="overflow-hidden rounded-xl border border-white/10"
                  >
                    <img src={img.url} alt="" className="w-full object-cover saturate-[0.8] brightness-110" />
                  </motion.div>
                ))}
             </div>
          </div>
        </section>
      )}

      {/* --- RSVP --- */}
      <section className="py-40 px-6 text-center">
        <div className="max-w-2xl mx-auto p-20 border border-white/10 bg-linear-to-b from-white/5 to-transparent rounded-[100px_100px_0_0]">
           <Gem size={48} className="mx-auto mb-10 text-purple-400 opacity-30" />
           <h2 className="text-5xl font-black mb-12 text-white" style={{ fontFamily: 'var(--font-cinzel)' }}>Secure Your Presence</h2>
           {!isPreview && invitationId && <RSVPModal invitationId={invitationId} />}
           <p className="mt-20 text-[10px] tracking-[0.6em] text-purple-500 font-bold uppercase">
              DNvites Premium Series
           </p>
        </div>
      </section>
    </div>
  )
}
