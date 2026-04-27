"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, ChevronDown, Map as MapIcon } from "lucide-react";
import type { TemplateProps } from "./types";
import RSVPModal from "@/components/invitation/RSVPModal";

function Firefly({ style }: { style: React.CSSProperties }) {
  return <div className="absolute rounded-full pointer-events-none" style={{ ...style, boxShadow: "0 0 6px 2px rgba(184,115,51,0.6)", background: "rgba(255,200,100,0.8)" }} />;
}

function BranchSVG() {
  return (
    <div className="absolute top-0 right-0 w-48 h-48 md:w-72 md:h-72 pointer-events-none opacity-15">
      <svg viewBox="0 0 200 200" fill="none">
        <motion.path d="M180 20 Q140 60, 100 100 Q70 130, 40 180"
          stroke="#B87333" strokeWidth="2.5" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, ease: "easeInOut" }} />
        <motion.path d="M100 100 Q80 70, 60 50"
          stroke="#B87333" strokeWidth="1.5" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 1.5 }} />
        <motion.path d="M100 100 Q130 80, 150 60"
          stroke="#B87333" strokeWidth="1.5" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 2 }} />
        <motion.path d="M140 60 Q120 40, 110 20"
          stroke="#B87333" strokeWidth="1" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 2.5 }} />
      </svg>
    </div>
  );
}

