'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock, ChevronDown, Feather, Map as MapIcon } from 'lucide-react'
import type { TemplateProps } from './types'
import RSVPModal from '@/components/invitation/RSVPModal'

/* ── Gold leaf floating particle ────────────────────────── */
function GoldLeaf({ style }: { style: React.CSSProperties }) {
  return (
    <div className="absolute pointer-events-none select-none" style={style}>
      <svg width="8" height="12" viewBox="0 0 8 12">
        <path d="M4 0 C7 3, 8 7, 4 12 C0 7, 1 3, 4 0Z" fill="#D4AF37" opacity="0.25" />
      </svg>
    </div>
  )
}

/* ── Ornamental flourish divider ────────────────────────── */
function IvoryDivider() {
  return (
    <div className="flex justify-center items-center gap-4 my-8">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="h-px w-20 origin-right"
        style={{ background: 'linear-gradient(to left, #D4AF37, transparent)' }}
      />
      <motion.div
        initial={{ scale: 0, rotate: -90 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20">
          <path
            d="M10 2 L12 8 L18 10 L12 12 L10 18 L8 12 L2 10 L8 8Z"
            fill="#D4AF37"
            opacity="0.7"
          />
        </svg>
      </motion.div>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="h-px w-20 origin-left"
        style={{ background: 'linear-gradient(to right, #D4AF37, transparent)' }}
      />
    </div>
  )
}

export default function SacredIvoryTemplate({
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
  const [goldLeaves, setGoldLeaves] = useState<React.CSSProperties[]>([])
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    setGoldLeaves(
      Array.from({ length: 16 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `-10px`,
        animation: `sacredFall ${8 + Math.random() * 12}s ${Math.random() * 10}s infinite linear`,
      }))
    )
  }, [])

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
        @keyframes sacredFall {
          0% { transform: translateY(-10px) rotate(0deg) translateX(0); opacity: 0; }
          15% { opacity: 0.6; }
          85% { opacity: 0.3; }
          100% { transform: translateY(${isThumbnail ? '812px' : '100vh'}) rotate(360deg) translateX(30px); opacity: 0; }
        }
        @keyframes ivoryShimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .ivory-gradient-text {
          background: linear-gradient(90deg, #8B4513, #D4AF37, #8B4513, #D4AF37, #8B4513);
          background-size: 300% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: ivoryShimmer 6s ease-in-out infinite;
        }
      `}</style>

      <div
        className={isThumbnail ? 'min-h-full' : 'min-h-screen'}
        style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
      >
        {/* ── HERO ─────────────────────────────────── */}
        <section
          className={`relative flex flex-col items-center justify-center text-center overflow-hidden px-6 ${isThumbnail ? 'min-h-[812px]' : inline ? 'min-h-[700px]' : 'min-h-screen'}`}
          style={{ background: '#000' }}
        >
          {/* Full Opacity Video Backdrop */}
          {!isThumbnail && (
            <div className="absolute inset-0 z-0">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
                style={{ opacity: 1 }}
              >
                <source src="/videos/wedding bg.mp4" type="video/mp4" />
              </video>
              {/* Vignette & Soft Overlay for readability */}
              <div
                className="absolute inset-0 bg-black/20"
                style={{
                  background:
                    'radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)',
                }}
              />
            </div>
          )}

          {goldLeaves.map((s, i) => (
            <GoldLeaf key={i} style={s} />
          ))}

          {/* Ornamental corner SVGs */}
          <div className="absolute inset-6 md:inset-12 pointer-events-none z-10">
            {/* Top-left corner */}
            <svg
              className="absolute top-0 left-0 w-16 h-16 md:w-24 md:h-24"
              viewBox="0 0 100 100"
              fill="none"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
            >
              <motion.path
                d="M5 40 L5 5 L40 5"
                stroke="#D4AF37"
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 1.5 }}
              />
              <motion.path
                d="M5 20 Q20 20, 20 5"
                stroke="#D4AF37"
                strokeWidth="1"
                opacity="0.4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 2 }}
              />
            </svg>
            {/* Top-right corner */}
            <svg
              className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24"
              viewBox="0 0 100 100"
              fill="none"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
            >
              <motion.path
                d="M60 5 L95 5 L95 40"
                stroke="#D4AF37"
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 1.7 }}
              />
              <motion.path
                d="M80 5 Q80 20, 95 20"
                stroke="#D4AF37"
                strokeWidth="1"
                opacity="0.4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 2.2 }}
              />
            </svg>
          </div>

          <div className="relative z-20 max-w-3xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, delay: 0.8, ease: 'backOut' }}
              className="w-16 h-16 mx-auto mb-8 rounded-full flex items-center justify-center shadow-xl"
              style={{ border: '1.5px solid #D4AF37', background: 'rgba(255,255,255,0.95)' }}
            >
              <Feather className="w-7 h-7" style={{ color: '#8B4513' }} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="font-sans text-[10px] uppercase mb-10 tracking-[0.5em] font-bold"
              style={{
                color: '#FFF',
                textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              Together With Their Families
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.5, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="font-light leading-tight md:leading-none text-white"
              style={{
                fontSize: isThumbnail
                  ? '3.5rem'
                  : inline
                    ? 'clamp(2.5rem, 10vw, 4rem)'
                    : 'clamp(3.5rem, 12vw, 8rem)',
                letterSpacing: '0.05em',
                textShadow: '0 4px 20px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.8)',
              }}
            >
              {brideName}
            </motion.h1>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
              <div className="flex justify-center items-center gap-4 my-10">
                <div className="h-px w-20 bg-white/60 shadow-sm" />
                <motion.p
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 2.2, duration: 0.8 }}
                  className="text-3xl font-light italic text-white"
                  style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
                >
                  &amp;
                </motion.p>
                <div className="h-px w-20 bg-white/60 shadow-sm" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.5, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
              className="font-light leading-tight md:leading-none text-white"
              style={{
                fontSize: isThumbnail
                  ? '3.5rem'
                  : inline
                    ? 'clamp(2.5rem, 10vw, 4rem)'
                    : 'clamp(3.5rem, 12vw, 8rem)',
                letterSpacing: '0.05em',
                textShadow: '0 4px 20px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.8)',
              }}
            >
              {groomName}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5, duration: 1 }}
              className="text-white"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
            >
              <p
                className="mt-10 text-sm tracking-[0.4em] uppercase font-semibold"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {fmt}
              </p>

              <p
                className="mt-3 text-sm font-medium opacity-90"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {venue}
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
          >
            <span
              className="text-[10px] uppercase tracking-[0.5em] text-white font-bold"
              style={{
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              Scroll
            </span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <ChevronDown className="w-5 h-5 text-white" />
            </motion.div>
          </motion.div>
        </section>

        {/* ── COUNTDOWN ───────────────────────────── */}
        <section
          className="py-24 text-center relative overflow-hidden"
          style={{ background: '#FFFDF5' }}
        >
          {/* Decorative background element */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-linear-to-b from-[#D4AF37] to-transparent opacity-30" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.p
              initial={{ letterSpacing: '0.8em', opacity: 0 }}
              whileInView={{ letterSpacing: '0.4em', opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="text-[11px] uppercase mb-12"
              style={{ color: '#8B4513', fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}
            >
              The Grand Beginning In
            </motion.p>

            <div className="flex gap-4 md:gap-10 justify-center flex-wrap px-4">
              {[
                { label: 'Days', v: time.days },
                { label: 'Hours', v: time.hours },
                { label: 'Minutes', v: time.minutes },
                { label: 'Seconds', v: time.seconds },
              ].map((i, idx) => (
                <motion.div
                  key={i.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1, duration: 0.8 }}
                  className="flex flex-col items-center gap-4 group"
                >
                  <div
                    className="relative w-20 h-24 md:w-24 md:h-28 flex items-center justify-center overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #FFFDF5 0%, #FFF8E7 100%)',
                      border: '1px solid rgba(212,175,55,0.4)',
                      boxShadow: '0 10px 40px rgba(212,175,55,0.08)',
                    }}
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
                      className="absolute inset-0 z-10 w-1/2 h-full bg-linear-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] pointer-events-none"
                    />

                    {/* Rolling Number Animation */}
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={i.v}
                        initial={{ y: 40, opacity: 0, filter: 'blur(4px)' }}
                        animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                        exit={{ y: -40, opacity: 0, filter: 'blur(4px)' }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="text-3xl md:text-5xl font-light z-20"
                        style={{ color: '#5C3317' }}
                      >
                        {String(i.v).padStart(2, '0')}
                      </motion.span>
                    </AnimatePresence>

                    {/* Corner accents inside boxes */}
                    <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#D4AF37]/30" />
                    <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#D4AF37]/30" />
                  </div>

                  <span
                    className="text-[10px] uppercase tracking-[0.3em] font-bold"
                    style={{ color: '#B8860B', fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {i.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── EVENTS ──────────────────────────────── */}
        <section
          className="py-24 px-4"
          style={{ background: 'linear-gradient(180deg, #FFF8E7, #FFFDF5)' }}
        >
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <p
                className="text-[10px] uppercase tracking-[0.6em] mb-3"
                style={{ color: '#B8860B', fontFamily: "'Montserrat', sans-serif" }}
              >
                The Celebration
              </p>
              <h2 className="text-4xl md:text-5xl font-light" style={{ color: '#5C3317' }}>
                Sacred Events
              </h2>
              <IvoryDivider />
            </motion.div>
            <div className="space-y-6">
              {events.map((ev, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="p-8 relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #FFFDF5, #FFF8E7)',
                    border: '1px solid rgba(212,175,55,0.25)',
                    boxShadow: '0 4px 30px rgba(212,175,55,0.06)',
                  }}
                >
                  {/* Corner accent */}
                  <div
                    className="absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-15"
                    style={{
                      background: 'radial-gradient(circle at top right, #D4AF37, transparent 70%)',
                    }}
                  />

                  <p
                    className="text-[10px] uppercase tracking-[0.5em] mb-2"
                    style={{ color: '#D4AF37', fontFamily: "'Montserrat', sans-serif" }}
                  >
                    ✦ Event {i + 1} ✦
                  </p>
                  <h3 className="text-2xl font-light mb-2" style={{ color: '#5C3317' }}>
                    {ev.name}
                  </h3>
                  {ev.description && (
                    <p
                      className="text-sm mb-4"
                      style={{ color: '#8B6914', fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {ev.description}
                    </p>
                  )}
                  <div
                    className="flex flex-wrap gap-4 text-xs"
                    style={{ color: '#B8860B', fontFamily: "'Montserrat', sans-serif" }}
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
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 border text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-300 hover:bg-[#D4AF37] hover:text-white hover:border-[#D4AF37]"
                    style={{
                      borderColor: 'rgba(212,175,55,0.35)',
                      color: '#8B4513',
                      fontFamily: "'Montserrat', sans-serif",
                    }}
                  >
                    <MapIcon className="w-3 h-3" /> Open in Maps
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── GALLERY ─────────────────────────────── */}
        {gallery.length > 0 && (
          <section className="py-24 px-4" style={{ background: '#FFFDF5' }}>
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-14"
              >
                <h2 className="text-4xl font-light" style={{ color: '#5C3317' }}>
                  Our Story in Portraits
                </h2>
                <IvoryDivider />
              </motion.div>
              <div className="columns-2 md:columns-3 gap-4 space-y-4">
                {gallery.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="overflow-hidden"
                    style={{
                      breakInside: 'avoid',
                      border: '1px solid rgba(212,175,55,0.2)',
                      boxShadow: '0 4px 20px rgba(212,175,55,0.08)',
                    }}
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FOOTER ──────────────────────────────── */}
        <section
          className="py-20 text-center"
          style={{ background: 'linear-gradient(160deg, #FFF8E7, #FAF0DC)' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Feather className="w-8 h-8 mx-auto mb-6" style={{ color: '#D4AF37' }} />
            <h2 className="text-3xl font-light mb-2" style={{ color: '#5C3317' }}>
              Your Presence Is Our Blessing
            </h2>
            <p
              className="text-sm mb-10"
              style={{ color: '#B8860B', fontFamily: "'Montserrat', sans-serif" }}
            >
              {venue}
            </p>
            {!isPreview && invitationId && (
              <div className="flex gap-4 justify-center flex-wrap">
                {tier !== 'basic' && <RSVPModal invitationId={invitationId} />}
              </div>
            )}
          </motion.div>
        </section>
      </div>
    </>
  )
}
