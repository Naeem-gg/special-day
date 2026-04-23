"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Crown, ChevronDown } from "lucide-react";
import type { TemplateProps } from "./types";
import RSVPModal from "@/components/invitation/RSVPModal";

function OrnateBorder() {
  return (
    <div className="absolute inset-4 md:inset-8 pointer-events-none z-0">
      <svg className="w-full h-full" viewBox="0 0 800 800" preserveAspectRatio="none" fill="none">
        {/* Corners */}
        <motion.path d="M10 60 L10 10 L60 10" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.5 }} />
        <motion.path d="M740 10 L790 10 L790 60" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.7 }} />
        <motion.path d="M10 740 L10 790 L60 790" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.9 }} />
        <motion.path d="M790 740 L790 790 L740 790" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 1.1 }} />
        {/* Top decorative flourish */}
        <motion.path d="M350 10 Q400 30, 450 10" stroke="#D4AF37" strokeWidth="1.5" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 1.5 }} />
        <motion.circle cx="400" cy="10" r="4" fill="#D4AF37"
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2 }} />
        {/* Side flourishes */}
        <motion.path d="M10 350 Q30 400, 10 450" stroke="#D4AF37" strokeWidth="1.5" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 1.8 }} />
        <motion.path d="M790 350 Q770 400, 790 450" stroke="#D4AF37" strokeWidth="1.5" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 2 }} />
      </svg>
    </div>
  );
}

function MughalDivider() {
  return (
    <div className="flex justify-center my-6">
      <svg width="300" height="30" viewBox="0 0 300 30" fill="none">
        <motion.path d="M0 15 Q37 5, 75 15 Q112 25, 150 15 Q188 5, 225 15 Q262 25, 300 15"
          stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.6"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2 }} />
        <motion.path d="M120 15 Q150 5, 180 15" stroke="#D4AF37" strokeWidth="1.5" fill="none"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 1 }} />
        <motion.circle cx="150" cy="12" r="3" fill="#D4AF37" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 1.5 }} />
      </svg>
    </div>
  );
}

