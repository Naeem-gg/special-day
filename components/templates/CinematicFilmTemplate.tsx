"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Clock, Film, ChevronDown } from "lucide-react";
import type { TemplateProps } from "./types";
import RSVPModal from "@/components/invitation/RSVPModal";

function FilmGrain() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.04]"
      style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox%3D%220 0 256 256%22 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter id%3D%22noise%22%3E%3CfeTurbulence type%3D%22fractalNoise%22 baseFrequency%3D%220.9%22 numOctaves%3D%224%22 stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect width%3D%22100%25%22 height%3D%22100%25%22 filter%3D%22url(%23noise)%22%2F%3E%3C%2Fsvg%3E')", backgroundRepeat: "repeat", backgroundSize: "150px" }} />
  );
}

function FilmStrip({ side }: { side: "left" | "right" }) {
  return (
    <div className={`absolute top-0 bottom-0 ${side === "left" ? "left-0" : "right-0"} w-8 flex flex-col justify-around pointer-events-none`}
      style={{ background: "#111", zIndex: 2 }}>
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="mx-1 rounded-sm" style={{ height: 14, background: "#222", boxShadow: "inset 0 0 2px rgba(255,255,255,0.1)" }} />
      ))}
    </div>
  );
}

export default function CinematicFilmTemplate({ brideName, groomName, date, venue, events, gallery, isPreview, invitationId }: TemplateProps) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [countdown, setCountdown] = useState(5);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Film countdown intro
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(timer); setShowContent(true); return 0; }
        return c - 1;
      });
    }, 600);
    return () => clearInterval(timer);
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
        @keyframes flicker { 0%, 98%, 100% { opacity: 1; } 99% { opacity: 0.7; } }
        @keyframes scratch { 0%, 100% { opacity: 0; } 20%, 80% { opacity: 0.15; } }
        .film-flicker { animation: flicker 4s infinite; }
        .film-scratch { animation: scratch 8s infinite; }
      `}</style>

      <div className="min-h-screen" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>

        {/* ── FILM COUNTDOWN INTRO ─────────────────── */}
        {!showContent && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "#0A0A0A" }} exit={{ opacity: 0 }}>
            <FilmStrip side="left" />
            <FilmStrip side="right" />
            <FilmGrain />
            <div className="text-center z-10">
              <motion.div key={countdown}
                initial={{ scale: 1.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="film-flicker text-[12rem] font-light leading-none" style={{ color: "#C0A060", fontFamily: "Georgia, serif" }}>
                {countdown}
              </motion.div>
              <div className="text-xs uppercase tracking-[0.5em] mt-4" style={{ color: "#666" }}>An Invitation Feature Presentation</div>
            </div>
          </motion.div>
        )}

        {/* ── HERO ─────────────────────────────────── */}
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden px-10"
          style={{ background: "#0A0A0A" }}>
          <FilmStrip side="left" />
          <FilmStrip side="right" />
          <FilmGrain />

          {/* Letterbox bars */}
          <div className="absolute top-0 left-0 right-0 h-16 z-10" style={{ background: "#000" }} />
          <div className="absolute bottom-0 left-0 right-0 h-16 z-10" style={{ background: "#000" }} />

          {/* Scratch lines */}
          <div className="film-scratch absolute top-0 bottom-0 w-px left-1/3 z-20" style={{ background: "rgba(255,255,255,0.5)" }} />

          {showContent && (
            <div className="relative z-10 max-w-4xl film-flicker">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="flex items-center gap-3 justify-center mb-8">
                <div className="h-px flex-1" style={{ background: "#C0A060" }} />
                <Film className="w-5 h-5" style={{ color: "#C0A060" }} />
                <div className="h-px flex-1" style={{ background: "#C0A060" }} />
              </motion.div>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="font-sans text-xs uppercase tracking-[0.6em] mb-6" style={{ color: "#888" }}>
                A{new Date().getFullYear()} Motion Picture Invitation
              </motion.p>

              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                className="font-light leading-none" style={{ color: "#F0EAD6", fontSize: "clamp(3rem, 10vw, 7rem)" }}>
                {brideName}
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                className="text-xl font-light italic my-3" style={{ color: "#C0A060" }}>and</motion.p>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
                className="font-light leading-none" style={{ color: "#F0EAD6", fontSize: "clamp(3rem, 10vw, 7rem)" }}>
                {groomName}
              </motion.h1>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                className="mt-8 space-y-1">
                <p className="font-sans text-sm tracking-widest" style={{ color: "#C0A060" }}>{fmt}</p>
                <p className="font-sans text-xs" style={{ color: "#666" }}>{venue}</p>
              </motion.div>
            </div>
          )}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20">
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <ChevronDown className="w-5 h-5" style={{ color: "#C0A060" }} />
            </motion.div>
          </motion.div>
        </section>

        {/* ── COUNTDOWN ───────────────────────────── */}
        <section className="py-20 text-center" style={{ background: "#111" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="font-sans text-xs uppercase tracking-[0.4em] mb-10" style={{ color: "#C0A060" }}>Feature Presentation Begins In</p>
            <div className="flex gap-4 md:gap-10 justify-center flex-wrap">
              {[{ label: "Days", v: time.days }, { label: "Hours", v: time.hours }, { label: "Minutes", v: time.minutes }, { label: "Seconds", v: time.seconds }].map(i => (
                <div key={i.label} className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-none border flex items-center justify-center text-2xl font-light"
                    style={{ borderColor: "#C0A060", color: "#F0EAD6", background: "#0A0A0A" }}>
                    {String(i.v).padStart(2, "0")}
                  </div>
                  <span className="font-sans text-[10px] uppercase tracking-widest" style={{ color: "#666" }}>{i.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── EVENTS ──────────────────────────────── */}
        <section className="py-24 px-4" style={{ background: "#F0EAD6" }}>
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <p className="font-sans text-xs uppercase tracking-[0.4em] mb-3" style={{ color: "#C0A060" }}>Coming Attractions</p>
              <h2 className="text-4xl font-light" style={{ color: "#1A1008" }}>The Schedule</h2>
              <div className="mx-auto mt-4 h-px" style={{ width: 60, background: "linear-gradient(to right, transparent, #C0A060, transparent)" }} />
            </motion.div>
            <div className="space-y-6">
              {events.map((ev, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                  className="p-8 border-l-4" style={{ background: "white", borderColor: "#C0A060" }}>
                  <div className="flex items-start gap-4">
                    <div className="font-sans text-3xl font-light" style={{ color: "#C0A060" }}>{String(i + 1).padStart(2, "0")}</div>
                    <div>
                      <h3 className="text-2xl font-light mb-2" style={{ color: "#1A1008" }}>{ev.name}</h3>
                      {ev.description && <p className="font-sans text-sm mb-4" style={{ color: "#5A4A30" }}>{ev.description}</p>}
                      <div className="flex flex-wrap gap-4 font-sans text-xs" style={{ color: "#8A7A60" }}>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{ev.time}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{ev.location}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── GALLERY ─────────────────────────────── */}
        {gallery.length > 0 && (
          <section className="py-24 px-4" style={{ background: "#1A1008" }}>
            <div className="max-w-5xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                <h2 className="text-4xl font-light" style={{ color: "#F0EAD6" }}>The Reel</h2>
              </motion.div>
              <div className="columns-2 md:columns-3 gap-4 space-y-4">
                {gallery.map((img, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }} className="overflow-hidden rounded-none border border-amber-900/30" style={{ breakInside: "avoid" }}>
                    <img src={img.url} alt="" className="w-full object-cover transition-transform duration-700 hover:scale-105 sepia-[0.4] brightness-90" />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FOOTER ──────────────────────────────── */}
        <section className="py-20 text-center" style={{ background: "#0A0A0A" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Film className="w-8 h-8 mx-auto mb-6" style={{ color: "#C0A060" }} />
            <h2 className="text-3xl font-light mb-2" style={{ color: "#F0EAD6" }}>The Finale — Join Us</h2>
            <p className="font-sans text-sm mb-10" style={{ color: "#666" }}>{venue}</p>
            {!isPreview && invitationId && <RSVPModal invitationId={invitationId} />}
          </motion.div>
        </section>
      </div>
    </>
  );
}
