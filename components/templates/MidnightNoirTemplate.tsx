'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock, Star, ChevronDown, Map as MapIcon } from 'lucide-react'
import type { TemplateProps } from './types'
import RSVPModal from '@/components/invitation/RSVPModal'

function StarField() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white rounded-full"
          style={{
            width: Math.random() * 2 + 1,
            height: Math.random() * 2 + 1,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.1, 0.6, 0.1],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  )
}

export default function MidnightNoirTemplate({
  brideName,
  groomName,
  date,
  venue,
  events,
  gallery,
  isPreview,
  isThumbnail,
  invitationId,
  tier,
  musicUrl,
  inline,
  ourStory,
  mapUrl,
}: TemplateProps) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const tick = () => {
      const d = Math.max(0, date.getTime() - Date.now())
      setTime({
        days: Math.floor(d / 86400000),
        hours: Math.floor((d % 86400000) / 3600000),
        minutes: Math.floor((d % 3600000) / 60000),
        seconds: Math.floor((d % 60000) / 1000),
      })
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [date])

  const fmt = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <>
      <style>{`
        @keyframes noirGlow {
          0%, 100% { text-shadow: 0 0 20px rgba(201,168,76,0.2); }
          50% { text-shadow: 0 0 40px rgba(201,168,76,0.4); }
        }
        .glow-text { animation: noirGlow 4s ease-in-out infinite; }
      `}</style>

      <div
        className={isThumbnail ? 'min-h-full' : 'min-h-screen'}
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {/* ── HERO ─────────────────────────────────── */}
        <section
          className={`relative flex flex-col items-center justify-center text-center overflow-hidden px-10 ${isThumbnail ? 'min-h-[812px]' : inline ? 'min-h-[700px]' : 'min-h-screen'}`}
          style={{ background: '#050505' }}
        >
          {/* Animated starfield backdrop */}
          <StarField />

          {/* Decorative gold rings */}
          {[300, 500, 700].map((s, i) => (
            <motion.div
              key={s}
              className="absolute rounded-full border pointer-events-none"
              style={{ width: s, height: s, borderColor: 'rgba(201,168,76,0.08)' }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 30 + i * 10, repeat: Infinity, ease: 'linear' }}
            />
          ))}

          <div className="relative z-10 max-w-3xl px-4">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 2 }}
              className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 md:mb-8 rounded-full flex items-center justify-center"
              style={{
                border: '1px solid rgba(201,168,76,0.4)',
                background: 'rgba(201,168,76,0.05)',
              }}
            >
              <Star className="w-8 h-8" style={{ color: '#C9A84C', fill: '#C9A84C' }} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.8em' }}
              animate={{ opacity: 1, letterSpacing: '0.5em' }}
              transition={{ duration: 2 }}
              className="font-sans text-[10px] md:text-xs uppercase mb-10"
              style={{ color: '#888' }}
            >
              The Pleasure of Your Company
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="glow-text font-light leading-tight md:leading-none"
              style={{
                color: '#C9A84C',
                fontSize: isThumbnail
                  ? '3.5rem'
                  : inline
                    ? 'clamp(2.5rem, 10vw, 4.5rem)'
                    : 'clamp(3rem, 11vw, 8.5rem)',
              }}
            >
              {brideName}
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.5, duration: 1.5 }}
              className="mx-auto my-6 h-px"
              style={{
                width: 120,
                background: 'linear-gradient(to right, transparent, #C9A84C, transparent)',
              }}
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-2xl md:text-3xl font-light italic my-2 md:my-3"
              style={{ color: 'rgba(201,168,76,0.6)' }}
            >
              &amp;
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="glow-text font-light leading-tight md:leading-none"
              style={{
                color: '#C9A84C',
                fontSize: isThumbnail
                  ? '3.5rem'
                  : inline
                    ? 'clamp(2.5rem, 10vw, 4.5rem)'
                    : 'clamp(3rem, 11vw, 8.5rem)',
              }}
            >
              {groomName}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5 }}
              className="font-sans text-sm md:text-base tracking-widest mt-8 md:mt-10"
              style={{ color: '#C0C0C0' }}
            >
              {fmt}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
              className="font-sans text-xs md:text-sm mt-2 px-4"
              style={{ color: '#666' }}
            >
              {venue}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <ChevronDown className="w-5 h-5" style={{ color: '#C9A84C' }} />
            </motion.div>
          </motion.div>
        </section>

        {/* ── COUNTDOWN ───────────────────────────── */}
        <section className="py-24 text-center px-4 relative" style={{ background: '#0A0A0A' }}>
          {/* Decorative divider */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-linear-to-r from-transparent via-[#C9A84C] to-transparent" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.p
              initial={{ letterSpacing: '1em', opacity: 0 }}
              whileInView={{ letterSpacing: '0.5em', opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="font-sans text-[11px] uppercase mb-12"
              style={{ color: '#C9A84C' }}
            >
              The Countdown to Eternity
            </motion.p>

            <div className="flex gap-4 md:gap-10 justify-center flex-wrap">
              {[
                { label: 'Days', v: time.days },
                { label: 'Hours', v: time.hours },
                { label: 'Minutes', v: time.minutes },
                { label: 'Seconds', v: time.seconds },
              ].map((i, idx) => (
                <motion.div
                  key={i.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1, duration: 0.8 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div
                    className="relative w-18 h-20 md:w-24 md:h-28 flex items-center justify-center overflow-hidden"
                    style={{
                      border: '1px solid rgba(201,168,76,0.5)',
                      background: 'linear-gradient(180deg, #111 0%, #050505 100%)',
                      boxShadow: '0 0 30px rgba(201,168,76,0.1) inset',
                    }}
                  >
                    {/* Golden edge glow */}
                    <div className="absolute inset-0 pointer-events-none shadow-[0_0_15px_rgba(201,168,76,0.1)]" />

                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={i.v}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -30, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl md:text-5xl font-light z-10"
                        style={{ color: '#C9A84C', textShadow: '0 0 10px rgba(201,168,76,0.3)' }}
                      >
                        {String(i.v).padStart(2, '0')}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <span
                    className="font-sans text-[10px] uppercase tracking-[0.3em]"
                    style={{ color: '#888' }}
                  >
                    {i.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── OUR STORY ───────────────────────────── */}
        {ourStory && (
          <section
            className="py-32 px-6 relative overflow-hidden"
            style={{ background: '#050505' }}
          >
            <StarField />
            <div className="max-w-2xl mx-auto relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Star className="w-6 h-6 mx-auto mb-6 text-[#C9A84C]" />
                <h2
                  className="text-3xl md:text-4xl font-light tracking-[0.2em] uppercase mb-10"
                  style={{ color: '#C9A84C' }}
                >
                  Our Story
                </h2>
                <div className="w-16 h-px mx-auto mb-10 bg-[#C9A84C]/30" />
                <p className="text-lg md:text-xl leading-relaxed font-serif italic text-white/80">
                  {ourStory}
                </p>
                <div className="mt-12 flex justify-center gap-4">
                  <div className="w-1 h-1 rounded-full bg-[#C9A84C]" />
                  <div className="w-1 h-1 rounded-full bg-[#C9A84C]/50" />
                  <div className="w-1 h-1 rounded-full bg-[#C9A84C]/20" />
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* ── MAP / LOCATION ───────────────────────── */}
        {mapUrl && (
          <section className="py-24 px-6 text-center" style={{ background: '#0A0A0A' }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto p-12 border border-white/5 bg-[#111] relative group"
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#C9A84C]/50" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#C9A84C]/50" />

              <div className="flex flex-col items-center gap-8">
                <div className="w-20 h-20 rounded-full border border-[#C9A84C]/30 flex items-center justify-center bg-[#050505] shadow-[0_0_30px_rgba(201,168,76,0.1)]">
                  <MapPin className="w-10 h-10 text-[#C9A84C]" />
                </div>
                <div className="space-y-4">
                  <p className="font-sans text-[10px] uppercase tracking-[0.5em] text-[#888]">
                    The Rendezvous
                  </p>
                  <h3 className="text-3xl md:text-4xl font-light text-[#C9A84C]">{venue}</h3>
                  <p className="text-white/40 max-w-sm mx-auto font-sans text-sm">
                    Join us at this beautiful location for our special day.
                  </p>
                </div>
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 px-12 py-5 border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black transition-all duration-500 font-sans text-xs font-bold uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(201,168,76,0.1)]"
                >
                  Get Directions on Maps
                </a>
              </div>
            </motion.div>
          </section>
        )}

        {/* ── EVENTS ──────────────────────────────── */}
        <section className="py-24 px-4" style={{ background: '#050505' }}>
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2
                className="text-4xl font-light tracking-widest uppercase"
                style={{ color: '#C9A84C' }}
              >
                The Schedule
              </h2>
              <div className="mx-auto mt-4 h-px" style={{ width: 60, background: '#C9A84C' }} />
            </motion.div>
            <div className="space-y-6">
              {events.map((ev, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="p-8 border border-white/5"
                  style={{ background: '#111' }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-light mb-2" style={{ color: '#C9A84C' }}>
                        {ev.name}
                      </h3>
                      {ev.description && (
                        <p className="font-sans text-sm mb-4" style={{ color: '#888' }}>
                          {ev.description}
                        </p>
                      )}
                      <div
                        className="flex flex-wrap gap-4 font-sans text-xs"
                        style={{ color: '#666' }}
                      >
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {ev.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {ev.location}
                        </span>
                      </div>
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 border text-[10px] font-bold uppercase tracking-widest transition-all duration-300 hover:bg-[#C9A84C] hover:text-black hover:border-[#C9A84C]"
                      style={{ borderColor: '#C9A84C', color: '#C9A84C' }}
                    >
                      <MapIcon className="w-3 h-3" /> Directions
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── GALLERY ─────────────────────────────── */}
        {gallery.length > 0 && (
          <section className="py-24 px-4" style={{ background: '#0D0D0D' }}>
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-14"
              >
                <h2
                  className="text-4xl font-light tracking-widest uppercase"
                  style={{ color: '#C9A84C' }}
                >
                  The Gallery
                </h2>
              </motion.div>
              <div className="columns-2 md:columns-3 gap-4 space-y-4">
                {gallery.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="overflow-hidden border border-white/5"
                    style={{ breakInside: 'avoid' }}
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="w-full object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FOOTER ──────────────────────────────── */}
        <section className="py-20 text-center" style={{ background: '#050505' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Star className="w-8 h-8 mx-auto mb-6" style={{ color: '#C9A84C' }} />
            <h2
              className="text-3xl font-light mb-2 uppercase tracking-widest"
              style={{ color: '#C9A84C' }}
            >
              Join Us Under The Stars
            </h2>
            <p className="font-sans text-sm mb-10" style={{ color: '#666' }}>
              {venue}
            </p>
            {!isPreview && invitationId && <RSVPModal invitationId={invitationId} />}
          </motion.div>
        </section>
      </div>
    </>
  )
}