export default function EmeraldForestTemplate({ brideName, groomName, date, venue, events, gallery, isPreview, isThumbnail, invitationId, tier, musicUrl, ourStory, mapUrl }: TemplateProps) {
  const [fireflies, setFireflies] = useState<React.CSSProperties[]>([]);
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setFireflies(Array.from({ length: 16 }, () => ({
      width: 4 + Math.random() * 4,
      height: 4 + Math.random() * 4,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animation: `fireflyFloat ${3 + Math.random() * 5}s ${Math.random() * 5}s infinite ease-in-out alternate`,
    })));
  }, []);

  useEffect(() => {
    const tick = () => {
      const d = Math.max(0, date.getTime() - Date.now());
      setTime({ days: Math.floor(d / 86400000), hours: Math.floor((d % 86400000) / 3600000), minutes: Math.floor((d % 3600000) / 60000), seconds: Math.floor((d % 60000) / 1000) });
    };
    tick(); const t = setInterval(tick, 1000); return () => clearInterval(t);
  }, [date]);

  const fmt = date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <>
      <style>{`
        @keyframes fireflyFloat {
          0% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          50% { opacity: 1; }
          100% { transform: translate(${20}px, ${-30}px) scale(1.5); opacity: 0.2; }
        }
      `}</style>

      <div className={isThumbnail ? "min-h-full" : "min-h-screen"} style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>

        {/* ── HERO ─────────────────────────────────── */}
        <section className={`relative flex flex-col items-center justify-center text-center overflow-hidden px-6 ${isThumbnail ? "min-h-[812px]" : "min-h-screen"}`}
          style={{ background: "linear-gradient(160deg, #0D2218 0%, #1A3C34 60%, #0A1A10 100%)" }}>
          {fireflies.map((s, i) => <Firefly key={i} style={s} />)}
          <BranchSVG />

          <div className="relative z-10 max-w-4xl">
            <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5 }}
              className="w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center text-3xl"
              style={{ background: "rgba(184,115,51,0.1)", border: "1px solid rgba(184,115,51,0.3)" }}>
              🌲
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="font-sans text-xs uppercase tracking-[0.5em] mb-10" style={{ color: "#B87333" }}>
              A Forest Wedding
            </motion.p>

            <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-light leading-none" style={{ color: "#F0EAD6", fontSize: "clamp(3rem, 11vw, 8rem)" }}>
              {brideName}
            </motion.h1>

            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.5, duration: 1.5 }}
              className="mx-auto my-5 h-px" style={{ width: 120, background: "linear-gradient(to right, transparent, #B87333, transparent)" }} />

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
              className="text-3xl font-light italic my-3" style={{ color: "#B87333" }}>&amp;</motion.p>

            <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, delay: 1, ease: [0.22, 1, 0.36, 1] }}
              className="font-light leading-none" style={{ color: "#F0EAD6", fontSize: "clamp(3rem, 11vw, 8rem)" }}>
              {groomName}
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2 }}
              className="font-sans text-base tracking-widest mt-8" style={{ color: "#A8C8A0" }}>{fmt}</motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8 }}
              className="font-sans text-sm mt-2" style={{ color: "#6A8F6A" }}>{venue}</motion.p>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <ChevronDown className="w-5 h-5" style={{ color: "#B87333" }} />
            </motion.div>
          </motion.div>
        </section>

        {/* ── COUNTDOWN ───────────────────────────── */}
        <section className="py-20 text-center" style={{ background: "#F5F0E8" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="font-sans text-xs uppercase tracking-[0.4em] mb-10" style={{ color: "#B87333" }}>Until the Forest Ceremony</p>
            <div className="flex gap-4 md:gap-10 justify-center flex-wrap">
              {[{ label: "Days", v: time.days }, { label: "Hours", v: time.hours }, { label: "Minutes", v: time.minutes }, { label: "Seconds", v: time.seconds }].map(i => (
                <div key={i.label} className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-2xl font-light"
                    style={{ background: "linear-gradient(135deg, #1A3C34, #2D5A4A)", color: "#B87333", boxShadow: "0 8px 30px rgba(26,60,52,0.3)" }}>
                    {String(i.v).padStart(2, "0")}
                  </div>
                  <span className="font-sans text-[10px] uppercase tracking-widest" style={{ color: "#8FAF7E" }}>{i.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── EVENTS ──────────────────────────────── */}
        <section className="py-24 px-4" style={{ background: "white" }}>
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <p className="font-sans text-xs uppercase tracking-[0.4em] mb-3" style={{ color: "#B87333" }}>In the Forest Clearing</p>
              <h2 className="text-4xl font-light" style={{ color: "#1A3C34" }}>The Events</h2>
            </motion.div>
            <div className="space-y-6">
              {events.map((ev, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                  className="flex gap-5 p-8 rounded-3xl" style={{ background: "linear-gradient(135deg, #F5F0E8, #EDE6D8)", border: "1px solid #D4C8A8" }}>
                  <div className="w-1 rounded-full shrink-0" style={{ background: "linear-gradient(to bottom, #1A3C34, #B87333)" }} />
                  <div>
                    <p className="font-sans text-xs uppercase tracking-widest mb-2" style={{ color: "#B87333" }}>Event {i + 1}</p>
                    <h3 className="text-2xl font-light mb-2" style={{ color: "#1A3C34" }}>{ev.name}</h3>
                    {ev.description && <p className="font-sans text-sm mb-4" style={{ color: "#5A7A5A" }}>{ev.description}</p>}
                    <div className="flex flex-wrap gap-4 font-sans text-xs" style={{ color: "#8FAF7E" }}>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{ev.time}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{ev.location}</span>
                    </div>
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.location)}`} target="_blank" rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all duration-300 hover:bg-[#1A3C34] hover:text-[#B87333] hover:border-[#1A3C34]"
                      style={{ borderColor: "#D4C8A8", color: "#B87333" }}>
                      <MapIcon className="w-3 h-3" /> Open in Maps
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── GALLERY ─────────────────────────────── */}
        {gallery.length > 0 && (
          <section className="py-24 px-4" style={{ background: "#F5F0E8" }}>
            <div className="max-w-5xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                <h2 className="text-4xl font-light" style={{ color: "#1A3C34" }}>Captured in the Forest</h2>
              </motion.div>
              <div className="columns-2 md:columns-3 gap-4 space-y-4">
                {gallery.map((img, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }} className="overflow-hidden rounded-2xl" style={{ breakInside: "avoid" }}>
                    <img src={img.url} alt="" className="w-full object-cover transition-transform duration-700 hover:scale-105 sepia-[0.2]" />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FOOTER ──────────────────────────────── */}
        <section className="py-20 text-center" style={{ background: "linear-gradient(160deg, #0D2218, #1A3C34)" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-4xl mb-6">🌿</div>
            <h2 className="text-3xl font-light mb-2" style={{ color: "#F0EAD6" }}>Meet Us in the Clearing</h2>
            <p className="font-sans text-sm mb-10" style={{ color: "#8FAF7E" }}>{venue}</p>
            {!isPreview && invitationId && <RSVPModal invitationId={invitationId} />}
          </motion.div>
        </section>
      </div>
    </>
  );
}
