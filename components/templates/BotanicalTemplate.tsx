'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock, ExternalLink, Share2, ChevronDown, Map as MapIcon } from 'lucide-react'
import type { StyleProps } from './types'
import RSVPModal from '@/components/invitation/RSVPModal'
import BackgroundMusic from '@/components/invitation/BackgroundMusic'

/* ── SVG Vine drawing ──────────────────────────────────── */
function VineDivider() {
  return (
    <div className="flex justify-center my-8">
      <svg width="320" height="40" viewBox="0 0 320 40" fill="none">
        <motion.path
          d="M0 20 Q40 5, 80 20 Q120 35, 160 20 Q200 5, 240 20 Q280 35, 320 20"
          stroke="#5A8A4A"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="160"
          cy="20"
          r="4"
          fill="#5A8A4A"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
        />
        <motion.circle
          cx="80"
          cy="20"
          r="2.5"
          fill="#8FAF7E"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.3 }}
        />
        <motion.circle
          cx="240"
          cy="20"
          r="2.5"
          fill="#8FAF7E"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.6 }}
        />
      </svg>
    </div>
  )
}

/* ── Floating leaf ─────────────────────────────────────── */
function Leaf({ style }: { style: React.CSSProperties }) {
  return (
    <div className="absolute pointer-events-none select-none" style={style}>
      <svg width="20" height="26" viewBox="0 0 20 26" fill="none">
        <path d="M10 2 C16 8, 18 16, 10 24 C6 16, 4 8, 10 2Z" fill="#2D5A27" opacity="0.18" />
        <path d="M10 3 L10 23" stroke="#2D5A27" strokeWidth="0.8" opacity="0.2" />
      </svg>
    </div>
  )
}

