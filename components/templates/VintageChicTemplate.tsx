'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock, Heart, Camera } from 'lucide-react'
import type { TemplateProps } from './types'
import RSVPModal from '@/components/invitation/RSVPModal'

export default function VintageChicTemplate({
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

  if (!mounted) return <div className="min-h-screen bg-[#F5E6D3]" />

  return (
    <div
      className="min-h-screen bg-[#F5E6D3] text-[#5D4037] overflow-hidden selection:bg-[#8D6E63] selection:text-white"
      style={{ fontFamily: 'var(--font-cormorant), serif' }}
    >
      {/* Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/old-mathematics.png')]" />

      {/* --- HERO --- */}
      <section className={`relative flex flex-col items-center justify-center text-center px-6 ${isThumbnail ? 'min-h-[812px]' : 'min-h-screen'}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="relative z-10 border-[1px] border-[#8D6E63]/20 p-12 md:p-20 bg-white/40 backdrop-blur-[2px] rounded-sm"
        >
          {/* Decorative Corner Ornaments */}
          <div className="absolute -top-4 -left-4 text-4xl opacity-40">❦</div>
          <div className="absolute -top-4 -right-4 text-4xl opacity-40 rotate-90">❦</div>
          <div className="absolute -bottom-4 -left-4 text-4xl opacity-40 -rotate-90">❦</div>
          <div className="absolute -bottom-4 -right-4 text-4xl opacity-40 rotate-180">❦</div>

          <p className="font-sans text-[10px] uppercase tracking-[0.5em] mb-12 text-[#8D6E63]">Save the Date</p>
          <h1 className="text-6xl md:text-8xl font-normal mb-6 italic leading-none">
            {brideName}
          </h1>
          <div className="flex items-center justify-center gap-4 my-8">
            <div className="h-px w-12 bg-[#8D6E63]/30" />
            <span className="italic text-3xl font-light opacity-60">to</span>
            <div className="h-px w-12 bg-[#8D6E63]/30" />
          </div>
          <h1 className="text-6xl md:text-8xl font-normal mb-16 italic leading-none">
            {groomName}
          </h1>
          <p className="text-2xl md:text-3xl font-light mb-4 border-y border-[#8D6E63]/10 py-6 tracking-[0.2em]">
            {fmt}
          </p>
          <p className="text-sm font-sans uppercase tracking-widest text-[#8D6E63]/80 italic">{venue}</p>
        </motion.div>
      </section>

      {/* --- STORY --- */}
      {ourStory && (
        <section className="py-40 px-6 relative">
          <div className="max-w-2xl mx-auto text-center">
            <Heart className="w-6 h-6 mx-auto mb-12 text-[#8D6E63]/20" />
            <h2 className="text-4xl font-light mb-12 italic">Our Lovestory</h2>
            <div className="relative">
               <span className="absolute -top-10 -left-10 text-9xl text-[#8D6E63]/5 font-serif italic">"</span>
               <p className="text-xl md:text-2xl leading-relaxed italic text-[#5D4037]/80 px-4">
                {ourStory}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* --- SCHEDULE --- */}
      <section className="py-40 px-6 bg-[#EBD9C1]/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-sans text-xs uppercase tracking-[0.6em] text-center mb-24 opacity-50">Timeline</h2>
          <div className="space-y-24">
            {events.map((ev, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row gap-12 items-center text-center md:text-left"
              >
                <div className="md:w-48">
                  <span className="text-3xl italic font-light text-[#8D6E63]">{ev.time}</span>
                </div>
                <div className="flex-1 p-10 bg-white/30 border border-white/40 rounded-sm shadow-sm relative group hover:bg-white/50 transition-colors">
                  <div className="absolute -right-4 -top-4 w-12 h-12 flex items-center justify-center bg-[#F5E6D3] border border-[#8D6E63]/10 rounded-full text-[10px] text-[#8D6E63] font-bold">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-3xl font-normal mb-4">{ev.name}</h3>
                  <p className="text-[#8D6E63] mb-6 italic">{ev.description}</p>
                  <p className="text-xs uppercase tracking-widest opacity-60 flex items-center justify-center md:justify-start gap-2">
                    <MapPin size={12} /> {ev.location}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- GALLERY --- */}
      {gallery.length > 0 && (
        <section className="py-40 px-4">
          <div className="max-w-6xl mx-auto flex flex-col items-center">
            <Camera className="w-8 h-8 mb-16 opacity-20" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {gallery.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, rotate: i % 2 === 0 ? -2 : 2 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 shadow-2xl shadow-[#8D6E63]/10 border border-[#8D6E63]/5"
                >
                  <img src={img.url} alt="" className="w-full aspect-[4/5] object-cover sepia-[0.3] hover:sepia-0 transition-all duration-1000" />
                  <div className="h-px w-full bg-[#8D6E63]/10 my-4" />
                  <p className="text-[10px] text-center uppercase tracking-widest opacity-40">MOMENT #{i + 1}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- RSVP --- */}
      <section className="py-40 px-6 text-center">
        <div className="max-w-xl mx-auto border-t border-[#8D6E63]/10 pt-20">
          <h2 className="text-5xl font-normal mb-12 italic">Join our Journey</h2>
          {!isPreview && invitationId && <RSVPModal invitationId={invitationId} />}
          <p className="mt-20 font-sans text-[9px] uppercase tracking-[0.5em] opacity-30">
            Vintage Chic Collection — DNvites
          </p>
        </div>
      </section>
    </div>
  )
}
