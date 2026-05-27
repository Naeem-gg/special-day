'use client'

import { motion } from 'framer-motion'

export function InvitationSkeleton() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Soft elegant ambient gold/platinum glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />

      {/* Rotating Background Ring Accents */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="w-[280px] h-[280px] border border-white rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[200px] h-[200px] border border-dashed border-white rounded-full"
        />
      </div>

      {/* Loader Container */}
      <div className="relative z-10 flex flex-col items-center space-y-6">
        <div className="relative w-20 h-20 flex items-center justify-center">
          {/* Pulsing ring outer */}
          <div className="absolute inset-0 rounded-full border border-white/10 animate-ping opacity-25" style={{ animationDuration: '2.5s' }} />
          <div className="absolute inset-2 rounded-full border border-white/5 animate-pulse" />
          
          {/* Minimal Crown/Emblem inside */}
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg
              className="w-9 h-9 text-white/80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </div>

        {/* Text Loader */}
        <div className="text-center space-y-2">
          <h2 
            className="text-zinc-200 font-serif italic text-lg tracking-[0.25em] uppercase animate-pulse"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Opening Invitation
          </h2>
          <p 
            className="text-zinc-500 text-[10px] tracking-[0.35em] uppercase font-bold"
            style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
          >
            Preparing your experience
          </p>
        </div>
      </div>
    </div>
  )
}
