"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Wifi, Battery, Signal, Lock, RotateCcw, Volume2, VolumeX } from "lucide-react";
import TemplateRouter from "./templates/TemplateRouter";
import { TemplateProps } from "./templates/types";

// Use a stable future date to avoid hydration mismatch
// We'll set this dynamically in the component via useEffect
const STATIC_FUTURE = new Date("2026-06-15T10:00:00");

const BASE_MOCK_PROPS: Omit<TemplateProps, "date"> = {
  brideName: "Ayesha",
  groomName: "Abdullah",
  venue: "The Grand Imperial Ballroom, Pearl Continental · Lahore",
  events: [
    {
      name: "Nikah Ceremony",
      time: "10:00 AM",
      location: "Faisal Mosque, Islamabad",
      description: "Join us as we unite in the sacred bond of Nikah, followed by a light brunch.",
    },
    {
      name: "Mehndi Night",
      time: "05:00 PM",
      location: "Royal Gardens, Islamabad",
      description: "An evening of color, music and dance under the stars.",
    },
    {
      name: "Grand Walima",
      time: "07:00 PM",
      location: "Pearl Continental Ballroom",
      description: "A regal dinner celebrating our union. Formal attire requested.",
    },
  ],
  gallery: [],
  isPreview: false,
  isThumbnail: false,
  invitationId: 1,
  tier: "premium",
};

export default function MobileInvitationPreview() {
  const [currentTime, setCurrentTime] = useState("");
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const [hasOpened, setHasOpened] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setHasScrolled(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isInView && hasScrolled && !hasOpened) {
      setHasOpened(true);
    }
  }, [isInView, hasScrolled, hasOpened]);

  return (
    <div
      ref={containerRef}
      className="relative w-[280px] h-[580px] md:w-[320px] md:h-[650px] mx-auto group"
    >
      {/* Phone Frame */}
      <div className="absolute inset-0 bg-[#1a0a0d] rounded-[3.5rem] border-12 border-[#2d1b20] shadow-[0_0_0_2px_rgba(255,255,255,0.05),0_30px_60px_-12px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Screen Content */}
        <div className="absolute inset-0 bg-white overflow-hidden rounded-[2.8rem] flex flex-col">
          {/* Status Bar */}
          <div className="flex-none h-11 px-6 flex items-center justify-between text-black z-40 bg-white/80 backdrop-blur-md">
            <span className="text-[13px] font-bold">{currentTime}</span>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 rotate-90" />
            </div>
          </div>

          {/* Browser URL Bar */}
          <div className="flex-none px-4 pb-2 bg-white/80 backdrop-blur-md border-b border-gray-100 z-40">
            <div className="h-9 bg-gray-100 rounded-xl flex items-center px-3 gap-2">
              <Lock className="w-3 h-3 text-gray-400" />
              <span className="text-[11px] text-gray-500 truncate font-medium">
                dnvites.com/abdullah-ayesha
              </span>
              <div className="ml-auto flex items-center gap-2">
                <RotateCcw className="w-3 h-3 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Scrollable Template Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth relative bg-[#1A0008]">
            <TemplateRouter
              template="royal-gold"
              {...BASE_MOCK_PROPS}
              date={STATIC_FUTURE}
              autoOpen={hasOpened}
              inline={true}
            />
          </div>
        </div>

        {/* Physical Notch (Dynamic Island style) */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-3xl z-50 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-blue-900/40 mr-12" />
          <div className="w-1 h-1 rounded-full bg-white/10" />
        </div>

        {/* Music toggle button (floating inside phone) */}
        <div className="absolute top-14 right-4 z-[55] flex flex-col items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.stopPropagation();
              setMusicOn(!musicOn);
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-xl border transition-all duration-300 ${musicOn
                ? "bg-[#D4AF37]/30 border-[#D4AF37]/50 text-[#D4AF37]"
                : "bg-black/40 border-white/10 text-white/70"
              }`}
          >
            <AnimatePresence mode="wait">
              {musicOn ? (
                <motion.div
                  key="on"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Volume2 className="w-4 h-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="off"
                  initial={{ scale: 0, rotate: 90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <VolumeX className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
            {/* Pulsing ring when music is on */}
            {musicOn && (
              <motion.div
                className="absolute inset-0 rounded-full border border-[#D4AF37]/40"
                animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </motion.button>

          {/* Visualizer bars */}
          <AnimatePresence>
            {musicOn && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-end gap-0.5 h-3 px-1"
              >
                {[0.4, 0.8, 0.6, 0.9, 0.5].map((h, i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 bg-[#D4AF37]"
                    animate={{ height: ["20%", "100%", "40%", "80%", "20%"] }}
                    transition={{
                      duration: 0.6 + i * 0.1,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Interaction hint overlay */}
        {!hasOpened && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 4, duration: 1 }}
            className="absolute inset-0 bg-black/40 z-[60] flex items-center justify-center pointer-events-none"
          >
            <div className="text-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-4xl mb-2"
              >
                👆
              </motion.div>
              <p className="text-white text-xs font-bold tracking-widest uppercase">
                Interact with preview
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Decorative reflection */}
      <div className="absolute inset-[12px] rounded-[2.8rem] border border-white/5 pointer-events-none z-50" />

      {/* Decorative shadows */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-10 bg-black/20 blur-2xl rounded-full" />
    </div>
  );
}