export default function BotanicalTemplate({
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
  ourStory,
  mapUrl,
}: StyleProps) {
  const [leaves, setLeaves] = useState<React.CSSProperties[]>([])
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const count = isThumbnail ? 4 : window.innerWidth < 768 ? 8 : 14
    setLeaves(
      Array.from({ length: count }, () => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        transform: `rotate(${Math.random() * 360}deg) scale(${0.7 + Math.random() * 1})`,
      }))
    )
  }, [isThumbnail])

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
    <div
      className={isThumbnail ? 'min-h-full' : 'min-h-screen'}
      style={{ fontFamily: "'Playfair Display', Georgia, serif", background: '#FAFCF8' }}
    >
      {musicUrl && !isThumbnail && <BackgroundMusic url={musicUrl} />}

      {/* ── HERO ─────────────────────────────────── */}
      <section
        className={`relative flex flex-col items-center justify-center text-center overflow-hidden px-6 ${isThumbnail ? 'min-h-[812px]' : 'min-h-screen'}`}
        style={{ background: 'linear-gradient(160deg, #F2F7EE 0%, #E8F0E2 50%, #F5F8F2 100%)' }}
      >
        {leaves.map((s, i) => (
          <Leaf key={i} style={s} />
        ))}

        {/* SVG vine border top */}
        <div className="absolute top-0 left-0 right-0 pointer-events-none">
          <svg width="100%" height="60" viewBox="0 0 1200 60" preserveAspectRatio="none">
            <motion.path
              d="M0 30 Q100 5, 200 30 Q300 55, 400 30 Q500 5, 600 30 Q700 55, 800 30 Q900 5, 1000 30 Q1100 55, 1200 30"
              stroke="#2D5A27"
              strokeWidth="1"
              fill="none"
              opacity="0.25"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, delay: 0.5 }}
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="w-16 h-16 mx-auto mb-8 flex items-center justify-center rounded-full"
            style={{
              background: 'rgba(45, 90, 39, 0.08)',
              border: '1px solid rgba(45,90,39,0.15)',
            }}
          >
            <span className="text-2xl">🌿</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-sans text-xs uppercase tracking-[0.45em] mb-8"
            style={{ color: '#5A8A4A' }}
          >
            A Garden Wedding Celebration
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.7 }}
            className="font-light leading-none mb-4"
            style={{ color: '#1A3A14', fontSize: isThumbnail ? '3rem' : 'clamp(3rem, 11vw, 8rem)' }}
          >
            {brideName}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-2xl font-light italic my-3"
            style={{ color: '#5A8A4A' }}
          >
            &amp;
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1 }}
            className="font-light leading-none mb-8"
            style={{ color: '#1A3A14', fontSize: isThumbnail ? '3rem' : 'clamp(3rem, 11vw, 8rem)' }}
          >
            {groomName}
          </motion.h1>

          <VineDivider />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5 }}
            className="font-sans text-base tracking-widest"
            style={{ color: '#5A8A4A' }}
          >
            {fmt}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            className="font-sans text-sm mt-2"
            style={{ color: '#8FAF7E' }}
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
            <ChevronDown className="w-5 h-5" style={{ color: '#5A8A4A' }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ── COUNTDOWN ───────────────────────────── */}
      <section className="py-20 text-center" style={{ background: 'white' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p
            className="font-sans text-xs uppercase tracking-[0.4em] mb-10"
            style={{ color: '#5A8A4A' }}
          >
            Days Until We Say "I Do"
          </p>
          <div className="flex gap-6 md:gap-12 justify-center flex-wrap">
            {[
              { label: 'Days', v: time.days },
              { label: 'Hours', v: time.hours },
              { label: 'Minutes', v: time.minutes },
              { label: 'Seconds', v: time.seconds },
            ].map((i) => (
              <div key={i.label} className="flex flex-col items-center gap-2">
                <div
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-light transition-all duration-500"
                  style={{
                    background: 'linear-gradient(135deg, #F2F7EE, #E0EDD8)',
                    color: '#1A3A14',
                    boxShadow: '0 4px 20px rgba(45,90,39,0.12)',
                  }}
                >
                  {String(i.v).padStart(2, '0')}
                </div>
                <span
                  className="font-sans text-[10px] uppercase tracking-widest"
                  style={{ color: '#8FAF7E' }}
                >
                  {i.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── OUR STORY ───────────────────────────── */}
      {ourStory && (
        <section className="py-24 px-6 text-center" style={{ background: '#F2F7EE' }}>
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-3xl mb-4 block">🍃</span>
              <p
                className="font-sans text-xs uppercase tracking-[0.4em] mb-6"
                style={{ color: '#5A8A4A' }}
              >
                The Journey of Us
              </p>
              <h2 className="text-4xl font-light mb-8" style={{ color: '#1A3A14' }}>
                Our Love Story
              </h2>
              <p className="text-lg leading-relaxed font-serif italic" style={{ color: '#2D5A27' }}>
                {ourStory}
              </p>
              <div className="mt-10 flex justify-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#5A8A4A]" />
                <div className="w-2 h-2 rounded-full bg-[#8FAF7E]" />
                <div className="w-2 h-2 rounded-full bg-[#5A8A4A]" />
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── MAP / LOCATION ───────────────────────── */}
      {mapUrl && (
        <section className="py-24 px-6 text-center" style={{ background: 'white' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto p-12 rounded-[3rem] border border-[#C5DEB8] bg-[#F2F7EE]/30"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                <MapIcon className="w-8 h-8 text-[#2D5A27]" />
              </div>
              <div className="space-y-2">
                <p
                  className="font-sans text-xs uppercase tracking-[0.4em]"
                  style={{ color: '#5A8A4A' }}
                >
                  The Venue
                </p>
                <h3 className="text-3xl font-light" style={{ color: '#1A3A14' }}>
                  How to Reach Us
                </h3>
                <p className="text-muted-foreground mt-2">{venue}</p>
              </div>
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 px-10 py-4 bg-[#2D5A27] text-white rounded-full font-sans text-sm font-bold uppercase tracking-widest shadow-lg shadow-[#2D5A27]/20 hover:bg-[#1A3A14] transition-colors flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" /> View Venue on Maps
              </a>
            </div>
          </motion.div>
        </section>
      )}

      {/* ── EVENTS ──────────────────────────────── */}
      <section className="py-24 px-4" style={{ background: '#F2F7EE' }}>
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p
              className="font-sans text-xs uppercase tracking-[0.4em] mb-3"
              style={{ color: '#5A8A4A' }}
            >
              What's Planned
            </p>
            <h2 className="text-4xl font-light" style={{ color: '#1A3A14' }}>
              Garden Events
            </h2>
            <VineDivider />
          </motion.div>
          <div className="space-y-6">
            {events.map((ev, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="p-8 rounded-3xl border"
                style={{ background: 'white', borderColor: '#C5DEB8' }}
              >
                <div className="flex items-start gap-5">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #2D5A27, #5A8A4A)',
                      color: 'white',
                    }}
                  >
                    <span className="font-sans text-sm font-bold">{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-light mb-2" style={{ color: '#1A3A14' }}>
                      {ev.name}
                    </h3>
                    {ev.description && (
                      <p className="font-sans text-sm mb-4" style={{ color: '#5A8A4A' }}>
                        {ev.description}
                      </p>
                    )}
                    <div
                      className="flex flex-wrap gap-4 font-sans text-xs"
                      style={{ color: '#8FAF7E' }}
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

                    {/* Map Link */}
                    <div className="mt-4">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all duration-300 hover:bg-[#2D5A27] hover:text-white"
                        style={{ borderColor: '#C5DEB8', color: '#2D5A27' }}
                      >
                        <MapIcon className="w-3 h-3" />
                        Open in Maps
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ─────────────────────────────── */}
      {gallery.length > 0 && (
        <section className="py-24 px-4" style={{ background: 'white' }}>
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <h2 className="text-4xl font-light" style={{ color: '#1A3A14' }}>
                Our Story in Photos
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
                  className="overflow-hidden rounded-2xl border"
                  style={{ borderColor: '#C5DEB8', breakInside: 'avoid', willChange: 'opacity' }}
                >
                  <img
                    src={img.url}
                    alt=""
                    loading="lazy"
                    className="w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FOOTER ──────────────────────────────── */}
      <section className="py-20 text-center" style={{ background: '#F2F7EE' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-4xl mb-6">🌿</div>
          <h2 className="text-3xl font-light mb-2" style={{ color: '#1A3A14' }}>
            Join Us in the Garden
          </h2>
          <p className="font-sans text-sm mb-10" style={{ color: '#8FAF7E' }}>
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
  )
}
