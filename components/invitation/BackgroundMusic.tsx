"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BackgroundMusicProps {
  url: string;
}

export default function BackgroundMusic({ url }: BackgroundMusicProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.log("Autoplay blocked or failed", err));
    }
    setIsPlaying(!isPlaying);
    setHasInteracted(true);
  };

  // Attempt to auto-play after first interaction on the page if needed
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted && audioRef.current && !isPlaying) {
        // We don't auto-play here to respect user preference, 
        // but we could if we wanted the wooowinvites experience.
        // For now, let's just show the button clearly.
      }
    };
    window.addEventListener('click', handleFirstInteraction);
    return () => window.removeEventListener('click', handleFirstInteraction);
  }, [hasInteracted, isPlaying]);

  return (
    <div className="fixed bottom-6 left-6 md:bottom-10 md:left-10 z-60">
      <audio ref={audioRef} src={url} loop />

      <div className="relative">
        {/* Pulse effect when playing */}
        {isPlaying && (
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-rose-400 rounded-full blur-md"
          />
        )}

        <motion.button
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={togglePlay}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 border ${isPlaying
              ? "bg-white text-rose-500 border-rose-100"
              : "bg-black/80 text-white border-white/10 backdrop-blur-xl"
            }`}
        >
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.div
                key="playing"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="relative"
              >
                <Volume2 className="w-6 h-6" />
                <motion.div
                  animate={{ height: [4, 12, 6, 14, 8] }}
                  transition={{ duration: 0.6, repeat: Infinity, repeatType: "mirror" }}
                  className="absolute -right-1 -top-1 w-0.5 bg-rose-400"
                />
              </motion.div>
            ) : (
              <motion.div
                key="paused"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <Music className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {!hasInteracted && !isPlaying && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute left-full ml-4 top-1/2 -translate-y-1/2 whitespace-nowrap bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-rose-100 shadow-sm text-xs font-serif italic text-rose-600 pointer-events-none hidden md:block"
          >
            Tap for music ✨
          </motion.div>
        )}
      </div>
    </div>
  );
}
