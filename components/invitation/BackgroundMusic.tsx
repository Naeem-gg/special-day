"use client";

import { useState, useRef, useEffect } from "react";
import { Music, Music2, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BackgroundMusicProps {
  url: string;
}

export default function BackgroundMusic({ url }: BackgroundMusicProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed top-6 right-6 z-50">
      <audio ref={audioRef} src={url} loop />
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="playing"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
            >
              <Volume2 className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="paused"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
            >
              <VolumeX className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