export default function RoyalGoldTemplate({ brideName, groomName, date, venue, events, gallery, isPreview, isThumbnail, invitationId, tier }: TemplateProps) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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
        @keyframes curtainReveal {
          from { clip-path: inset(0 50% 0 50%); }
          to { clip-path: inset(0 0% 0 0%); }
        }
        .curtain { animation: curtainReveal 2s ease-out forwards; }
        @keyframes royalShimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .royal-text {
          background: linear-gradient(90deg, #8B0000, #D4AF37, #6B1A2B, #D4AF37, #8B0000);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: royalShimmer 5s ease-in-out infinite;
        }
      `}</style>

      <div className={isThumbnail ? "min-h-full" : "min-h-screen"} style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>

        {/* ── HERO ─────────────────────────────────── */}
        <section className={`relative flex flex-col items-center justify-center text-center overflow-hidden px-6 ${isThumbnail ? "min-h-[812px]" : "min-h-screen"}`}
          style={{ background: "linear-gradient(160deg, #1A0008 0%, #3A0A14 50%, #1A0008 100%)" }}>
          <OrnateBorder />

          {/* Velvet texture overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-10"
            style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(212,175,55,0.1) 0px, transparent 1px, transparent 4px, rgba(212,175,55,0.05) 5px)" }} />

          <div className="relative z-10 max-w-3xl curtain">
            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, delay: 0.3 }}
              className="w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center"
              style={{ border: "2px solid #D4AF37", background: "rgba(212,175,55,0.1)" }}>
              <Crown className="w-8 h-8" style={{ color: "#D4AF37" }} />
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              className="font-sans text-[10px] uppercase tracking-[0.6em] mb-6" style={{ color: "#D4AF37" }}>
              بسم اللہ الرحمن الرحیم · With God's Blessings
            </motion.p>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              className="font-sans text-xs tracking-[0.4em] mb-8" style={{ color: "#A08080" }}>
              The families of
            </motion.p>

            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 1.3 }}
              className="royal-text font-light leading-none" style={{ fontSize: "clamp(3rem, 10vw, 7.5rem)" }}>
              {brideName}
            </motion.h1>

            <MughalDivider />

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
              className="text-xl font-light italic my-2" style={{ color: "rgba(212,175,55,0.6)" }}>
              &amp;
            </motion.p>

            <MughalDivider />

            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 1.3 }}
              className="royal-text font-light leading-none" style={{ fontSize: "clamp(3rem, 10vw, 7.5rem)" }}>
              {groomName}
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
              className="font-sans text-sm tracking-[0.3em] mt-8" style={{ color: "#A08080" }}>
              Request the honour of your presence at their Walima
            </motion.p>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3 }}
              className="font-sans text-base tracking-widest mt-6" style={{ color: "#D4AF37" }}>{fmt}</motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.5 }}
              className="font-sans text-sm mt-2" style={{ color: "#806060" }}>{venue}</motion.p>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <ChevronDown className="w-5 h-5" style={{ color: "#D4AF37" }} />
            </motion.div>
          </motion.div>
        </section>

        {/* ── COUNTDOWN ───────────────────────────── */}
        <section className="py-20 text-center" style={{ background: "#FFFBF0" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="font-sans text-xs uppercase tracking-[0.5em] mb-10" style={{ color: "#D4AF37" }}>Royal Countdown</p>
            <div className="flex gap-4 md:gap-10 justify-center flex-wrap">
              {[{ label: "Days", v: time.days }, { label: "Hours", v: time.hours }, { label: "Minutes", v: time.minutes }, { label: "Seconds", v: time.seconds }].map(i => (
                <div key={i.label} className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center text-2xl font-light"
                    style={{ border: "1px solid #D4AF37", color: "#6B1A2B", background: "white" }}>
                    {String(i.v).padStart(2, "0")}
                  </div>
                  <span className="font-sans text-[10px] uppercase tracking-widest" style={{ color: "#D4AF37" }}>{i.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── EVENTS ──────────────────────────────── */}
        <section className="py-24 px-4" style={{ background: "white" }}>
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <p className="font-sans text-xs uppercase tracking-[0.5em] mb-3" style={{ color: "#D4AF37" }}>Royal Programme</p>
              <h2 className="text-4xl font-light" style={{ color: "#3A0A14" }}>The Events</h2>
              <MughalDivider />
            </motion.div>
            <div className="space-y-6">
              {events.map((ev, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                  className="p-8 relative overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #FFF9F0, #FFFBF5)", border: "1px solid #E8D09A" }}>
                  <div className="absolute top-0 right-0 w-12 h-12 pointer-events-none opacity-20"
                    style={{ backgroundImage: "radial-gradient(circle, #D4AF37, transparent)", backgroundSize: "100%" }} />
                  <p className="font-sans text-xs uppercase tracking-widest mb-2" style={{ color: "#D4AF37" }}>✦ Event {i + 1} ✦</p>
                  <h3 className="text-2xl font-light mb-2" style={{ color: "#3A0A14" }}>{ev.name}</h3>
                  {ev.description && <p className="font-sans text-sm mb-4" style={{ color: "#8A6A5A" }}>{ev.description}</p>}
                  <div className="flex flex-wrap gap-4 font-sans text-xs" style={{ color: "#B0906A" }}>
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
          <section className="py-24 px-4" style={{ background: "#FFF9F0" }}>
            <div className="max-w-5xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                <h2 className="text-4xl font-light" style={{ color: "#3A0A14" }}>Royal Portraits</h2>
              </motion.div>
              <div className="columns-2 md:columns-3 gap-4 space-y-4">
                {gallery.map((img, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="overflow-hidden" style={{ breakInside: "avoid", border: "2px solid #E8D09A" }}>
                    <img src={img.url} alt="" className="w-full object-cover transition-transform duration-700 hover:scale-105" />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FOOTER ──────────────────────────────── */}
        <section className="py-20 text-center" style={{ background: "linear-gradient(160deg, #1A0008, #3A0A14)" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Crown className="w-8 h-8 mx-auto mb-6" style={{ color: "#D4AF37" }} />
            <h2 className="text-3xl font-light mb-2" style={{ color: "#FFFBF0" }}>Your Grace Honours Us</h2>
            <p className="font-sans text-sm mb-10" style={{ color: "#806060" }}>{venue}</p>
            {!isPreview && invitationId && <RSVPModal invitationId={invitationId} />}
          </motion.div>
        </section>
      </div>
    </>
  );
}
