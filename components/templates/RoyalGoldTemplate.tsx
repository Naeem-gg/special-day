'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock, Crown, ChevronDown, Map as MapIcon } from 'lucide-react'
import type { TemplateProps } from './types'
import RSVPModal from '@/components/invitation/RSVPModal'

function OrnateBorder() {
  return (
    <div className="absolute inset-4 md:inset-8 pointer-events-none z-0">
      <svg className="w-full h-full" viewBox="0 0 800 800" preserveAspectRatio="none" fill="none">
        {/* Corners */}
        <motion.path
          d="M10 60 L10 10 L60 10"
          stroke="#D4AF37"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
        />
        <motion.path
          d="M740 10 L790 10 L790 60"
          stroke="#D4AF37"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.7 }}
        />
        <motion.path
          d="M10 740 L10 790 L60 790"
          stroke="#D4AF37"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.9 }}
        />
        <motion.path
          d="M790 740 L790 790 L740 790"
          stroke="#D4AF37"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 1.1 }}
        />
        {/* Top decorative flourish */}
        <motion.path
          d="M350 10 Q400 30, 450 10"
          stroke="#D4AF37"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 1.5 }}
        />
        <motion.circle
          cx="400"
          cy="10"
          r="4"
          fill="#D4AF37"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2 }}
        />
        {/* Side flourishes */}
        <motion.path
          d="M10 350 Q30 400, 10 450"
          stroke="#D4AF37"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 1.8 }}
        />
        <motion.path
          d="M790 350 Q770 400, 790 450"
          stroke="#D4AF37"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 2 }}
        />
      </svg>
    </div>
  )
}

function MughalDivider() {
  return (
    <div className="flex justify-center my-6">
      <svg width="300" height="30" viewBox="0 0 300 30" fill="none">
        <motion.path
          d="M0 15 Q37 5, 75 15 Q112 25, 150 15 Q188 5, 225 15 Q262 25, 300 15"
          stroke="#D4AF37"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2 }}
        />
        <motion.path
          d="M120 15 Q150 5, 180 15"
          stroke="#D4AF37"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1 }}
        />
        <motion.circle
          cx="150"
          cy="12"
          r="3"
          fill="#D4AF37"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.5 }}
        />
      </svg>
    </div>
  )
}

