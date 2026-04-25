"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, ChevronDown, Heart, Share2, ExternalLink } from "lucide-react";
import type { TemplateProps } from "./types";
import RSVPModal from "@/components/invitation/RSVPModal";

/* ── Petal ─────────────────────────────────────────────── */
function Petal({ style }: { style: React.CSSProperties }) {
  return (
    <div className="absolute top-0 pointer-events-none select-none" style={style}>
      <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
        <path d="M7 1 C11 5, 13 10, 7 17 C1 10, 3 5, 7 1Z" fill="#D4829A" opacity="0.55" />
      </svg>
    </div>
  );
}

/* ── Flip Digit ────────────────────────────────────────── */
function FlipDigit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-16 h-20 md:w-20 md:h-24 rounded-2xl shadow-lg flex items-center justify-center text-3xl md:text-4xl font-light"
        style={{ background: "white", color: "#6B2737", boxShadow: "0 8px 30px rgba(183,110,121,0.15)" }}>
        <AnimatePresence mode="wait">
          <motion.span key={value} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} transition={{ duration: 0.3 }}>
            {String(value).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[10px] uppercase tracking-[0.25em] font-sans" style={{ color: "#B76E79" }}>{label}</span>
    </div>
  );
}

export default function RoseGoldTemplate({ brideName, groomName, date, venue, events, gallery, isPreview, isThumbnail, invitationId, tier, musicUrl }: TemplateProps) {
  const [petals, setPetals] = useState<React.CSSProperties[]>([]);
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const count = isThumbnail ? 6 : (window.innerWidth < 768 ? 12 : 22);
    setPetals(Array.from({ length: count }, () => ({
      left: `${Math.random() * 100}%`,
      animationDuration: `${7 + Math.random() * 8}s`,
      animationDelay: `${Math.random() * 10}s`,
      animation: `petalFall ${7 + Math.random() * 8}s ${Math.random() * 10}s infinite linear`,
    })));
  }, [isThumbnail]);

  useEffect(() => {
    const tick = () => {
      const d = Math.max(0, date.getTime() - Date.now());
      setTime({
        days: Math.floor(d / 86400000),
        hours: Math.floor((d % 86400000) / 3600000),
        minutes: Math.floor((d % 3600000) / 60000),
        seconds: Math.floor((d % 60000) / 1000),
      });
    };
    tick(); const t = setInterval(tick, 1000); return () => clearInterval(t);
  }, [date]);

  const fmt = date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <>
      <style>{`
        @keyframes petalFall {
          0% { transform: translateY(-20px) rotate(0deg) translateX(0); opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.5; }
          100% { transform: translateY(${isThumbnail ? '812px' : '100vh'}) rotate(720deg) translateX(40px); opacity: 0; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .gold-shimmer {
          background: linear-gradient(90deg, #6B2737 30%, #D4AF37 50%, #B76E79 60%, #6B2737 80%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
      `}</style>

      <div className={isThumbnail ? "min-h-full" : "min-h-screen"} style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>

        {/* ── HERO ─────────────────────────────────── */}
        <section className={`relative flex flex-col items-center justify-center overflow-hidden text-center px-6 ${isThumbnail ? "min-h-[812px]" : "min-h-screen"}`}
          style={{ background: "linear-gradient(160deg, #FFF8F0 0%, #FEF0F0 60%, #FFF5E6 100%)" }}>
          {/* Petals */}
          {petals.map((s, i) => <Petal key={i} style={s} />)}

          {/* Decorative rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[500, 700, 900].map(s => (
              <div key={s} className="absolute rounded-full border border-rose-200/20" style={{ width: s, height: s }} />
            ))}
          </div>

          <div className="relative z-10 max-w-4xl">
            <motion.p initial={{ opacity: 0, letterSpacing: "0.8em" }} animate={{ opacity: 1, letterSpacing: "0.35em" }}
              transition={{ duration: 2 }} className="font-sans text-xs uppercase mb-10" style={{ color: "#B76E79" }}>
              Together With Their Families
            </motion.p>

            <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="gold-shimmer font-light leading-none" style={{ fontSize: isThumbnail ? "3.5rem" : "clamp(3.5rem, 13vw, 9rem)" }}>
              {brideName}
            </motion.h1>

            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.6, duration: 1.4 }}
              className="mx-auto my-5 h-px" style={{ width: 120, background: "linear-gradient(to right, transparent, #B76E79, #D4AF37, transparent)" }} />

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
              className="text-3xl font-light italic my-4" style={{ color: "#B76E79" }}>&amp;</motion.p>

            <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="gold-shimmer font-light leading-none" style={{ fontSize: isThumbnail ? "3.5rem" : "clamp(3.5rem, 13vw, 9rem)" }}>
              {groomName}
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2, duration: 1 }}
              className="mt-8 font-sans text-lg tracking-widest" style={{ color: "#9B6A5A" }}>{fmt}</motion.p>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
              className="mt-2 font-sans text-sm" style={{ color: "#C4A0A0" }}>{venue}</motion.p>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-[9px] font-sans uppercase tracking-[0.35em]" style={{ color: "#C4A0A0" }}>Scroll</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
              <ChevronDown style={{ color: "#B76E79" }} className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </section>

        {/* ── COUNTDOWN ───────────────────────────── */}
        <section className="py-20 text-center" style={{ background: "#FFF8F0" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="font-sans text-xs uppercase tracking-[0.4em] mb-10" style={{ color: "#B76E79" }}>Counting Down to Forever</p>
            <div className="flex gap-4 md:gap-10 justify-center flex-wrap">
              {[{ label: "Days", v: time.days }, { label: "Hours", v: time.hours }, { label: "Minutes", v: time.minutes }, { label: "Seconds", v: time.seconds }]
                .map(i => <FlipDigit key={i.label} value={i.v} label={i.label} />)}
            </div>
          </motion.div>
        </section>

        {/* ── EVENTS ──────────────────────────────── */}
        <section className="py-24 px-4" style={{ background: "white" }}>
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <p className="font-sans text-xs uppercase tracking-[0.4em] mb-3" style={{ color: "#B76E79" }}>Our Celebration</p>
              <h2 className="text-4xl font-light" style={{ color: "#2C1810" }}>The Events</h2>
              <div className="mx-auto mt-5 h-px" style={{ width: 60, background: "linear-gradient(to right, transparent, #B76E79, transparent)" }} />
            </motion.div>
            <div className="space-y-6">
              {events.map((ev, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.1 }}
                  className="flex gap-5 p-7 rounded-3xl" style={{ background: "linear-gradient(135deg, #FFF8F2, #FFF0F0)", border: "1px solid #F0D0D0" }}>
                  <div className="w-1 rounded-full shrink-0" style={{ background: "linear-gradient(to bottom, #B76E79, #D4AF37)" }} />
                  <div className="flex-1">
                    <p className="font-sans text-xs uppercase tracking-widest mb-2" style={{ color: "#B76E79" }}>Event {i + 1}</p>
                    <h3 className="text-2xl font-light mb-2" style={{ color: "#2C1810" }}>{ev.name}</h3>
                    {ev.description && <p className="font-sans text-sm mb-4" style={{ color: "#9B6A5A" }}>{ev.description}</p>}
                    <div className="flex flex-wrap gap-4 font-sans text-xs" style={{ color: "#C4A0A0" }}>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{ev.time}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{ev.location}</span>
                    </div>
                    {!isPreview && (
                      <a href={`https://maps.google.com/?q=${encodeURIComponent(ev.location)}`} target="_blank" rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-1 font-sans text-xs uppercase tracking-widest px-4 py-2 rounded-full border transition-colors hover:text-white hover:border-rose-400 hover:bg-rose-400"
                        style={{ borderColor: "#E0C0C0", color: "#B76E79" }}>
                        <MapPin className="w-3 h-3" />View on Map<ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── GALLERY ─────────────────────────────── */}
        {gallery.length > 0 && (
          <section className="py-24 px-4" style={{ background: "#FFF8F0" }}>
            <div className="max-w-5xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                <p className="font-sans text-xs uppercase tracking-[0.4em] mb-3" style={{ color: "#B76E79" }}>Captured Moments</p>
                <h2 className="text-4xl font-light" style={{ color: "#2C1810" }}>Photo Gallery</h2>
              </motion.div>
            <div className="columns-2 md:columns-3 gap-4 space-y-4">
              {gallery.map((img, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="overflow-hidden rounded-2xl" style={{ breakInside: "avoid", willChange: "transform, opacity" }}>
                  <img 
                    src={img.url} 
                    alt="" 
                    loading="lazy"
                    className="w-full object-cover transition-transform duration-700 hover:scale-105" 
                  />
                </motion.div>
              ))}
            </div>
            </div>
          </section>
        )}

        {/* ── FOOTER / RSVP ───────────────────────── */}
        <section className="py-20 text-center" style={{ background: "white" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Heart className="w-8 h-8 mx-auto mb-6" style={{ color: "#B76E79", fill: "#B76E79" }} />
            <h2 className="text-3xl font-light mb-2" style={{ color: "#2C1810" }}>We Can't Wait to Celebrate With You</h2>
            <p className="font-sans text-sm mb-10" style={{ color: "#B89090" }}>{venue}</p>
            {!isPreview && invitationId && (
              <div className="flex gap-4 justify-center flex-wrap">
                {tier !== "basic" && <RSVPModal invitationId={invitationId} />}
                <button onClick={() => navigator.share?.({ title: `${brideName} & ${groomName}`, url: window.location.href })}
                  className="flex items-center gap-2 px-8 py-3 rounded-full font-sans text-sm border transition-colors hover:bg-rose-50"
                  style={{ borderColor: "#E0C0C0", color: "#B76E79" }}>
                  <Share2 className="w-4 h-4" />Share
                </button>
              </div>
            )}
          </motion.div>
        </section>
      </div>
    </>
  );
}
