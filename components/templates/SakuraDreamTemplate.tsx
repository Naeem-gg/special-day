"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, ChevronDown } from "lucide-react";
import type { TemplateProps } from "./types";
import RSVPModal from "@/components/invitation/RSVPModal";

function SakuraPetal({ style }: { style: React.CSSProperties }) {
  return (
    <div className="absolute pointer-events-none select-none" style={style}>
      <svg width="12" height="14" viewBox="0 0 12 14">
        <ellipse cx="6" cy="7" rx="5" ry="6" fill="#FFB7C5" opacity="0.65" transform={`rotate(${Math.random() * 40 - 20} 6 7)`} />
      </svg>
    </div>
  );
}

export default function SakuraDreamTemplate({ brideName, groomName, date, venue, events, gallery, isPreview, isThumbnail, invitationId, tier }: TemplateProps) {
  const [petals, setPetals] = useState<React.CSSProperties[]>([]);
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setPetals(Array.from({ length: 20 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `-20px`,
      animation: `sakuraFall ${6 + Math.random() * 9}s ${Math.random() * 12}s infinite ease-in-out`,
    })));
  }, []);

  useEffect(() => {
    const tick = () => {
      const d = Math.max(0, date.getTime() - Date.now());
      setTime({ days: Math.floor(d / 86400000), hours: Math.floor((d % 86400000) / 3600000), minutes: Math.floor((d % 3600000) / 60000), seconds: Math.floor((d % 60000) / 1000) });
    };
    tick(); const t = setInterval(tick, 1000); return () => clearInterval(t);
  }, [date]);

  const fmt = date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <>
      <style>{`
        @keyframes sakuraFall {
          0% { transform: translateY(-20px) rotate(0deg) translateX(0); opacity: 0; }
          15% { opacity: 0.8; }
          85% { opacity: 0.6; }
          100% { transform: translateY(${isThumbnail ? '812px' : '100vh'}) rotate(540deg) translateX(60px); opacity: 0; }
        }
        @keyframes brushStroke {
          from { stroke-dashoffset: 400; }
          to { stroke-dashoffset: 0; }
        }
        .brush-stroke {
          stroke-dasharray: 400;
          animation: brushStroke 2s ease forwards;
        }
      `}</style>

      <div className={isThumbnail ? "min-h-full" : "min-h-screen"} style={{ fontFamily: "'Playfair Display', Georgia, serif", background: "#FFFAFD" }}>

        {/* ── HERO ─────────────────────────────────── */}
        <section className={`relative flex flex-col items-center justify-center text-center overflow-hidden px-6 ${isThumbnail ? "min-h-[812px]" : "min-h-screen"}`}
          style={{ background: "linear-gradient(160deg, #FFF0F8 0%, #FAF0FF 50%, #FFF5F0 100%)" }}>
          {petals.map((s, i) => <SakuraPetal key={i} style={s} />)}

          {/* Brushstroke SVG decoration */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg width="600" height="300" viewBox="0 0 600 300" fill="none" className="opacity-5" preserveAspectRatio="xMidYMid meet">
              <path d="M100 150 Q300 50, 500 150 Q300 250, 100 150Z" stroke="#D4B4FD" strokeWidth="2" fill="none" className="brush-stroke" />
            </svg>
          </div>

          <div className="relative z-10 max-w-3xl">
            <motion.p initial={{ opacity: 0, letterSpacing: "0.8em" }} animate={{ opacity: 1, letterSpacing: "0.5em" }}
              transition={{ duration: 2 }} className={`font-sans text-[10px] uppercase ${isThumbnail ? "mb-6" : "mb-12"}`} style={{ color: "#C4A0C8" }}>
              花嫁と花婿 · Bride &amp; Groom
            </motion.p>

            {/* Decorative circle */}
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.5, delay: 0.3 }}
              className={`rounded-full mx-auto mb-6 flex flex-col items-center justify-center ${isThumbnail ? "w-32 h-32" : "w-48 h-48 md:w-64 md:h-64"}`}
              style={{ background: "radial-gradient(circle, rgba(212,180,253,0.15) 0%, rgba(255,183,197,0.08) 100%)", border: "1px solid rgba(212,180,253,0.3)" }}>
              <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                className={`font-light leading-snug text-center ${isThumbnail ? "text-lg" : "text-2xl md:text-3xl"}`} style={{ color: "#4A2060" }}>
                {brideName}<br />
                <span className={`${isThumbnail ? "text-xs" : "text-base"} font-light italic`} style={{ color: "#D4B4FD" }}>&amp;</span><br />
                {groomName}
              </motion.h1>
            </motion.div>

            {/* Large names outside */}
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 1.2 }}>
              <h2 className={`font-light tracking-tight leading-tight ${isThumbnail ? "text-2xl" : "text-5xl md:text-8xl"}`} style={{ color: "#4A2060" }}>
                {brideName}
                <span className={`${isThumbnail ? "text-lg" : "text-3xl"} font-light italic mx-4`} style={{ color: "#FFB7C5" }}>&amp;</span>
                {groomName}
              </h2>
            </motion.div>

            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 2.5, duration: 1.5 }}
              className={`mx-auto h-px ${isThumbnail ? "my-4" : "my-8"}`} style={{ width: 100, background: "linear-gradient(to right, transparent, #D4B4FD, transparent)" }} />

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}
              className="font-sans text-base tracking-[0.3em]" style={{ color: "#C4A0C8" }}>{fmt}</motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.5 }}
              className="font-sans text-sm mt-2" style={{ color: "#D4B4FD" }}>{venue}</motion.p>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <ChevronDown className="w-5 h-5" style={{ color: "#D4B4FD" }} />
            </motion.div>
          </motion.div>
        </section>

        {/* ── COUNTDOWN ───────────────────────────── */}
        <section className="py-20 text-center" style={{ background: "white" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="font-sans text-[10px] uppercase tracking-[0.5em] mb-10" style={{ color: "#D4B4FD" }}>Until Our Special Day</p>
            <div className="flex gap-4 md:gap-8 justify-center flex-wrap">
              {[{ label: "Days", v: time.days }, { label: "Hours", v: time.hours }, { label: "Min", v: time.minutes }, { label: "Sec", v: time.seconds }].map(i => (
                <div key={i.label} className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-2xl font-light transition-all duration-500"
                    style={{ background: "linear-gradient(135deg, #FFF0F8, #FAF0FF)", color: "#4A2060", boxShadow: "0 4px 20px rgba(212,180,253,0.2)" }}>
                    {String(i.v).padStart(2, "0")}
                  </div>
                  <span className="font-sans text-[9px] uppercase tracking-widest" style={{ color: "#D4B4FD" }}>{i.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── EVENTS ──────────────────────────────── */}
        <section className="py-24 px-4" style={{ background: "#FAF5FF" }}>
          <div className="max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <p className="font-sans text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: "#D4B4FD" }}>Our Ceremony</p>
              <h2 className="text-4xl font-light" style={{ color: "#4A2060" }}>Events &amp; Schedule</h2>
            </motion.div>
            <div className="space-y-8">
              {events.map((ev, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                  className="relative pl-10 pb-8 border-l" style={{ borderColor: "#F0D8FF" }}>
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full"
                    style={{ background: "linear-gradient(135deg, #D4B4FD, #FFB7C5)" }} />
                  <p className="font-sans text-[10px] uppercase tracking-widest mb-1" style={{ color: "#D4B4FD" }}>Event {i + 1}</p>
                  <h3 className="text-2xl font-light mb-2" style={{ color: "#4A2060" }}>{ev.name}</h3>
                  {ev.description && <p className="font-sans text-sm mb-3" style={{ color: "#9B7BB0" }}>{ev.description}</p>}
                  <div className="flex flex-wrap gap-4 font-sans text-xs" style={{ color: "#C4A0C8" }}>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{ev.time}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{ev.location}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── GALLERY ─────────────────────────────── */}
        {gallery.length > 0 && (
          <section className="py-24 px-4" style={{ background: "white" }}>
            <div className="max-w-5xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                <h2 className="text-4xl font-light" style={{ color: "#4A2060" }}>Moments Together</h2>
              </motion.div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.map((img, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className="overflow-hidden rounded-3xl aspect-square">
                    <img src={img.url} alt="" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FOOTER ──────────────────────────────── */}
        <section className="py-20 text-center" style={{ background: "linear-gradient(160deg, #FFF0F8, #FAF0FF)" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-4xl mb-6">🌸</div>
            <h2 className="text-3xl font-light mb-2" style={{ color: "#4A2060" }}>We Can't Wait to See You</h2>
            <p className="font-sans text-sm mb-10" style={{ color: "#C4A0C8" }}>{venue}</p>
            {!isPreview && invitationId && tier !== "basic" && <RSVPModal invitationId={invitationId} />}
          </motion.div>
        </section>
      </div>
    </>
  );
}
