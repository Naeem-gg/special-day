'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface EnvelopeIntroProps {
  brideName: string
  groomName: string
  variant?: string
  autoOpen?: boolean
  inline?: boolean
}

/* ─── Theme map ────────────────────────────────────────────────────────── */
const VARIANT_MAP = {
  'midnight-noir': {
    bg: '#0a0a0a',
    videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4',
    ambient: 'rgba(120,90,40,0.35)',
    envelopeMain: '#1A1A1A',
    envelopeFlap: '#262626',
    envelopeFlapInner: '#111111',
    sealTop: '#C8860A',
    sealMid: '#E8A020',
    sealBase: '#7A4A00',
    sealGlow: '#FFD700',
    sealShadow: 'rgba(212,175,55,0.9)',
    text: 'text-amber-200',
    initials: '#FFF8E1',
  },
  'royal-gold': {
    bg: '#1a050a',
    videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-red-fleshy-waves-1080-large.mp4',
    ambient: 'rgba(255,80,80,0.25)',
    envelopeMain: '#6B1A2B',
    envelopeFlap: '#8A253A',
    envelopeFlapInner: '#4A101C',
    sealTop: '#C8A800',
    sealMid: '#FFD700',
    sealBase: '#7A6400',
    sealGlow: '#FFE044',
    sealShadow: 'rgba(255,215,0,0.9)',
    text: 'text-yellow-200',
    initials: '#FFFDE7',
  },
  celestial: {
    bg: '#02030a',
    videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-galaxy-spinning-1610-large.mp4',
    ambient: 'rgba(80,80,255,0.25)',
    envelopeMain: '#0A0E2A',
    envelopeFlap: '#141A4A',
    envelopeFlapInner: '#05081A',
    sealTop: '#6C3BA6',
    sealMid: '#9B6DDB',
    sealBase: '#3A1A70',
    sealGlow: '#C0B0FF',
    sealShadow: 'rgba(160,140,255,0.9)',
    text: 'text-indigo-100',
    initials: '#EEE8FF',
  },
  'sacred-ivory': {
    bg: '#1a1408',
    videoSrc:
      'https://assets.mixkit.co/videos/preview/mixkit-autumn-leaves-on-a-golden-background-4075-large.mp4',
    ambient: 'rgba(212,175,55,0.3)',
    envelopeMain: '#FFFDF5',
    envelopeFlap: '#FFF8E7',
    envelopeFlapInner: '#FAF0DC',
    sealTop: '#B8750A',
    sealMid: '#D4AF37',
    sealBase: '#6B4200',
    sealGlow: '#FFD84D',
    sealShadow: 'rgba(212,175,55,0.9)',
    text: 'text-amber-100',
    initials: '#FFF8E1',
  },
  default: {
    bg: '#0a0a0a',
    videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4',
    ambient: 'rgba(120,90,40,0.3)',
    envelopeMain: '#f4f1ea',
    envelopeFlap: '#fcfbf9',
    envelopeFlapInner: '#ede9e0',
    sealTop: '#8B0000',
    sealMid: '#CC2200',
    sealBase: '#4A0000',
    sealGlow: '#FF6040',
    sealShadow: 'rgba(180,50,20,0.9)',
    text: 'text-amber-200',
    initials: '#FFF0E0',
  },
}

/* ─── Sparkle particle ─────────────────────────────────────────────────── */
interface Sparkle {
  id: number
  x: number
  y: number
  size: number
  angle: number
  dist: number
  color: string
}

