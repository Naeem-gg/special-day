'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const phrases = ['Dearest Invites', 'Digital Invites', 'Divine Invitations', 'Dreamy Invites']

export function DNvitesLogo({ className = '' }: { className?: string }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div
      className={`inline-flex items-center gap-2.5 ${className}`}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Logo Image */}
      <motion.div
        animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="relative w-9 h-9 rounded-xl overflow-hidden shadow-sm border border-amber-100"
      >
        <img src="/logo.png" alt="DNvites Logo" className="w-full h-full object-cover" />
      </motion.div>

      {/* Brand text */}
      <div className="flex flex-col">
        <span
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          className="text-2xl font-bold tracking-tight leading-none"
        >
          <span className="text-[#D4AF37]">DN</span>
          <span className="text-[#C5A059]">vites</span>
        </span>
        <div className="h-4 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={index}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[9px] font-black uppercase tracking-[0.2em] text-[#8E6F3E]/60 whitespace-nowrap block"
            >
              {phrases[index]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
