'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PremiumCountdownProps {
  targetDate: Date
  tier?: 'basic' | 'standard' | 'premium'
  theme?: {
    primary?: string
    secondary?: string
    accent?: string
    text?: string
    bg?: string
  }
}

export default function PremiumCountdown({
  targetDate,
  tier = 'basic',
  theme = {},
}: PremiumCountdownProps) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const tick = () => {
      const difference = Math.max(0, targetDate.getTime() - Date.now())
      setTime({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      })
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  if (!isMounted) return null

  const {
    primary = '#B87333',
    secondary = '#1A3C34',
    accent = '#D4AF37',
    text = '#F0EAD6',
    bg = 'transparent',
  } = theme

  const units = [
    { label: 'Days', value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Minutes', value: time.minutes },
    { label: 'Seconds', value: time.seconds },
  ]

  if (tier === 'premium') {
    return (
      <div className="relative py-10 px-4 overflow-hidden" style={{ background: bg }}>
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] rounded-full opacity-20"
            style={{ 
              background: `radial-gradient(circle, ${primary}22 0%, transparent 70%)`
            }}
          />
        </div>

        <div className="relative z-10 flex flex-wrap justify-center gap-6 md:gap-12">
          {units.map((unit, idx) => (
            <motion.div
              key={unit.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="flex flex-col items-center group"
            >
              <div className="relative">
                {/* Ornate corner pieces for premium */}
                <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: accent }} />
                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: accent }} />
                
                <div 
                  className="w-20 h-24 md:w-28 md:h-32 flex items-center justify-center overflow-hidden relative shadow-2xl transition-transform duration-500 group-hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${secondary} 0%, #000 100%)`,
                    border: `1px solid ${accent}44`,
                    borderRadius: '4px'
                  }}
                >
                  {/* Glass reflection effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
                  
                  {/* Central line for flip-style look */}
                  <div className="absolute top-1/2 left-0 w-full h-px bg-white/10 z-20" />

                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={unit.value}
                      initial={{ rotateX: 90, opacity: 0 }}
                      animate={{ rotateX: 0, opacity: 1 }}
                      exit={{ rotateX: -90, opacity: 0 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 100,
                        damping: 10,
                        duration: 0.5 
                      }}
                      className="text-4xl md:text-6xl font-light tracking-tighter"
                      style={{ 
                        color: accent,
                        textShadow: `0 0 15px ${accent}66`,
                        perspective: '1000px'
                      }}
                    >
                      {String(unit.value).padStart(2, '0')}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="mt-4 text-[10px] md:text-xs uppercase tracking-[0.4em] font-medium"
                style={{ color: primary }}
              >
                {unit.label}
              </motion.span>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  if (tier === 'standard') {
    return (
      <div className="py-8 px-4" style={{ background: bg }}>
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {units.map((unit, idx) => (
            <motion.div
              key={unit.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center"
            >
              <div 
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center relative backdrop-blur-md overflow-hidden"
                style={{
                  background: `${secondary}dd`,
                  border: `1px solid ${primary}44`,
                  boxShadow: `0 10px 25px -5px ${secondary}66`
                }}
              >
                {/* Subtle inner glow */}
                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] pointer-events-none" />
                
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={unit.value}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="text-2xl md:text-3xl font-medium"
                    style={{ color: text }}
                  >
                    {String(unit.value).padStart(2, '0')}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className="mt-2 text-[10px] uppercase tracking-widest opacity-60" style={{ color: text }}>
                {unit.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  // Basic tier
  return (
    <div className="py-6 px-4" style={{ background: bg }}>
      <div className="flex justify-center gap-6 md:gap-10">
        {units.map((unit) => (
          <div key={unit.label} className="flex flex-col items-center">
            <span 
              className="text-3xl md:text-4xl font-light"
              style={{ color: primary }}
            >
              {String(unit.value).padStart(2, '0')}
            </span>
            <span 
              className="text-[9px] uppercase tracking-widest mt-1 opacity-70"
              style={{ color: primary }}
            >
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
