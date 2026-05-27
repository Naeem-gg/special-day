'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock, Star, Diamond, Crown, ChevronDown, Calendar, Map as MapIcon } from 'lucide-react'
import type { StyleProps } from './types'
import RSVPModal from '@/components/invitation/RSVPModal'
import PremiumCountdown from '@/components/invitation/PremiumCountdown'

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
            boxShadow: '0 0 10px #fff, 0 0 20px #fff',
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 0.5],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 5,
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
  tier,
  ourStory,
  mapUrl,
  inline,
}: StyleProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const fmt = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const parseEventDate = (dateStr?: string) => {
    if (!dateStr) return null
    const d = new Date(dateStr)
    return isNaN(d.getTime()) ? null : d
  }

  if (!mounted) return <div className="min-h-screen bg-black" />

  return (
    <>
      <style>{`
        @keyframes shine-btn {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .platinum-text {
          background: linear-gradient(135deg, #f5f5f7 0%, #ffffff 50%, #a2a2a6 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .diamond-glow {
          text-shadow: 0 0 15px rgba(255, 255, 255, 0.15), 0 0 30px rgba(255, 255, 255, 0.05);
        }
        .glass-luxury {
          background: rgba(10, 10, 10, 0.55);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.07);
        }
        .card-luxury {
          background: linear-gradient(135deg, rgba(20, 20, 20, 0.7) 0%, rgba(10, 10, 10, 0.9) 100%);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.05), 0 10px 30px rgba(0, 0, 0, 0.5);
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .card-luxury:hover {
          border-color: rgba(255, 255, 255, 0.18);
          box-shadow: 0 20px 40px rgba(255, 255, 255, 0.04), 0 1px 15px rgba(255, 255, 255, 0.05) inset;
        }
        .shine-hover-btn {
          position: relative;
          overflow: hidden;
        }
        .shine-hover-btn::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 50%; height: 100%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent);
          transform: skewX(-25deg);
          transition: 0.75s;
        }
        .shine-hover-btn:hover::after {
          left: 150%;
        }
      `}</style>

      <div
        className="min-h-screen bg-[#050505] text-white overflow-hidden relative selection:bg-white/10 selection:text-white"
        style={{ fontFamily: 'var(--font-cormorant), serif' }}
      >
        {/* Luxury Outer Frame */}
        {!isThumbnail && (
          <div className="absolute inset-4 md:inset-8 border border-white/5 pointer-events-none z-40 rounded-sm">
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/20" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/20" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/20" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/20" />
          </div>
        )}

        {/* --- HERO --- */}
        <section
          className={`relative flex flex-col items-center justify-center text-center px-6 ${
            isThumbnail ? 'min-h-[812px]' : inline ? 'min-h-[700px]' : 'min-h-screen'
          }`}
        >
          <DiamondSparkle />

          {/* Video backdrop with refined overlays */}
          {!isThumbnail && (
            <div className="absolute inset-0 z-0 pointer-events-none">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
                style={{ opacity: 0.28, mixBlendMode: 'screen' }}
              >
                <source src="/videos/rings-invite.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#050505]/40 to-[#050505]" />
            </div>
          )}

          {/* Platinum Geometric Rotating Accent lines */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
              className="w-[110%] aspect-square border border-white max-w-[1100px] rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[85%] aspect-square border border-white max-w-[850px] rounded-full"
            />
            <motion.div
              animate={{ rotate: 180 }}
              transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[60%] aspect-square border border-dashed border-white max-w-[600px] rounded-full"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 max-w-4xl px-4"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="mb-8"
            >
              <Crown size={52} className="mx-auto text-white opacity-85" strokeWidth={1} />
            </motion.div>

            <h2
              className="text-[10px] md:text-xs uppercase tracking-[0.7em] mb-12 text-zinc-500 font-bold"
              style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
            >
              The Royal Union Of
            </h2>

            <h1
              className="text-5xl sm:text-6xl md:text-8xl font-light mb-4 tracking-[0.15em] uppercase platinum-text diamond-glow font-cinzel leading-tight"
            >
              {brideName}
            </h1>

            <div className="flex items-center justify-center gap-6 my-10">
              <div className="h-[0.5px] w-16 bg-gradient-to-r from-transparent to-white/20" />
              <Diamond size={16} className="text-white/40 animate-spin-slow" />
              <div className="h-[0.5px] w-16 bg-gradient-to-l from-transparent to-white/20" />
            </div>

            <h1
              className="text-5xl sm:text-6xl md:text-8xl font-light mb-12 tracking-[0.15em] uppercase platinum-text diamond-glow font-cinzel leading-tight"
            >
              {groomName}
            </h1>

            <p
              className="text-xl md:text-3xl font-light mb-4 tracking-[0.25em] uppercase text-zinc-300"
              style={{ fontFamily: 'var(--font-cormorant), serif' }}
            >
              {fmt}
            </p>
            <div className="h-[1px] w-12 bg-white/20 mx-auto my-6" />
            <p
              className="text-[10px] md:text-xs tracking-[0.5em] text-zinc-500 uppercase font-semibold max-w-lg mx-auto leading-relaxed"
              style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
            >
              {venue}
            </p>
          </motion.div>

          {!isThumbnail && !inline && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
              <ChevronDown className="animate-bounce text-zinc-500" size={20} />
            </motion.div>
          )}
        </section>

        {/* --- COUNTDOWN --- */}
        <section className="py-24 text-center bg-black/60 border-y border-white/5 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto px-6"
          >
            <p
              className="text-[10px] md:text-xs uppercase tracking-[0.6em] text-zinc-500 mb-8 font-bold"
              style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
            >
              The Royal Countdown
            </p>
            <PremiumCountdown
              targetDate={date}
              tier={tier}
              theme={{
                primary: '#E5E4E2', // Platinum silver
                secondary: 'rgba(255, 255, 255, 0.02)', // Soft glass container
                accent: '#FFFFFF', // Pristine white
                text: '#A1A1AA', // Muted details
              }}
            />
          </motion.div>
        </section>

        {/* --- STORY --- */}
        {ourStory && (
          <section className="py-44 px-6 relative overflow-hidden bg-[#070707]">
            <DiamondSparkle />
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <Crown size={32} className="mx-auto mb-8 text-white/30" strokeWidth={1} />
              <h2
                className="text-2xl md:text-3xl font-light mb-14 tracking-[0.3em] uppercase text-zinc-400 font-cinzel"
              >
                The Legacy
              </h2>
              <div className="relative group px-4 md:px-12 py-14 border-y border-white/5 bg-black/20 backdrop-blur-xs rounded-lg">
                <div className="absolute inset-0 bg-white/2 blur-3xl rounded-full scale-110 pointer-events-none" />
                <p className="text-2xl md:text-4xl leading-relaxed font-light italic text-zinc-300 relative z-10">
                  &ldquo;{ourStory}&rdquo;
                </p>
              </div>
            </div>
          </section>
        )}

        {/* --- SCHEDULE / ITINERARY --- */}
        <section className="py-32 px-6 bg-black border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-24">
              <Diamond size={18} className="text-white/40 mx-auto mb-6 animate-pulse" />
              <h2
                className="text-3xl md:text-4xl font-light tracking-[0.35em] uppercase text-white mb-6 font-cinzel"
              >
                The Events Schedule
              </h2>
              <div className="w-12 h-px bg-zinc-800 mx-auto" />
            </div>

            <div className="space-y-8">
              {events.map((ev, i) => {
                const evDate = parseEventDate(ev.date) || date
                const dayNum = evDate.getDate()
                const weekday = evDate.toLocaleDateString('en-US', { weekday: 'long' })
                const month = evDate.toLocaleDateString('en-US', { month: 'short' })
                const year = evDate.getFullYear()

                const mapsUrl = ev.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.location)}`

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="card-luxury p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-stretch gap-6 md:gap-8"
                  >
                    {/* Event Date Badge Component */}
                    <div className="flex md:flex-col items-center justify-center bg-white/3 border border-white/5 rounded-xl p-4 md:py-6 md:px-5 text-center min-w-[110px] gap-3 md:gap-1.5 shadow-inner">
                      <span
                        className="text-[9px] tracking-[0.25em] uppercase text-zinc-500 font-bold block"
                        style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
                      >
                        {weekday.substring(0, 3)}
                      </span>
                      <span className="text-3xl md:text-4xl font-light text-white font-cinzel leading-none py-1 border-y md:border-y-0 md:py-0 border-white/10 px-2 md:px-0">
                        {dayNum}
                      </span>
                      <span
                        className="text-[9px] tracking-[0.18em] uppercase text-zinc-400 font-semibold block"
                        style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
                      >
                        {month} {year}
                      </span>
                    </div>

                    {/* Event Content Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3
                          className="text-2xl md:text-3xl font-light text-white tracking-wide mb-3 font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-400"
                        >
                          {ev.name}
                        </h3>
                        {ev.description && (
                          <p className="text-zinc-400 text-sm md:text-base mb-5 leading-relaxed font-light italic">
                            {ev.description}
                          </p>
                        )}
                      </div>

                      {/* Event Meta Row */}
                      <div className="flex flex-wrap gap-x-6 gap-y-3 items-center text-xs text-zinc-400 mt-auto pt-3 border-t border-white/5 font-sans">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-white/30" />
                          <span
                            className="tracking-[0.15em] uppercase text-[10px] text-zinc-500 font-bold"
                            style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
                          >
                            {ev.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-white/30" />
                          <span className="font-light truncate max-w-[280px]">
                            {ev.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Side */}
                    <div className="flex md:flex-col items-center md:items-end justify-center shrink-0">
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shine-hover-btn w-full md:w-auto text-center inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-200 hover:bg-white hover:text-black hover:border-white transition-all duration-500"
                        style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
                      >
                        <MapIcon size={12} />
                        View Map
                      </a>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* --- MAP / REGIONAL VENUE LOCATION --- */}
        {mapUrl && (
          <section className="py-28 px-6 bg-gradient-to-b from-black to-[#050505] text-center border-t border-white/5">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto p-10 md:p-14 border border-white/5 rounded-3xl bg-[#090909] relative overflow-hidden group shadow-2xl"
            >
              <div className="absolute inset-0 bg-radial-gradient from-white/2 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-white/10" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-white/10" />

              <div className="flex flex-col items-center gap-6 relative z-10">
                <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center bg-black/40">
                  <MapPin className="w-8 h-8 text-white/70" />
                </div>
                <div className="space-y-3">
                  <p
                    className="text-[9px] uppercase tracking-[0.5em] text-zinc-500 font-bold"
                    style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
                  >
                    The Main Venue
                  </p>
                  <h3 className="text-2xl md:text-3xl font-light text-white font-cinzel tracking-wider px-2">
                    {venue}
                  </h3>
                </div>
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shine-hover-btn px-10 py-4 mt-4 border border-white/20 bg-white/5 text-white hover:bg-white hover:text-black hover:border-white transition-all duration-500 text-[10px] font-bold uppercase tracking-[0.25em] rounded-lg shadow-lg"
                  style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
                >
                  Get Directions
                </a>
              </div>
            </motion.div>
          </section>
        )}

        {/* --- GALLERY --- */}
        {gallery.length > 0 && (
          <section className="py-40 px-4 bg-[#050505] relative border-t border-white/5">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-20">
                <h2
                  className="text-2xl md:text-3xl font-light tracking-[0.3em] uppercase text-zinc-300 font-cinzel"
                >
                  Royal Portraits
                </h2>
                <div className="w-10 h-px bg-zinc-800 mx-auto mt-4" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-4">
                {gallery.map((img, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 0.98, filter: 'brightness(1.15)' }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="aspect-square overflow-hidden bg-zinc-950 relative group rounded-xl border border-white/5"
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 transition-all duration-1000 rounded-xl" />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* --- RSVP --- */}
        <section className="py-48 px-6 text-center relative overflow-hidden bg-black border-t border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
          <div className="max-w-4xl mx-auto relative z-10">
            <Crown size={42} className="mx-auto mb-12 text-white/30" strokeWidth={1} />
            <h2
              className="text-4xl md:text-6xl font-light mb-16 italic text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400 font-cinzel tracking-wide"
            >
              Secure Your Invitation
            </h2>

            {!isPreview && invitationId && tier !== 'basic' && (
              <div className="inline-block scale-105 md:scale-110">
                <RSVPModal
                  invitationId={invitationId}
                  className="relative z-10"
                  buttonClassName="shine-hover-btn px-12 py-4 border border-white/20 bg-white/5 text-white hover:bg-white hover:text-black hover:border-white transition-all duration-500 text-[11px] font-bold uppercase tracking-[0.25em] rounded-lg shadow-lg"
                />
              </div>
            )}

            <div
              className="mt-32 text-[8px] md:text-[9px] tracking-[1.2em] text-zinc-600 uppercase font-bold"
              style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
            >
              DNvites Diamond Series • Limited Edition
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