/* ── Flip-Clock Digit ────────────────── */
function FlipDigit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0')
  const prevRef = useRef(display)
  const [flip, setFlip] = useState(false)

  useEffect(() => {
    if (prevRef.current !== display) {
      setFlip(true)
      const t = setTimeout(() => setFlip(false), 600)
      prevRef.current = display
      return () => clearTimeout(t)
    }
  }, [display])

  return (
    <div className="flex flex-col items-center gap-1 md:gap-2">
      <div className="relative w-14 h-16 md:w-20 md:h-24 perspective-[400px]">
        {/* Back face (static) */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-lg overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #2A0610 0%, #3A0A14 50%, #1A0008 100%)',
            border: '1px solid rgba(212,175,55,0.3)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 12px rgba(0,0,0,0.5)',
          }}
        >
          {/* Center line */}
          <div className="absolute left-0 right-0 top-1/2 h-px bg-black/40 z-10" />
          <span
            className="text-xl md:text-3xl font-light tracking-wider"
            style={{ color: '#D4AF37', fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {display}
          </span>
        </div>

        {/* Flip animation layer */}
        <AnimatePresence>
          {flip && (
            <motion.div
              key={display}
              className="absolute inset-0 flex items-center justify-center rounded-lg overflow-hidden z-20"
              style={{
                background: 'linear-gradient(180deg, #2A0610 0%, #3A0A14 50%, #1A0008 100%)',
                border: '1px solid rgba(212,175,55,0.3)',
                transformOrigin: 'top center',
                backfaceVisibility: 'hidden',
              }}
              initial={{ rotateX: -90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              exit={{ rotateX: 90, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="absolute left-0 right-0 top-1/2 h-px bg-black/40 z-10" />
              <span
                className="text-xl md:text-3xl font-light tracking-wider"
                style={{ color: '#D4AF37', fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {display}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtle shine effect on glass */}
        <div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
          }}
        />
      </div>
      <span
        className="font-sans text-[8px] md:text-[10px] uppercase tracking-[0.25em]"
        style={{ color: '#D4AF37' }}
      >
        {label}
      </span>
    </div>
  )
}

export default function RoyalGoldTemplate({
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
        @keyframes curtainReveal {
          from { clip-path: inset(0 50% 0 50%); }
          to { clip-path: inset(0 0% 0 0%); }
        }
        .curtain { animation: curtainReveal 2s ease-out forwards; }
        @keyframes royalShimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .royal-text {
          background: linear-gradient(90deg, #8B0000, #D4AF37, #6B1A2B, #D4AF37, #8B0000);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: royalShimmer 5s ease-in-out infinite;
        }
      `}</style>

      <div
        className={isThumbnail ? 'min-h-full' : 'min-h-screen'}
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {/* ── HERO ─────────────────────────────────── */}
        <section
          className={`relative flex flex-col items-center justify-center text-center overflow-hidden px-6 ${isThumbnail ? 'min-h-[812px]' : inline ? 'min-h-[700px]' : 'min-h-screen'}`}
          style={{ background: 'linear-gradient(160deg, #1A0008 0%, #3A0A14 50%, #1A0008 100%)' }}
        >
          <OrnateBorder />

          {/* Video backdrop */}
          {!isThumbnail && (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              style={{ opacity: 0.5, mixBlendMode: 'screen' }}
            >
              <source src="/videos/wedding bg2.mp4" type="video/mp4" />
            </video>
          )}

          {/* Velvet texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, rgba(212,175,55,0.1) 0px, transparent 1px, transparent 4px, rgba(212,175,55,0.05) 5px)',
            }}
          />

          <div className="relative z-10 max-w-3xl curtain px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 md:mb-8 rounded-full flex items-center justify-center"
              style={{ border: '2px solid #D4AF37', background: 'rgba(212,175,55,0.1)' }}
            >
              <Crown className="w-8 h-8" style={{ color: '#D4AF37' }} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="font-sans text-[9px] md:text-[10px] uppercase tracking-[0.6em] mb-4 md:mb-6"
              style={{ color: '#D4AF37' }}
            >
              بسم اللہ الرحمن الرحیم · With God&apos;s Blessings
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="font-sans text-[10px] md:text-xs tracking-[0.4em] mb-6 md:mb-8"
              style={{ color: '#A08080' }}
            >
              The families of
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 1.3 }}
              className="royal-text font-light leading-tight md:leading-none"
              style={{
                fontSize: inline ? 'clamp(2.5rem, 8vw, 4rem)' : 'clamp(3rem, 10vw, 7.5rem)',
              }}
            >
              {brideName}
            </motion.h1>

            <MughalDivider />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="text-lg md:text-xl font-light italic my-1 md:my-2"
              style={{ color: 'rgba(212,175,55,0.6)' }}
            >
              &amp;
            </motion.p>

            <MughalDivider />

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1.3 }}
              className="royal-text font-light leading-tight md:leading-none"
              style={{
                fontSize: inline ? 'clamp(2.5rem, 8vw, 4rem)' : 'clamp(3rem, 10vw, 7.5rem)',
              }}
            >
              {groomName}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
              className="font-sans text-[11px] md:text-sm tracking-[0.3em] mt-6 md:mt-8 px-2"
              style={{ color: '#A08080' }}
            >
              Request the honour of your presence at their Walima
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3 }}
              className="font-sans text-sm md:text-base tracking-widest mt-4 md:mt-6"
              style={{ color: '#D4AF37' }}
            >
              {fmt}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.5 }}
              className="font-sans text-xs md:text-sm mt-2 px-4"
              style={{ color: '#806060' }}
            >
              {venue}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <ChevronDown className="w-5 h-5" style={{ color: '#D4AF37' }} />
            </motion.div>
          </motion.div>
        </section>

        {/* ── COUNTDOWN ───────────────────────────── */}
        <section
          className="py-16 md:py-20 text-center px-4 relative overflow-hidden"
          style={{ background: 'linear-gradient(180deg, #FFFBF0, #FFF5E0)' }}
        >
          {/* Decorative pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M30 0L30 60M0 30L60 30' stroke='%23D4AF37' stroke-width='0.5'/%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p
              className="font-sans text-[10px] md:text-xs uppercase tracking-[0.5em] mb-3"
              style={{ color: '#D4AF37' }}
            >
              ✦ Save The Date ✦
            </p>
            <h2
              className="text-2xl md:text-3xl font-light mb-8 md:mb-10"
              style={{ color: '#3A0A14', fontFamily: "'Playfair Display', serif" }}
            >
              Royal Countdown
            </h2>

            <div className="flex gap-3 md:gap-6 justify-center">
              <FlipDigit value={time.days} label="Days" />
              <div
                className="flex flex-col justify-center text-xl md:text-2xl font-light pt-2"
                style={{ color: '#D4AF37' }}
              >
                :
              </div>
              <FlipDigit value={time.hours} label="Hours" />
              <div
                className="flex flex-col justify-center text-xl md:text-2xl font-light pt-2"
                style={{ color: '#D4AF37' }}
              >
                :
              </div>
              <FlipDigit value={time.minutes} label="Min" />
              <div
                className="flex flex-col justify-center text-xl md:text-2xl font-light pt-2"
                style={{ color: '#D4AF37' }}
              >
                :
              </div>
              <FlipDigit value={time.seconds} label="Sec" />
            </div>
          </motion.div>
        </section>

        {/* ── EVENTS ──────────────────────────────── */}
        <section className="py-20 md:py-24 px-4" style={{ background: 'white' }}>
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 md:mb-16"
            >
              <p
                className="font-sans text-[10px] md:text-xs uppercase tracking-[0.5em] mb-3"
                style={{ color: '#D4AF37' }}
              >
                Royal Programme
              </p>
              <h2 className="text-3xl md:text-4xl font-light" style={{ color: '#3A0A14' }}>
                The Events
              </h2>
              <MughalDivider />
            </motion.div>
            <div className="space-y-6">
              {events.map((ev, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="p-6 md:p-8 relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #FFF9F0, #FFFBF5)',
                    border: '1px solid #E8D09A',
                  }}
                >
                  <div
                    className="absolute top-0 right-0 w-12 h-12 pointer-events-none opacity-20"
                    style={{
                      backgroundImage: 'radial-gradient(circle, #D4AF37, transparent)',
                      backgroundSize: '100%',
                    }}
                  />
                  <p
                    className="font-sans text-[10px] md:text-xs uppercase tracking-widest mb-2"
                    style={{ color: '#D4AF37' }}
                  >
                    ✦ Event {i + 1} ✦
                  </p>
                  <h3 className="text-xl md:text-2xl font-light mb-2" style={{ color: '#3A0A14' }}>
                    {ev.name}
                  </h3>
                  {ev.description && (
                    <p
                      className="font-sans text-xs md:text-sm mb-4 leading-relaxed"
                      style={{ color: '#8A6A5A' }}
                    >
                      {ev.description}
                    </p>
                  )}
                  <div
                    className="flex flex-wrap gap-4 font-sans text-[10px] md:text-xs"
                    style={{ color: '#B0906A' }}
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
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 border text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all duration-300 hover:bg-[#D4AF37] hover:text-[#3A0A14] hover:border-[#D4AF37]"
                    style={{ borderColor: '#E8D09A', color: '#D4AF37' }}
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
          <section className="py-20 md:py-24 px-4" style={{ background: '#FFF9F0' }}>
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12 md:mb-14"
              >
                <h2 className="text-3xl md:text-4xl font-light" style={{ color: '#3A0A14' }}>
                  Royal Portraits
                </h2>
              </motion.div>
              <div className="columns-2 md:columns-3 gap-3 md:gap-4 space-y-3 md:space-y-4">
                {gallery.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="overflow-hidden"
                    style={{ breakInside: 'avoid', border: '2px solid #E8D09A' }}
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
          className="py-16 md:py-20 text-center px-4"
          style={{ background: 'linear-gradient(160deg, #1A0008, #3A0A14)' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Crown className="w-8 h-8 mx-auto mb-6" style={{ color: '#D4AF37' }} />
            <h2 className="text-2xl md:text-3xl font-light mb-2" style={{ color: '#FFFBF0' }}>
              Your Grace Honours Us
            </h2>
            <p className="font-sans text-xs md:text-sm mb-10" style={{ color: '#806060' }}>
              {venue}
            </p>
            {invitationId && <RSVPModal invitationId={invitationId} inline={inline} />}
          </motion.div>
        </section>
      </div>
    </>
  )
}
