"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CurtainIntroProps {
  brideName: string;
  groomName: string;
  variant?: string;
  autoOpen?: boolean;
  inline?: boolean;
}

const CURTAIN_THEMES = {
  "sakura": {
    curtainColor: "#FFB7C5",
    tieColor: "#FF69B4",
    bg: "#FFF5F7",
  },
  "azure-ocean": {
    curtainColor: "#0077BE",
    tieColor: "#00BFFF",
    bg: "#F0F8FF",
  },
  "default": {
    curtainColor: "#800000",
    tieColor: "#FFD700",
    bg: "#1a1a1a",
  }
};

export default function CurtainIntro({
  brideName,
  groomName,
  variant = "default",
  autoOpen = false,
  inline = false,
}: CurtainIntroProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const theme = CURTAIN_THEMES[variant as keyof typeof CURTAIN_THEMES] || CURTAIN_THEMES.default;

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => setIsFinished(true), 2500);
  };

  useEffect(() => {
    if (autoOpen && !isOpen) {
      const t = setTimeout(handleOpen, 1000);
      return () => clearTimeout(t);
    }
  }, [autoOpen, isOpen]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          exit={{ opacity: 0, transition: { duration: 1 } }}
          className={`${inline ? "absolute" : "fixed"} inset-0 z-[100] flex items-center justify-center overflow-hidden bg-white`}
        >
          {/* Left Curtain */}
          <motion.div
            initial={{ x: 0 }}
            animate={isOpen ? { x: "-100%" } : { x: 0 }}
            transition={{ duration: 2, ease: [0.45, 0.05, 0.55, 0.95] }}
            className="absolute left-0 top-0 w-1/2 h-full z-20"
            style={{ 
              backgroundColor: theme.curtainColor,
              boxShadow: "10px 0 30px rgba(0,0,0,0.3)",
              backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.1) 0%, transparent 10%, rgba(0,0,0,0.1) 20%, transparent 30%, rgba(0,0,0,0.1) 40%, transparent 50%, rgba(0,0,0,0.1) 60%, transparent 70%, rgba(0,0,0,0.1) 80%, transparent 90%, rgba(0,0,0,0.1) 100%)`
            }}
          >
            {/* Tassels/Details */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1 h-32" style={{ backgroundColor: theme.tieColor }} />
          </motion.div>

          {/* Right Curtain */}
          <motion.div
            initial={{ x: 0 }}
            animate={isOpen ? { x: "100%" } : { x: 0 }}
            transition={{ duration: 2, ease: [0.45, 0.05, 0.55, 0.95] }}
            className="absolute right-0 top-0 w-1/2 h-full z-20"
            style={{ 
              backgroundColor: theme.curtainColor,
              boxShadow: "-10px 0 30px rgba(0,0,0,0.3)",
              backgroundImage: `linear-gradient(-90deg, rgba(0,0,0,0.1) 0%, transparent 10%, rgba(0,0,0,0.1) 20%, transparent 30%, rgba(0,0,0,0.1) 40%, transparent 50%, rgba(0,0,0,0.1) 60%, transparent 70%, rgba(0,0,0,0.1) 80%, transparent 90%, rgba(0,0,0,0.1) 100%)`
            }}
          >
            {/* Tassels/Details */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-1 h-32" style={{ backgroundColor: theme.tieColor }} />
          </motion.div>

          {/* Interaction Hint */}
          {!isOpen && !autoOpen && (
            <motion.div 
              onClick={handleOpen}
              className="absolute inset-0 z-30 cursor-pointer flex flex-col items-center justify-center text-white"
            >
              <div className="bg-black/20 backdrop-blur-sm px-8 py-4 rounded-full border border-white/30">
                <motion.p 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-lg font-serif tracking-[0.2em] uppercase"
                >
                  Click to Unveil
                </motion.p>
              </div>
            </motion.div>
          )}

          {/* Welcome Text */}
          {!isOpen && (
            <div className="absolute top-1/4 w-full text-center z-40 pointer-events-none px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-white text-3xl md:text-5xl font-serif drop-shadow-lg">
                  {brideName} & {groomName}
                </h2>
                <div className="h-px w-24 bg-white/50 mx-auto mt-4" />
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