function SparkleParticles({ active, color }: { active: boolean; color: string }) {
  const [mounted, setMounted] = useState(false)
  const particlesRef = useRef<Sparkle[]>([])

  useEffect(() => {
    const count = window.innerWidth < 768 ? 12 : 28
    particlesRef.current = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 50,
      y: 50,
      size: 3 + Math.random() * 5,
      angle: (i / count) * 360 + Math.random() * 13,
      dist: 80 + Math.random() * 180,
      color: i % 3 === 0 ? '#ffffff' : i % 3 === 1 ? color : '#fff8d0',
    }))
    setMounted(true)
  }, [color])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particlesRef.current.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, x: '50%', y: '50%', scale: 0 }}
          animate={
            active
              ? {
                  opacity: [0, 1, 1, 0],
                  x: `calc(50% + ${Math.cos((p.angle * Math.PI) / 180) * p.dist}px)`,
                  y: `calc(50% + ${Math.sin((p.angle * Math.PI) / 180) * p.dist}px)`,
                  scale: [0, 1.4, 1, 0],
                }
              : { opacity: 0 }
          }
          transition={{ duration: 1.2, ease: 'easeOut', delay: Math.random() * 0.3 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
        />
      ))}
    </div>
  )
}

/* ─── Ornate wax seal SVG ──────────────────────────────────────────────── */
function WaxSeal({
  theme,
  initials,
  glowing,
  cracking,
}: {
  theme: (typeof VARIANT_MAP)['default']
  initials: string
  glowing: boolean
  cracking: boolean
}) {
  return (
    <div className="relative w-full h-full">
      {/* Glow rings — animate outward on tap */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ scale: 1, opacity: 0 }}
          animate={
            glowing
              ? {
                  scale: [1, 2.5 + i * 0.8],
                  opacity: [0.7, 0],
                }
              : { scale: 1, opacity: 0 }
          }
          transition={{ duration: 1, delay: i * 0.18, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${theme.sealGlow}55 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* The seal itself */}
      <motion.svg
        viewBox="0 0 120 120"
        className="w-full h-full drop-shadow-2xl"
        animate={
          glowing
            ? {
                filter: `drop-shadow(0 0 24px ${theme.sealGlow}) drop-shadow(0 0 48px ${theme.sealGlow})`,
              }
            : {}
        }
        transition={{ duration: 0.5 }}
      >
        <defs>
          <radialGradient id={`sealGrad-${initials}`} cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor={theme.sealMid} />
            <stop offset="55%" stopColor={theme.sealTop} />
            <stop offset="100%" stopColor={theme.sealBase} />
          </radialGradient>
          <filter id="sealEmboss">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.5)" />
          </filter>
          <filter id="engraved">
            {/* True deboss: offset shadow to simulate depth */}
            <feFlood floodColor="rgba(0,0,0,0.6)" result="dark" />
            <feOffset dx="0" dy="-1" result="offsetDark" />
            <feComposite in="dark" in2="offsetDark" operator="over" />
            <feComposite in2="SourceAlpha" operator="in" result="darkShadow" />

            <feFlood floodColor="rgba(255,255,255,0.15)" result="light" />
            <feOffset dx="0" dy="1.5" result="offsetLight" />
            <feComposite in="light" in2="offsetLight" operator="over" />
            <feComposite in2="SourceAlpha" operator="in" result="lightHighlight" />

            <feMerge>
              <feMergeNode in="lightHighlight" />
              <feMergeNode in="darkShadow" />
            </feMerge>
          </filter>
          <filter id="insetShadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" result="blur" />
            <feOffset dx="0" dy="2.5" result="offsetBlur" />
            <feComposite
              in="SourceAlpha"
              in2="offsetBlur"
              operator="arithmetic"
              k2="-1"
              k3="1"
              result="shadowDiff"
            />
            <feFlood floodColor="rgba(0,0,0,0.9)" result="color" />
            <feComposite in="color" in2="shadowDiff" operator="in" result="shadow" />
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="shadow" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer scalloped edge — 16-point starburst */}
        {Array.from({ length: 16 }, (_, i) => {
          const a = (i / 16) * Math.PI * 2
          const aH = ((i + 0.5) / 16) * Math.PI * 2
          const r1 = 58,
            r2 = 51
          return (
            <g key={i}>
              <line
                x1={Number((60 + Math.cos(a) * r1).toFixed(3))}
                y1={Number((60 + Math.sin(a) * r1).toFixed(3))}
                x2={Number((60 + Math.cos(aH) * r2).toFixed(3))}
                y2={Number((60 + Math.sin(aH) * r2).toFixed(3))}
                stroke={theme.sealTop}
                strokeWidth="0"
              />
            </g>
          )
        })}
        <circle
          cx="60"
          cy="60"
          r="57"
          fill={`url(#sealGrad-${initials})`}
          filter="url(#sealEmboss)"
        />

        {/* Scalloped outer ring */}
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i / 24) * Math.PI * 2
          const r = 56
          return (
            <circle
              key={i}
              cx={Number((60 + Math.cos(a) * r).toFixed(3))}
              cy={Number((60 + Math.sin(a) * r).toFixed(3))}
              r="4.5"
              fill={theme.sealTop}
              opacity="0.9"
            />
          )
        })}

        {/* Inner ring band */}
        <circle
          cx="60"
          cy="60"
          r="44"
          fill="none"
          stroke={theme.sealMid}
          strokeWidth="1.5"
          opacity="0.6"
        />
        <circle
          cx="60"
          cy="60"
          r="38"
          fill="none"
          stroke={theme.sealMid}
          strokeWidth="0.8"
          opacity="0.4"
        />

        {/* Inner circle background */}
        <circle cx="60" cy="60" r="36" fill={theme.sealBase} opacity="0.5" />

        {/* Decorative inner flourishes */}
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2
          return (
            <line
              key={i}
              x1={Number((60 + Math.cos(a) * 20).toFixed(3))}
              y1={Number((60 + Math.sin(a) * 20).toFixed(3))}
              x2={Number((60 + Math.cos(a) * 34).toFixed(3))}
              y2={Number((60 + Math.sin(a) * 34).toFixed(3))}
              stroke={theme.sealMid}
              strokeWidth="1"
              opacity="0.5"
              strokeLinecap="round"
            />
          )
        })}

        {/* Initials — Sharp Engraved Look (No Blur) */}
        {/* 1. Top/Inner Shadow (The "Depression") */}
        <text
          x="60"
          y="68"
          textAnchor="middle"
          fontFamily="var(--font-cinzel), serif"
          fontSize="30"
          fontWeight="700"
          fill="rgba(0,0,0,0.4)"
          className="select-none"
          style={{ letterSpacing: '1px' }}
        >
          {initials}
        </text>

        {/* 2. Bottom Highlight (The "Edge") */}
        <text
          x="60"
          y="70"
          textAnchor="middle"
          fontFamily="var(--font-cinzel), serif"
          fontSize="30"
          fontWeight="700"
          fill="rgba(255,255,255,0.15)"
          className="select-none"
          style={{ letterSpacing: '1px' }}
        >
          {initials}
        </text>

        {/* 3. Main Face (Recessed) */}
        <text
          x="60"
          y="69"
          textAnchor="middle"
          fontFamily="var(--font-cinzel), serif"
          fontSize="30"
          fontWeight="700"
          fill={theme.initials}
          opacity="0.5"
          className="select-none"
          style={{ letterSpacing: '1px' }}
        >
          {initials}
        </text>

        {/* Crack lines on opening */}
        {cracking && (
          <g opacity="0.8">
            <motion.line
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3 }}
              x1="60"
              y1="20"
              x2="55"
              y2="50"
              stroke={theme.sealMid}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <motion.line
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              x1="85"
              y1="35"
              x2="68"
              y2="55"
              stroke={theme.sealMid}
              strokeWidth="1"
              strokeLinecap="round"
            />
            <motion.line
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              x1="35"
              y1="40"
              x2="52"
              y2="58"
              stroke={theme.sealMid}
              strokeWidth="1"
              strokeLinecap="round"
            />
          </g>
        )}
      </motion.svg>
    </div>
  )
}

