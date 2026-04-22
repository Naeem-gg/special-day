"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EnvelopeIntroProps {
  brideName: string;
  groomName: string;
  variant?: string;
  autoOpen?: boolean;
}

const VARIANT_MAP = {
  "midnight-noir": {
    bg: "#0a0a0a",
    ambient: "rgba(120,90,40,0.3)",
    envelopeMain: "#1A1A1A",
    envelopeFlap: "#262626",
    envelopeFlapInner: "#111111",
    sealGlow: "rgba(212,175,55,1)",
    sealBg: "from-amber-600 to-amber-900",
    sealInner: "bg-amber-700/50",
    text: "text-amber-200",
  },
  "royal-gold": {
    bg: "#1a050a",
    ambient: "rgba(255,100,100,0.2)",
    envelopeMain: "#6B1A2B",
    envelopeFlap: "#8A253A",
    envelopeFlapInner: "#4A101C",
    sealGlow: "rgba(255,215,0,1)",
    sealBg: "from-yellow-500 to-yellow-800",
    sealInner: "bg-yellow-600/50",
    text: "text-yellow-200",
  },
  "celestial": {
    bg: "#02030a",
    ambient: "rgba(100,100,255,0.2)",
    envelopeMain: "#0A0E2A",
    envelopeFlap: "#141A4A",
    envelopeFlapInner: "#05081A",
    sealGlow: "rgba(192,192,255,1)",
    sealBg: "from-indigo-400 to-purple-800",
    sealInner: "bg-purple-600/50",
    text: "text-indigo-100",
  },
  "default": {
    bg: "#0a0a0a",
    ambient: "rgba(120,90,40,0.3)",
    envelopeMain: "#f4f1ea",
    envelopeFlap: "#fcfbf9",
    envelopeFlapInner: "#ede9e0",
    sealGlow: "rgba(212,175,55,1)",
    sealBg: "from-red-700 to-red-950",
    sealInner: "bg-red-800/50",
    text: "text-amber-200",
  }
};

