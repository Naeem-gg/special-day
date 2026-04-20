"use client";

import { motion } from "framer-motion";

interface InvitationHeroProps {
  brideName: string;
  groomName: string;
  date: Date;
}

export default function InvitationHero({ brideName, groomName, date }: InvitationHeroProps) {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-[#faf9f6]">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="z-10"
      >
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-6 block font-medium"
        >
          We Are Getting Married
        </motion.span>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-8">
          <h1 className="text-6xl md:text-8xl font-serif font-light text-gray-900 leading-tight">
            {brideName}
          </h1>
          <span className="text-4xl md:text-6xl font-serif text-gray-400">&</span>
          <h1 className="text-6xl md:text-8xl font-serif font-light text-gray-900 leading-tight">
            {groomName}
          </h1>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 1.5, ease: "easeInOut" }}
          className="h-[1px] w-32 bg-gray-300 mx-auto mb-8"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="text-xl md:text-2xl font-serif text-gray-600"
        >
          {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </motion.p>
      </motion.div>

      {/* Decorative background elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
      >
        <div className="w-[120%] h-[120%] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-20" />
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center gap-2">
           <span className="text-xs uppercase tracking-widest text-gray-400">Scroll</span>
           <div className="w-[1px] h-12 bg-gradient-to-b from-gray-300 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