/* ─── Main component ───────────────────────────────────────────────────── */
export default function EnvelopeIntro({
  brideName,
  groomName,
  variant = 'default',
  autoOpen = false,
  inline = false,
}: EnvelopeIntroProps) {
  const [step, setStep] = useState<
    'idle' | 'seal_glow' | 'cracking' | 'opening' | 'flash' | 'finished'
  >('idle')
  const theme = VARIANT_MAP[variant as keyof typeof VARIANT_MAP] ?? VARIANT_MAP.default
  const videoRef = useRef<HTMLVideoElement>(null)

  const initials = `${(brideName?.[0] ?? 'B').toUpperCase()}&${(groomName?.[0] ?? 'G').toUpperCase()}`

  const handleOpen = () => {
    if (step !== 'idle') return
    setStep('seal_glow')
    setTimeout(() => {
      setStep('cracking')
      setTimeout(() => {
        setStep('opening')
        setTimeout(() => {
          setStep('flash')
          setTimeout(() => setStep('finished'), 1400)
        }, 1700)
      }, 500)
    }, 900)
  }

  useEffect(() => {
    if (autoOpen && step === 'idle') {
      const t = setTimeout(handleOpen, 500)
      return () => clearTimeout(t)
    }
  }, [autoOpen, step])

  // Mute & play video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true
      videoRef.current.play().catch(() => {})
    }
  }, [])

  const isOpeningOrLater =
    step === 'opening' || step === 'flash' || step === 'finished' || step === 'cracking'

  return (
    <AnimatePresence>
      {step !== 'finished' && (
        <motion.div
          key="envelope-container"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.8, ease: 'easeOut' } }}
          className={`${inline ? 'absolute' : 'fixed'} inset-0 z-[100] flex items-center justify-center overflow-hidden cursor-pointer select-none`}
          style={{ background: theme.bg }}
          onClick={!autoOpen ? handleOpen : undefined}
        >
          {/* ── Video background ────────────────────────────── */}
          <video
            ref={videoRef}
            src={theme.videoSrc}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-20"
            style={{ pointerEvents: 'none' }}
          />

          {/* ── Radial ambient glow ──────────────────────────── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 70% 60% at 50% 50%, ${theme.ambient} 0%, transparent 70%)`,
            }}
          />

          {/* ── Sparkle particles on flash ───────────────────── */}
          <SparkleParticles active={step === 'flash'} color={theme.sealGlow} />

          {/* ── Full screen light burst ──────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={
              step === 'flash'
                ? { opacity: [0, 1, 0.7, 0], scale: [0.2, 3, 5] }
                : { opacity: 0, scale: 0 }
            }
            transition={{ duration: 1.2, ease: [0.2, 0, 0.4, 1] }}
            className="absolute inset-0 z-[110] pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, #ffffff 0%, ${theme.sealGlow}CC 30%, ${theme.ambient} 60%, transparent 80%)`,
              mixBlendMode: 'screen',
            }}
          />
          {/* Pure white overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={step === 'flash' ? { opacity: [0, 0.95, 0] } : { opacity: 0 }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
            className="absolute inset-0 z-[111] bg-white pointer-events-none"
          />

          {/* ── The Envelope ─────────────────────────────────── */}
          <div className="relative w-full max-w-xl px-4" style={{ perspective: '2000px' }}>
            <motion.div
              animate={
                isOpeningOrLater
                  ? { scale: 0.82, y: 90, rotateX: 18 }
                  : { scale: 1, y: 0, rotateX: 0 }
              }
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-sm shadow-[0_40px_80px_rgba(0,0,0,0.7)]"
              style={{
                aspectRatio: '4/3',
                transformStyle: 'preserve-3d',
                backgroundColor: theme.envelopeMain,
              }}
            >
              {/* Inner card that slides up */}
              <motion.div
                initial={{ y: 0, scale: 0.88 }}
                animate={isOpeningOrLater ? { y: -220, scale: 1.08 } : { y: 0, scale: 0.88 }}
                transition={{ delay: 0.5, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-x-6 md:inset-x-10 top-14 bottom-6 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center p-6 md:p-10 z-10"
                style={{ border: '1px solid rgba(212,175,55,0.2)' }}
              >
                <div className="absolute inset-3 border border-amber-200/50 pointer-events-none" />
                <div className="absolute inset-5 border border-amber-100/30 pointer-events-none" />
                <div className="text-center space-y-2 md:space-y-4">
                  <span
                    className="text-[9px] md:text-[11px] uppercase tracking-[0.5em] text-amber-600/70 font-medium"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    You are cordially invited
                  </span>
                  <div className="py-3 space-y-1">
                    <h2 className="text-3xl md:text-5xl font-serif text-gray-900 leading-tight">
                      {brideName}
                    </h2>
                    <span className="text-xl md:text-3xl font-serif text-amber-500 italic block">
                      &
                    </span>
                    <h2 className="text-3xl md:text-5xl font-serif text-gray-900 leading-tight">
                      {groomName}
                    </h2>
                  </div>
                  <p
                    className="text-[9px] uppercase tracking-[0.4em] text-gray-400"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    Wedding Celebration
                  </p>
                </div>
              </motion.div>

              {/* Static bottom & side flaps */}
              <div className="absolute inset-0 z-20 pointer-events-none">
                <svg viewBox="0 0 400 300" className="w-full h-full">
                  <path d="M0 300 L200 150 L400 300" fill={theme.envelopeFlapInner} />
                  <path d="M0 0 L200 150 L0 300" fill={theme.envelopeMain} />
                  <path d="M400 0 L200 150 L400 300" fill={theme.envelopeMain} />
                </svg>
              </div>

              {/* Top flap (animates open) */}
              <motion.div
                initial={{ rotateX: 0, zIndex: 30 }}
                animate={
                  isOpeningOrLater ? { rotateX: 180, zIndex: 5 } : { rotateX: 0, zIndex: 30 }
                }
                transition={{
                  rotateX: { duration: 1, ease: [0.4, 0, 0.2, 1] },
                  zIndex: { delay: 0.5, duration: 0 },
                }}
                style={{ transformOrigin: 'top', transformStyle: 'preserve-3d' }}
                className="absolute inset-x-0 top-0 h-1/2"
              >
                <svg
                  viewBox="0 0 400 150"
                  className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
                >
                  <path
                    d="M0 0 L200 150 L400 0 Z"
                    fill={theme.envelopeFlap}
                    stroke={theme.envelopeFlapInner}
                    strokeWidth="1"
                  />
                </svg>

                {/* ── WAX SEAL ── big, centered on flap crease ── */}
                <motion.div
                  animate={
                    step === 'seal_glow'
                      ? { scale: 1.08, y: -4 }
                      : step === 'cracking' || isOpeningOrLater
                        ? {
                            opacity: 0,
                            scale: 0.1,
                            filter: `brightness(8) drop-shadow(0 0 40px ${theme.sealGlow})`,
                          }
                        : { scale: 1, y: 0 }
                  }
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                  className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2"
                  style={{ width: '16rem', height: '16rem' }}
                >
                  <WaxSeal
                    theme={theme}
                    initials={initials}
                    glowing={step === 'seal_glow' || step === 'cracking'}
                    cracking={step === 'cracking'}
                  />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* ── "Tap to unlock" hint ─────────────────────── */}
            {step === 'idle' && !autoOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-14 flex flex-col items-center gap-3"
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="flex flex-col items-center gap-2"
                >
                  <p
                    className="font-serif italic tracking-[0.25em] uppercase text-sm"
                    style={{ color: 'rgba(255,255,255,0.65)' }}
                  >
                    Tap the seal to open
                  </p>
                  {/* Animated pulse dot */}
                  <motion.div
                    animate={{ scale: [1, 2.2, 1], opacity: [0.4, 0.9, 0.4] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-2 h-2 rounded-full"
                    style={{ background: theme.sealGlow, boxShadow: `0 0 12px ${theme.sealGlow}` }}
                  />
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