export default function EnvelopeIntro({ brideName, groomName, variant = "default", autoOpen = false }: EnvelopeIntroProps) {
  const [step, setStep] = useState<"idle" | "seal_glow" | "opening" | "flash" | "finished">("idle");
  const theme = VARIANT_MAP[variant as keyof typeof VARIANT_MAP] || VARIANT_MAP.default;

  const handleOpen = () => {
    if (step !== "idle") return;
    setStep("seal_glow");

    // 1. Seal glows layer by layer
    setTimeout(() => {
      setStep("opening");
      
      // 2. Flap opens, card slides up
      setTimeout(() => {
        setStep("flash");
        
        // 3. Screen flashes with white light
        setTimeout(() => {
          setStep("finished");
        }, 1200);
      }, 1600);
    }, 800);
  };

  useEffect(() => {
    if (autoOpen && step === "idle") {
      const t = setTimeout(handleOpen, 400);
      return () => clearTimeout(t);
    }
  }, [autoOpen, step]);

  const isOpeningOrLater = step === "opening" || step === "flash" || step === "finished";

  return (
    <AnimatePresence>
      {step !== "finished" && (
        <motion.div
          key="envelope-container"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeOut" } }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a] overflow-hidden cursor-pointer"
          onClick={!autoOpen ? handleOpen : undefined}
        >
          {/* Background Ambient Glow */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at center, ${theme.ambient} 0%, ${theme.bg} 100%)` }} />

          {/* The Light Burst (Flash) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={step === "flash" ? { opacity: 1, scale: 2.5 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8, ease: "easeIn" }}
            className="absolute inset-0 z-[110] bg-[radial-gradient(circle_at_center,_#ffffff_0%,_#fffbeb_40%,_transparent_100%)] pointer-events-none mix-blend-screen"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={step === "flash" ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeIn" }}
            className="absolute inset-0 z-[111] bg-white pointer-events-none"
          />

          <div className="relative w-full max-w-lg aspect-[4/3] flex items-center justify-center z-10" style={{ perspective: "2000px" }}>
            
            {/* Main Envelope Body */}
            <motion.div 
              animate={isOpeningOrLater ? { scale: 0.85, y: 80, rotateX: 15 } : { scale: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0 shadow-[0_30px_60px_rgba(0,0,0,0.6)] rounded-sm"
              style={{ transformStyle: "preserve-3d", backgroundColor: theme.envelopeMain }}
            >
              {/* Inner Content (The Card) */}
              <motion.div
                initial={{ y: 0 }}
                animate={isOpeningOrLater ? { y: -200, scale: 1.1 } : { y: 0, scale: 0.9 }}
                transition={{ delay: 0.4, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-x-4 md:inset-x-8 top-12 bottom-4 bg-white shadow-2xl flex flex-col items-center justify-center p-6 md:p-8 border border-gray-100 z-10"
              >
                <div className="absolute inset-0 border-[1px] border-amber-200/60 m-3 rounded-sm pointer-events-none" />
                <div className="text-center space-y-3 md:space-y-4">
                  <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-amber-600/80 font-medium">You are invited</span>
                  <div className="space-y-2 py-2">
                    <h2 className="text-3xl md:text-5xl font-serif text-gray-900 leading-tight">{brideName}</h2>
                    <span className="text-lg md:text-2xl font-serif text-amber-500 italic block">&amp;</span>
                    <h2 className="text-3xl md:text-5xl font-serif text-gray-900 leading-tight">{groomName}</h2>
                  </div>
                </div>
              </motion.div>

              {/* Front Flaps (Static) */}
              <div className="absolute inset-0 z-20 pointer-events-none shadow-[inset_0_-10px_20px_rgba(0,0,0,0.05)]">
                <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-2xl">
                  <path d="M0 300 L200 150 L400 300" fill={theme.envelopeFlapInner} />
                  <path d="M0 0 L200 150 L0 300" fill={theme.envelopeMain} />
                  <path d="M400 0 L200 150 L400 300" fill={theme.envelopeMain} />
                </svg>
              </div>

              {/* Top Flap (Animated) */}
              <motion.div
                initial={{ rotateX: 0, zIndex: 30 }}
                animate={isOpeningOrLater ? { rotateX: 180, zIndex: 5 } : { rotateX: 0, zIndex: 30 }}
                transition={{ 
                  rotateX: { duration: 0.9, ease: "easeInOut" },
                  zIndex: { delay: 0.45, duration: 0 }
                }}
                style={{ transformOrigin: "top", transformStyle: "preserve-3d" }}
                className="absolute inset-x-0 top-0 h-1/2"
              >
                <svg viewBox="0 0 400 150" className="w-full h-full drop-shadow-[0_10px_15px_rgba(0,0,0,0.3)]">
                  <path d="M0 0 L200 150 L400 0 Z" fill={theme.envelopeFlap} stroke={theme.envelopeFlapInner} strokeWidth="1" />
                </svg>

                {/* Wax Seal */}
                <motion.div
                  animate={
                    step === "seal_glow" ? { scale: 1.1, filter: `brightness(1.5) drop-shadow(0 0 30px ${theme.sealGlow})` } :
                    isOpeningOrLater ? { opacity: 0, scale: 0, filter: "brightness(3)" } : 
                    { scale: 1, filter: "brightness(1) drop-shadow(0 4px 10px rgba(0,0,0,0.4))" }
                  }
                  transition={{ duration: 0.6 }}
                  className={`absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br ${theme.sealBg} rounded-full flex items-center justify-center border-[2px] border-white/10`}
                >
                  <div className={`w-12 h-12 rounded-full border border-white/20 flex items-center justify-center relative ${theme.sealInner} shadow-inner`}>
                     <span className={`font-serif ${theme.text} text-xl font-bold italic`}>{brideName?.[0] || 'B'}&{groomName?.[0] || 'G'}</span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            {!isOpeningOrLater && step !== "seal_glow" && !autoOpen && (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-24 left-1/2 -translate-x-1/2 text-center w-full"
              >
                <p className="font-serif italic text-white/70 tracking-widest uppercase text-sm mb-3">Tap to unlock</p>
                <motion.div
                  animate={{ scale: [1, 2, 1], opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-1.5 h-1.5 bg-white/80 rounded-full mx-auto shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
