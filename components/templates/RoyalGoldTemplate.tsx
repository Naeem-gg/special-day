'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock, Crown, ChevronDown, Map as MapIcon, Calendar, X } from 'lucide-react'
import type { StyleProps } from './types'
import RSVPModal from '@/components/invitation/RSVPModal'
import PremiumCountdown from '@/components/invitation/PremiumCountdown'

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

// Removed inline FlipDigit logic

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
  rsvpButtonText,
}: StyleProps) {
  const [sparkles, setSparkles] = useState<React.CSSProperties[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    setSparkles(
      Array.from({ length: 35 }, () => ({
        left: `${Math.random() * 100}%`,
        bottom: `-${Math.random() * 20}%`,
        width: `${Math.random() * 5 + 2}px`,
        height: `${Math.random() * 5 + 2}px`,
        animation: `floatGoldSparkles ${6 + Math.random() * 8}s ${Math.random() * 8}s infinite linear`,
      }))
    )
  }, [])

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
        .curtain { animation: curtainReveal 2.5s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        
        @keyframes royalShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .royal-text {
          background: linear-gradient(90deg, #A82C43 0%, #D4AF37 30%, #FFF8DC 50%, #D4AF37 70%, #A82C43 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: royalShimmer 5.5s linear infinite;
        }

        @keyframes floatGoldSparkles {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        .gold-sparkle {
          position: absolute;
          background: radial-gradient(circle, #FFF8DC 20%, #D4AF37 60%, transparent 100%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
        }
      `}</style>

      <div
        className={isThumbnail ? 'min-h-full' : 'min-h-screen'}
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {/* ── HERO ─────────────────────────────────── */}
        <section
          className={`relative flex flex-col items-center justify-center text-center overflow-hidden px-6 ${isThumbnail ? 'min-h-[812px]' : inline ? 'min-h-[700px]' : 'min-h-screen'}`}
          style={{ background: 'linear-gradient(160deg, #160007 0%, #2f0810 50%, #160007 100%)' }}
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

          {/* Sparkles */}
          {sparkles.map((style, i) => (
            <div key={i} className="gold-sparkle" style={style} />
          ))}

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
          style={{ background: 'linear-gradient(180deg, #160007 0%, #0d0003 100%)', borderTop: '1px solid rgba(212,175,55,0.15)', borderBottom: '1px solid rgba(212,175,55,0.15)' }}
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
              className="text-2xl md:text-3xl font-light mb-8 md:mb-10 text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Royal Countdown
            </h2>

            <PremiumCountdown
              targetDate={date}
              tier={tier}
              theme={{
                primary: '#D4AF37',
                secondary: '#1A0008',
                accent: '#FFF8DC',
                text: '#FFFBF0',
              }}
            />
          </motion.div>
        </section>

        {/* ── EVENTS ──────────────────────────────── */}
        <section className="py-20 md:py-24 px-4" style={{ background: '#0d0003' }}>
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
              <h2 className="text-3xl md:text-4xl font-light text-white">
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
                  className="p-6 md:p-8 relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(212,175,55,0.12)]"
                  style={{
                    background: 'linear-gradient(135deg, #1e0007 0%, #0d0003 100%)',
                    border: '1.5px solid #D4AF37',
                  }}
                >
                  <div className="flex-1">
                    {/* Removed Event Numbering */}
                    <h3
                      className="text-xl md:text-2xl font-light mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8DC] via-[#D4AF37] to-[#FFF8DC]"
                    >
                      {ev.name}
                    </h3>
                    {ev.description && (
                      <p
                        className="font-sans text-xs md:text-sm mb-4 leading-relaxed text-[#A08080]"
                      >
                        {ev.description}
                      </p>
                    )}
                    <div
                      className="flex flex-wrap gap-4 font-sans text-[10px] md:text-xs"
                      style={{ color: '#EBD09A' }}
                    >
                      {ev.date && !isNaN(new Date(ev.date).getTime()) && (
                        <span className="flex items-center gap-1 font-bold text-[#D4AF37]">
                          <Calendar className="w-3 h-3" />
                          {new Date(ev.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[#E0D0D0]">
                        <Clock className="w-3 h-3 text-[#D4AF37]" />
                        {ev.time}
                      </span>
                      <span className="flex items-center gap-1 text-[#E0D0D0]">
                        <MapPin className="w-3 h-3 text-[#D4AF37]" />
                        {ev.location}
                      </span>
                    </div>
                    <a
                      href={
                        ev.googleMapsUrl ||
                        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.location)}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 px-5 py-2 border rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all duration-300 bg-white/5 border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1a0005] hover:border-[#D4AF37]"
                    >
                      <MapIcon className="w-3 h-3" /> Open in Maps
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── GALLERY ─────────────────────────────── */}
        {gallery.length > 0 && (
          <section className="py-20 md:py-24 px-4 bg-[#160007]" style={{ borderTop: '1px solid rgba(212,175,55,0.15)' }}>
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12 md:mb-14"
              >
                <h2 className="text-3xl md:text-4xl font-light text-white">
                  Royal Portraits
                </h2>
                <MughalDivider />
              </motion.div>
              <div className="columns-2 md:columns-3 gap-3 md:gap-4 space-y-3 md:space-y-4">
                {gallery.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="overflow-hidden cursor-zoom-in rounded-xl transition-all duration-300 hover:scale-[1.03]"
                    style={{ breakInside: 'avoid', border: '1.5px solid #D4AF37' }}
                    onClick={() => setSelectedImage(img.url)}
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
          style={{ background: 'linear-gradient(160deg, #160007, #0d0003)' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Crown className="w-8 h-8 mx-auto mb-6" style={{ color: '#D4AF37' }} />
            <h2 className="text-2xl md:text-3xl font-light mb-2 text-white">
              Your Grace Honours Us
            </h2>
            <p className="font-sans text-xs md:text-sm mb-10 text-[#A08080]">
              {venue}
            </p>
            {invitationId && tier !== 'basic' && (
              <RSVPModal buttonText={rsvpButtonText || undefined}
                invitationId={invitationId}
                inline={inline}
                buttonClassName="bg-gradient-to-r from-[#D4AF37] via-[#FFF8DC] to-[#D4AF37] text-[#1A0008] font-semibold font-sans tracking-[0.25em] uppercase px-8 py-4 rounded-full text-[10px] md:text-xs shadow-[0_10px_25px_rgba(212,175,55,0.45)] hover:scale-105 transition-all duration-300"
              />
            )}
          </motion.div>
        </section>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-xl border border-[#D4AF37]"
                onClick={(e) => e.stopPropagation()}
              >
                <img src={selectedImage} alt="" className="w-full h-auto max-h-[85vh] object-contain" />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2 border border-white/20 hover:bg-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
