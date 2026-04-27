'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface DoorIntroProps {
  brideName: string
  groomName: string
  variant?: string
  autoOpen?: boolean
  inline?: boolean
}

const DOOR_THEMES = {
  'royal-gold': {
    bg: '#1a050a',
    doorColor: '#2D0A12',
    ornamentColor: '#D4AF37',
    knobColor: '#FFD700',
    gradient: 'linear-gradient(135deg, #3D0E19 0%, #1A050A 100%)',
  },
  'midnight-noir': {
    bg: '#0a0a0a',
    doorColor: '#111111',
    ornamentColor: '#444444',
    knobColor: '#888888',
    gradient: 'linear-gradient(135deg, #1A1A1A 0%, #050505 100%)',
  },
  default: {
    bg: '#0f172a',
    doorColor: '#1e293b',
    ornamentColor: '#94a3b8',
    knobColor: '#cbd5e1',
    gradient: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
  },
}

export default function DoorIntro({
  brideName,
  groomName,
  variant = 'default',
  autoOpen = false,
  inline = false,
}: DoorIntroProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const theme = DOOR_THEMES[variant as keyof typeof DOOR_THEMES] || DOOR_THEMES.default

  const handleOpen = () => {
    setIsOpen(true)
    setTimeout(() => setIsFinished(true), 2500)
  }

  useEffect(() => {
    if (autoOpen && !isOpen) {
      const t = setTimeout(handleOpen, 1000)
      return () => clearTimeout(t)
    }
  }, [autoOpen, isOpen])

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          exit={{ opacity: 0, transition: { duration: 1 } }}
          className={`${inline ? 'absolute' : 'fixed'} inset-0 z-100 flex items-center justify-center overflow-hidden bg-black`}
        >
          {/* Background behind the doors */}
          <div className="absolute inset-0 bg-white" />

          {/* Left Door */}
          <motion.div
            initial={{ rotateY: 0 }}
            animate={isOpen ? { rotateY: -110, x: '-20%' } : { rotateY: 0 }}
            transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
            style={{ transformOrigin: 'left', transformStyle: 'preserve-3d' }}
            className="absolute left-0 top-0 w-1/2 h-full z-20 border-r border-black/20"
          >
            <div className="w-full h-full relative" style={{ background: theme.gradient }}>
              {/* Ornate Panels */}
              <div
                className="absolute inset-8 border-4 border-double"
                style={{ borderColor: theme.ornamentColor + '33' }}
              />
              <div
                className="absolute inset-16 border-2"
                style={{ borderColor: theme.ornamentColor + '22' }}
              />

              {/* Handle/Knob */}
              <div
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-24 rounded-full shadow-2xl flex items-center justify-center"
                style={{ background: theme.knobColor }}
              >
                <div className="w-4 h-12 bg-black/20 rounded-full blur-[1px]" />
              </div>
            </div>
          </motion.div>

          {/* Right Door */}
          <motion.div
            initial={{ rotateY: 0 }}
            animate={isOpen ? { rotateY: 110, x: '20%' } : { rotateY: 0 }}
            transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
            style={{ transformOrigin: 'right', transformStyle: 'preserve-3d' }}
            className="absolute right-0 top-0 w-1/2 h-full z-20 border-l border-black/20"
          >
            <div className="w-full h-full relative" style={{ background: theme.gradient }}>
              {/* Ornate Panels */}
              <div
                className="absolute inset-8 border-4 border-double"
                style={{ borderColor: theme.ornamentColor + '33' }}
              />
              <div
                className="absolute inset-16 border-2"
                style={{ borderColor: theme.ornamentColor + '22' }}
              />

              {/* Handle/Knob */}
              <div
                className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-24 rounded-full shadow-2xl flex items-center justify-center"
                style={{ background: theme.knobColor }}
              >
                <div className="w-4 h-12 bg-black/20 rounded-full blur-[1px]" />
              </div>
            </div>
          </motion.div>

          {/* Light Burst from behind */}
          <motion.div
            animate={isOpen ? { opacity: [0, 1, 0], scale: [0.8, 1.5, 2] } : { opacity: 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="absolute inset-0 z-10 bg-white blur-3xl pointer-events-none"
          />

          {/* Interaction Hint */}
          {!isOpen && !autoOpen && (
            <motion.div
              onClick={handleOpen}
              className="absolute inset-0 z-30 cursor-pointer flex flex-col items-center justify-center text-white"
            >
              <motion.p
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-xl font-serif tracking-[0.3em] uppercase"
              >
                Tap to Enter
              </motion.p>
              <div className="mt-4 w-px h-16 bg-white/30" />
            </motion.div>
          )}

          {/* Center Initials (floating in middle before opening) */}
          {!isOpen && (
            <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center">
              <div
                className="w-24 h-24 rounded-full border-2 flex items-center justify-center bg-black/40 backdrop-blur-md"
                style={{ borderColor: theme.ornamentColor }}
              >
                <span className="text-2xl font-serif text-white uppercase tracking-tighter">
                  {brideName[0]}&{groomName[0]}
                </span>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
