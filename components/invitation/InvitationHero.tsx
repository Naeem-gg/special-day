"use client";

import { motion } from "framer-motion";

interface InvitationHeroProps {
  brideName: string;
  groomName: string;
  date: Date;
  tier?: string;
}

const letterAnimation = {
  initial: { y: 400, opacity: 0 },
  animate: { y: 0, opacity: 1 },
};

export default function InvitationHero({ brideName, groomName, date, tier = "basic" }: InvitationHeroProps) {
  const isPremium = tier === "premium" || tier === "standard";

  return (
    <section className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-[#faf9f6]">
      {/* Decorative SVG Motif (Premium) */}
      {isPremium && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center"
        >
          <svg width="600" height="600" viewBox="0 0 100 100" className="opacity-10 stroke-primary fill-none">
            <motion.path
              d="M10,50 Q50,0 90,50 Q50,100 10,50"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
            <motion.path
              d="M30,50 Q50,20 70,50 Q50,80 30,50"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 4, ease: "easeInOut", delay: 1 }}
            />
          </svg>
        </motion.div>
      )}

      <motion.div
        className="z-10 px-4"
      >
        <motion.span
          initial={{ opacity: 0, letterSpacing: "0.5em" }}
          animate={{ opacity: 1, letterSpacing: "0.3em" }}
          transition={{ duration: 1.5 }}
          className="text-sm uppercase text-gray-500 mb-8 block font-medium"
        >
          We Are Getting Married
        </motion.span>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-12">
          <div className="overflow-hidden py-2">
            <motion.h1
              initial="initial"
              animate="animate"
              transition={{ staggerChildren: 0.05, delayChildren: 0.5 }}
              className="text-[15vw] md:text-9xl font-serif font-light text-gray-900 leading-tight flex flex-wrap justify-center"
            >
              {brideName.split("").map((char, i) => (
                <motion.span key={i} variants={letterAnimation} transition={{ duration: 1, ease: [0.6, 0.01, -0.05, 0.95] }}>
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.h1>
          </div>

          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 1, type: "spring" }}
            className="text-4xl md:text-6xl font-serif text-gray-300 italic"
          >
            &
          </motion.span>

          <div className="overflow-hidden py-2">
            <motion.h1
              initial="initial"
              animate="animate"
              transition={{ staggerChildren: 0.05, delayChildren: 1 }}
              className="text-[15vw] md:text-9xl font-serif font-light text-gray-900 leading-tight flex flex-wrap justify-center"
            >
              {groomName.split("").map((char, i) => (
                <motion.span key={i} variants={letterAnimation} transition={{ duration: 1, ease: [0.6, 0.01, -0.05, 0.95] }}>
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.h1>
          </div>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 2, duration: 1.5, ease: "easeInOut" }}
          className="h-px w-48 bg-gray-300 mx-auto mb-10"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="text-xl md:text-3xl font-serif text-gray-600 tracking-wide"
        >
          {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </motion.p>
      </motion.div>

      {/* Decorative background parallax (Premium) */}
      {isPremium && (
        <motion.div
          style={{ y: 0 }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 1, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-10 right-10 w-64 h-64 opacity-5 pointer-events-none"
        >
          <img src="https://www.transparenttextures.com/patterns/natural-paper.png" alt="" className="w-full h-full mix-blend-multiply" />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold">Explore</span>
          <motion.div
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-px h-20 bg-linear-to-b from-primary/40 to-transparent origin-top"
          />
        </div>
      </motion.div>
    </section>
  );
}
