"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, ChevronDown } from "lucide-react";
import type { TemplateProps } from "./types";
import RSVPModal from "@/components/invitation/RSVPModal";

function WaveDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div className={`w-full overflow-hidden leading-none ${flip ? "rotate-180" : ""}`} style={{ height: 70 }}>
      <svg viewBox="0 0 1200 70" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
        <motion.path
          d="M0 35 Q150 5, 300 35 Q450 65, 600 35 Q750 5, 900 35 Q1050 65, 1200 35 L1200 70 L0 70Z"
          fill="rgba(78,205,196,0.15)"
          initial={{ d: "M0 70 Q300 70, 600 70 Q900 70, 1200 70 L1200 70 L0 70Z" }}
          whileInView={{ d: "M0 35 Q150 5, 300 35 Q450 65, 600 35 Q750 5, 900 35 Q1050 65, 1200 35 L1200 70 L0 70Z" }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <motion.path
          d="M0 45 Q200 15, 400 45 Q600 75, 800 45 Q1000 15, 1200 45 L1200 70 L0 70Z"
          fill="rgba(10,63,107,0.08)"
          initial={{ d: "M0 70 Q400 70, 800 70 Q1000 70, 1200 70 L1200 70 L0 70Z" }}
          whileInView={{ d: "M0 45 Q200 15, 400 45 Q600 75, 800 45 Q1000 15, 1200 45 L1200 70 L0 70Z" }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: "easeOut", delay: 0.2 }}
        />
      </svg>
    </div>
  );
}

function Bubble({ style }: { style: React.CSSProperties }) {
  return <div className="absolute rounded-full pointer-events-none" style={{ ...style, background: "radial-gradient(circle, rgba(78,205,196,0.2), transparent)", border: "1px solid rgba(78,205,196,0.15)" }} />;
}

