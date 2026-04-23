"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, ChevronDown, Feather, Map as MapIcon } from "lucide-react";
import type { TemplateProps } from "./types";
import RSVPModal from "@/components/invitation/RSVPModal";

/* ── Gold leaf floating particle ────────────────────────── */
function GoldLeaf({ style }: { style: React.CSSProperties }) {
  return (
    <div className="absolute pointer-events-none select-none" style={style}>
      <svg width="8" height="12" viewBox="0 0 8 12">
        <path d="M4 0 C7 3, 8 7, 4 12 C0 7, 1 3, 4 0Z" fill="#D4AF37" opacity="0.25" />
      </svg>
    </div>
  );
}

/* ── Ornamental flourish divider ────────────────────────── */
function IvoryDivider() {
  return (
    <div className="flex justify-center items-center gap-4 my-8">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="h-px w-20 origin-right"
        style={{ background: "linear-gradient(to left, #D4AF37, transparent)" }}
      />
      <motion.div
        initial={{ scale: 0, rotate: -90 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20">
          <path d="M10 2 L12 8 L18 10 L12 12 L10 18 L8 12 L2 10 L8 8Z" fill="#D4AF37" opacity="0.7" />
        </svg>
      </motion.div>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="h-px w-20 origin-left"
        style={{ background: "linear-gradient(to right, #D4AF37, transparent)" }}
      />
    </div>
  );
}

export default function SacredIvoryTemplate({ brideName, groomName, date, venue, events, gallery, isPreview, isThumbnail, invitationId, tier, musicUrl }: TemplateProps) {
  const [goldLeaves, setGoldLeaves] = useState<React.CSSProperties[]>([]);
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setGoldLeaves(Array.from({ length: 16 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `-10px`,
      animation: `sacredFall ${8 + Math.random() * 12}s ${Math.random() * 10}s infinite linear`,
    })));
  }, []);

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
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [date]);

  const fmt = date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <>
      <style>{`
        @keyframes sacredFall {
          0% { transform: translateY(-10px) rotate(0deg) translateX(0); opacity: 0; }
          15% { opacity: 0.6; }
          85% { opacity: 0.3; }
          100% { transform: translateY(${isThumbnail ? '812px' : '100vh'}) rotate(360deg) translateX(30px); opacity: 0; }
        }
        @keyframes ivoryShimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .ivory-gradient-text {
          background: linear-gradient(90deg, #8B4513, #D4AF37, #8B4513, #D4AF37, #8B4513);
          background-size: 300% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: ivoryShimmer 6s ease-in-out infinite;
        }
      `}</style>

      <div className={isThumbnail ? "min-h-full" : "min-h-screen"} style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}>

        {/* ── HERO ─────────────────────────────────── */}
        <section className={`relative flex flex-col items-center justify-center text-center overflow-hidden px-6 ${isThumbnail ? "min-h-[812px]" : "min-h-screen"}`}
          style={{ background: "linear-gradient(160deg, #FFFDF5 0%, #FFF8E7 30%, #FAF0DC 70%, #FFFDF5 100%)" }}>
          
          {goldLeaves.map((s, i) => <GoldLeaf key={i} style={s} />)}

          {/* Ornamental corner SVGs */}
          <div className="absolute inset-6 md:inset-12 pointer-events-none">
            {/* Top-left corner */}
            <svg className="absolute top-0 left-0 w-16 h-16 md:w-24 md:h-24" viewBox="0 0 100 100" fill="none">
              <motion.path d="M5 40 L5 5 L40 5" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.5 }} />
              <motion.path d="M5 20 Q20 20, 20 5" stroke="#D4AF37" strokeWidth="1" opacity="0.4"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 1 }} />
            </svg>
            {/* Top-right corner */}
            <svg className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24" viewBox="0 0 100 100" fill="none">
              <motion.path d="M60 5 L95 5 L95 40" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.7 }} />
              <motion.path d="M80 5 Q80 20, 95 20" stroke="#D4AF37" strokeWidth="1" opacity="0.4"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 1.2 }} />
            </svg>
            {/* Bottom-left corner */}
            <svg className="absolute bottom-0 left-0 w-16 h-16 md:w-24 md:h-24" viewBox="0 0 100 100" fill="none">
              <motion.path d="M5 60 L5 95 L40 95" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.9 }} />
            </svg>
            {/* Bottom-right corner */}
            <svg className="absolute bottom-0 right-0 w-16 h-16 md:w-24 md:h-24" viewBox="0 0 100 100" fill="none">
              <motion.path d="M95 60 L95 95 L60 95" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 1.1 }} />
            </svg>
          </div>

          {/* Subtle radial glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 70%)" }} />

          <div className="relative z-10 max-w-3xl">
            <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 2 }}
              className="w-16 h-16 mx-auto mb-8 rounded-full flex items-center justify-center"
              style={{ border: "1px solid rgba(212,175,55,0.4)", background: "rgba(212,175,55,0.06)" }}>
              <Feather className="w-7 h-7" style={{ color: "#D4AF37" }} />
            </motion.div>

            <motion.p initial={{ opacity: 0, letterSpacing: "1em" }} animate={{ opacity: 1, letterSpacing: "0.5em" }}
              transition={{ duration: 2.5 }} className="font-sans text-[9px] uppercase mb-10"
              style={{ color: "#B8860B", fontFamily: "'Montserrat', sans-serif" }}>
              Together With Their Families
            </motion.p>

            <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="ivory-gradient-text font-light leading-none"
              style={{ fontSize: isThumbnail ? "3.5rem" : "clamp(3.5rem, 12vw, 8rem)", letterSpacing: "0.05em" }}>
              {brideName}
            </motion.h1>

            <IvoryDivider />

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
              className="text-2xl font-light italic" style={{ color: "rgba(139,69,19,0.5)" }}>&amp;</motion.p>

            <IvoryDivider />

            <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="ivory-gradient-text font-light leading-none"
              style={{ fontSize: isThumbnail ? "3.5rem" : "clamp(3.5rem, 12vw, 8rem)", letterSpacing: "0.05em" }}>
              {groomName}
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.5 }}
              className="mt-10 text-sm tracking-[0.4em] uppercase"
              style={{ color: "#8B4513", fontFamily: "'Montserrat', sans-serif" }}>{fmt}</motion.p>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}
              className="mt-3 text-sm" style={{ color: "#B8860B", fontFamily: "'Montserrat', sans-serif" }}>{venue}</motion.p>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-[8px] uppercase tracking-[0.5em]" style={{ color: "#B8860B", fontFamily: "'Montserrat', sans-serif" }}>Scroll</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <ChevronDown className="w-4 h-4" style={{ color: "#D4AF37" }} />
            </motion.div>
          </motion.div>
        </section>

        {/* ── COUNTDOWN ───────────────────────────── */}
        <section className="py-20 text-center" style={{ background: "#FFFDF5" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-[10px] uppercase tracking-[0.6em] mb-10"
              style={{ color: "#B8860B", fontFamily: "'Montserrat', sans-serif" }}>Days Until Forever</p>
            <div className="flex gap-6 md:gap-12 justify-center flex-wrap">
              {[{ label: "Days", v: time.days }, { label: "Hours", v: time.hours }, { label: "Minutes", v: time.minutes }, { label: "Seconds", v: time.seconds }].map(i => (
                <div key={i.label} className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center text-2xl md:text-3xl font-light transition-all duration-500"
                    style={{
                      color: "#8B4513",
                      border: "1px solid rgba(212,175,55,0.35)",
                      background: "linear-gradient(135deg, rgba(212,175,55,0.05), rgba(250,240,220,0.8))",
                      boxShadow: "0 4px 20px rgba(212,175,55,0.1)",
                    }}>
                    {String(i.v).padStart(2, "0")}
                  </div>
                  <span className="text-[9px] uppercase tracking-[0.3em]"
                    style={{ color: "#B8860B", fontFamily: "'Montserrat', sans-serif" }}>{i.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── EVENTS ──────────────────────────────── */}
        <section className="py-24 px-4" style={{ background: "linear-gradient(180deg, #FFF8E7, #FFFDF5)" }}>
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <p className="text-[10px] uppercase tracking-[0.6em] mb-3"
                style={{ color: "#B8860B", fontFamily: "'Montserrat', sans-serif" }}>The Celebration</p>
              <h2 className="text-4xl md:text-5xl font-light" style={{ color: "#5C3317" }}>Sacred Events</h2>
              <IvoryDivider />
            </motion.div>
            <div className="space-y-6">
              {events.map((ev, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                  className="p-8 relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #FFFDF5, #FFF8E7)",
                    border: "1px solid rgba(212,175,55,0.25)",
                    boxShadow: "0 4px 30px rgba(212,175,55,0.06)",
                  }}>
                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-15"
                    style={{ background: "radial-gradient(circle at top right, #D4AF37, transparent 70%)" }} />
                  
                  <p className="text-[10px] uppercase tracking-[0.5em] mb-2"
                    style={{ color: "#D4AF37", fontFamily: "'Montserrat', sans-serif" }}>✦ Event {i + 1} ✦</p>
                  <h3 className="text-2xl font-light mb-2" style={{ color: "#5C3317" }}>{ev.name}</h3>
                  {ev.description && <p className="text-sm mb-4" style={{ color: "#8B6914", fontFamily: "'Montserrat', sans-serif" }}>{ev.description}</p>}
                  <div className="flex flex-wrap gap-4 text-xs" style={{ color: "#B8860B", fontFamily: "'Montserrat', sans-serif" }}>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{ev.time}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{ev.location}</span>
                  </div>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.location)}`} target="_blank" rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 border text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-300 hover:bg-[#D4AF37] hover:text-white hover:border-[#D4AF37]"
                    style={{ borderColor: "rgba(212,175,55,0.35)", color: "#8B4513", fontFamily: "'Montserrat', sans-serif" }}>
                    <MapIcon className="w-3 h-3" /> Open in Maps
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── GALLERY ─────────────────────────────── */}
        {gallery.length > 0 && (
          <section className="py-24 px-4" style={{ background: "#FFFDF5" }}>
            <div className="max-w-5xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                <h2 className="text-4xl font-light" style={{ color: "#5C3317" }}>Our Story in Portraits</h2>
                <IvoryDivider />
              </motion.div>
              <div className="columns-2 md:columns-3 gap-4 space-y-4">
                {gallery.map((img, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="overflow-hidden" style={{ breakInside: "avoid", border: "1px solid rgba(212,175,55,0.2)", boxShadow: "0 4px 20px rgba(212,175,55,0.08)" }}>
                    <img src={img.url} alt="" className="w-full object-cover transition-transform duration-700 hover:scale-105" />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FOOTER ──────────────────────────────── */}
        <section className="py-20 text-center" style={{ background: "linear-gradient(160deg, #FFF8E7, #FAF0DC)" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Feather className="w-8 h-8 mx-auto mb-6" style={{ color: "#D4AF37" }} />
            <h2 className="text-3xl font-light mb-2" style={{ color: "#5C3317" }}>Your Presence Is Our Blessing</h2>
            <p className="text-sm mb-10" style={{ color: "#B8860B", fontFamily: "'Montserrat', sans-serif" }}>{venue}</p>
            {!isPreview && invitationId && (
              <div className="flex gap-4 justify-center flex-wrap">
                {tier !== "basic" && <RSVPModal invitationId={invitationId} />}
              </div>
            )}
          </motion.div>
        </section>
      </div>
    </>
  );
}
