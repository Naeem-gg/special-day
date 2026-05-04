'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { DNvitesLogo } from '@/components/branding/DNvitesLogo'

export function Watermark() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 1 }}
      className="w-full py-12 flex flex-col items-center justify-center gap-4 bg-transparent pointer-events-none select-none"
    >
      <div className="flex items-center gap-2 text-xs font-medium tracking-[0.3em] uppercase text-gray-400/60">
        <span>Made with</span>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Heart size={14} className="fill-rose-400 text-rose-400" />
        </motion.div>
        <span>on</span>
      </div>
      <div className="scale-75 opacity-40 grayscale contrast-125">
        <DNvitesLogo />
      </div>
      <p className="text-[10px] font-medium tracking-widest uppercase text-gray-500/40">
        Create your own at dnvites.com
      </p>
    </motion.div>
  )
}