export default function AzureOceanTemplate({ brideName, groomName, date, venue, events, gallery, isPreview, isThumbnail, invitationId, tier }: TemplateProps) {
  const [bubbles, setBubbles] = useState<React.CSSProperties[]>([]);
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setBubbles(Array.from({ length: 12 }, () => ({
      width: 20 + Math.random() * 60,
      height: 20 + Math.random() * 60,
      left: `${Math.random() * 100}%`,
      bottom: `${Math.random() * 80}%`,
      animation: `bubbleRise ${4 + Math.random() * 6}s ${Math.random() * 8}s infinite ease-in`,
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
        @keyframes bubbleRise {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          20% { opacity: 0.6; }
          100% { transform: translateY(-300px) scale(1.2); opacity: 0; }
        }
        @keyframes waveAnim {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-50px); }
        }
      `}</style>

      <div className={isThumbnail ? "min-h-full" : "min-h-screen"} style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>

        {/* ── HERO ─────────────────────────────────── */}
        <section className={`relative flex flex-col items-center justify-center text-center overflow-hidden px-6 ${isThumbnail ? "min-h-[812px]" : "min-h-screen"}`}
          style={{ background: "linear-gradient(180deg, #0A1628 0%, #0A3F6B 50%, #1A6B8A 100%)" }}>
          {bubbles.map((s, i) => <Bubble key={i} style={s} />)}

          {/* Ocean surface shimmer */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(78,205,196,0.15) 0%, transparent 70%)" }} />

          <div className="relative z-10 max-w-4xl">
            <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5 }}
              className="text-5xl mb-8">🌊</motion.div>

            <motion.p initial={{ opacity: 0, letterSpacing: "0.8em" }} animate={{ opacity: 1, letterSpacing: "0.4em" }}
              transition={{ duration: 2 }} className="font-sans text-xs uppercase mb-10 text-teal-300">
              A Coastal Celebration
            </motion.p>

            <motion.h1 initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="font-light leading-none text-white" style={{ fontSize: "clamp(3rem, 11vw, 8rem)" }}>
              {brideName}
            </motion.h1>

            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.5, duration: 1.5 }}
              className="mx-auto my-4 h-px" style={{ width: 100, background: "linear-gradient(to right, transparent, #4ECDC4, transparent)" }} />

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
              className="text-2xl font-light italic my-3 text-teal-300">&amp;</motion.p>

            <motion.h1 initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="font-light leading-none text-white" style={{ fontSize: "clamp(3rem, 11vw, 8rem)" }}>
              {groomName}
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2 }}
              className="font-sans text-base mt-8 text-teal-200 tracking-widest">{fmt}</motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8 }}
              className="font-sans text-sm mt-2 text-blue-300">{venue}</motion.p>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <ChevronDown className="w-5 h-5 text-teal-300" />
            </motion.div>
          </motion.div>

          <div className="absolute bottom-0 left-0 right-0"><WaveDivider /></div>
        </section>

        {/* ── COUNTDOWN ───────────────────────────── */}
        <section className="py-20 text-center" style={{ background: "#F0FAFC" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="font-sans text-xs uppercase tracking-[0.4em] mb-10 text-teal-600">Until We Set Sail Together</p>
            <div className="flex gap-4 md:gap-10 justify-center flex-wrap">
              {[{ label: "Days", v: time.days }, { label: "Hours", v: time.hours }, { label: "Minutes", v: time.minutes }, { label: "Seconds", v: time.seconds }].map(i => (
                <div key={i.label} className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-2xl font-light"
                    style={{ background: "linear-gradient(135deg, #0A3F6B, #1A6B8A)", color: "#4ECDC4", boxShadow: "0 8px 30px rgba(10,63,107,0.2)" }}>
                    {String(i.v).padStart(2, "0")}
                  </div>
                  <span className="font-sans text-[10px] uppercase tracking-widest text-teal-500">{i.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── EVENTS ──────────────────────────────── */}
        <section className="py-24 px-4" style={{ background: "white" }}>
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <p className="font-sans text-xs uppercase tracking-[0.4em] mb-3 text-teal-500">What's Planned</p>
              <h2 className="text-4xl font-light" style={{ color: "#0A3F6B" }}>Shore-side Events</h2>
              <div className="mx-auto mt-4 h-px" style={{ width: 60, background: "linear-gradient(to right, transparent, #4ECDC4, transparent)" }} />
            </motion.div>
            <div className="space-y-6">
              {events.map((ev, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                  className="p-8 rounded-3xl overflow-hidden relative"
                  style={{ background: "linear-gradient(135deg, #F0FAFC, #EBF8FF)", border: "1px solid #B2E8E8" }}>
                  <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-20"
                    style={{ background: "linear-gradient(135deg, #4ECDC4, #0A3F6B)" }} />
                  <p className="font-sans text-xs uppercase tracking-widest mb-2 text-teal-500">Event {i + 1}</p>
                  <h3 className="text-2xl font-light mb-2" style={{ color: "#0A3F6B" }}>{ev.name}</h3>
                  {ev.description && <p className="font-sans text-sm mb-4 text-teal-700">{ev.description}</p>}
                  <div className="flex flex-wrap gap-4 font-sans text-xs text-teal-500">
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
          <section className="py-24 px-4" style={{ background: "#F0FAFC" }}>
            <div className="max-w-5xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                <h2 className="text-4xl font-light" style={{ color: "#0A3F6B" }}>Our Voyage in Photos</h2>
              </motion.div>
              <div className="columns-2 md:columns-3 gap-4 space-y-4">
                {gallery.map((img, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className="overflow-hidden rounded-2xl border border-teal-100" style={{ breakInside: "avoid" }}>
                    <img src={img.url} alt="" className="w-full object-cover transition-transform duration-700 hover:scale-105" />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FOOTER ──────────────────────────────── */}
        <section className="py-20 text-center" style={{ background: "linear-gradient(180deg, #0A3F6B, #0A1628)" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-4xl mb-6">⚓</div>
            <h2 className="text-3xl font-light mb-2 text-white">Join Us Dockside</h2>
            <p className="font-sans text-sm mb-10 text-blue-300">{venue}</p>
            {!isPreview && invitationId && tier !== "basic" && <RSVPModal invitationId={invitationId} />}
          </motion.div>
        </section>
      </div>
    </>
  );
}
