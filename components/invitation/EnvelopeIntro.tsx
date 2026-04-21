"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

interface EnvelopeIntroProps {
  brideName: string;
  groomName: string;
}

export default function EnvelopeIntro({ brideName, groomName }: EnvelopeIntroProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  if (isFinished) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, y: -100 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="fixed inset-0 z-100 flex items-center justify-center bg-[#fdfbf7] p-4 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="relative w-full max-w-lg aspect-4/3 flex items-center justify-center">

          {/* Main Envelope Body */}
          <div className="absolute inset-0 bg-[#f4f1ea] shadow-2xl rounded-sm">
            {/* Inner Content (The Card) */}
            <motion.div
              animate={isOpen ? { y: -120, scale: 0.95 } : { y: 0, scale: 0.8 }}
              transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
              onAnimationComplete={() => isOpen && setTimeout(() => setIsFinished(true), 1500)}
              className="absolute inset-x-4 md:inset-x-8 top-12 bottom-4 bg-white shadow-inner flex flex-col items-center justify-center p-6 md:p-8 border border-gray-100 z-10"
            >
              <div className="text-center space-y-3 md:space-y-4">
                <span className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] text-gray-400">You are invited to the wedding of</span>
                <div className="space-y-1">
                  <h2 className="text-xl md:text-3xl font-serif text-gray-900 leading-tight">{brideName}</h2>
                  <span className="text-base md:text-xl font-serif text-gray-300 italic">and</span>
                  <h2 className="text-xl md:text-3xl font-serif text-gray-900 leading-tight">{groomName}</h2>
                </div>
                <div className="pt-4">
                  <Heart className="w-6 h-6 text-primary/40 mx-auto fill-primary/10" />
                </div>
              </div>
            </motion.div>

            {/* Front Flaps (Static) */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-lg">
                <path d="M0 300 L200 150 L400 300" fill="#ede9e0" />
                <path d="M0 0 L200 150 L0 300" fill="#f4f1ea" />
                <path d="M400 0 L200 150 L400 300" fill="#f4f1ea" />
              </svg>
            </div>

            {/* Top Flap (Animated) */}
            <motion.div
              animate={isOpen ? { rotateX: 180 } : { rotateX: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{ transformOrigin: "top", perspective: "1000px" }}
              className="absolute inset-x-0 top-0 h-1/2 z-30"
            >
              <svg viewBox="0 0 400 150" className="w-full h-full drop-shadow-xl">
                <path d="M0 0 L200 150 L400 0 Z" fill="#f4f1ea" stroke="#ede9e0" strokeWidth="1" />
              </svg>

              {/* Wax Seal */}
              <motion.div
                animate={isOpen ? { opacity: 0, scale: 0.5 } : { opacity: 1, scale: 1 }}
                className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-red-800 rounded-full flex items-center justify-center shadow-lg border-2 border-red-900"
              >
                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white fill-white" />
                </div>
              </motion.div>
            </motion.div>
          </div>

          {!isOpen && (
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-center"
            >
              <p className="text-sm font-serif italic text-gray-500">Tap to Open</p>
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-1 bg-gray-400 rounded-full mx-auto mt-2"
              />
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
