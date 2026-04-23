"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, ChevronDown, Star } from "lucide-react";
import type { TemplateProps } from "./types";
import RSVPModal from "@/components/invitation/RSVPModal";

function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5,
      speed: 0.2 + Math.random() * 0.5,
      brightness: Math.random(),
      delta: (Math.random() - 0.5) * 0.02,
    }));

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.brightness += s.delta;
        if (s.brightness > 1 || s.brightness < 0) s.delta *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${s.brightness})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}

export default function MidnightNoirTemplate({ brideName, groomName, date, venue, events, gallery, isPreview, isThumbnail, invitationId, tier }: TemplateProps) {
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
        @keyframes goldGlow {
          0%, 100% { text-shadow: 0 0 20px rgba(201,168,76,0.4), 0 0 40px rgba(201,168,76,0.2); }
          50% { text-shadow: 0 0 30px rgba(201,168,76,0.7), 0 0 60px rgba(201,168,76,0.4); }
        }
        @keyframes spotlightSweep {
          0% { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(200%) skewX(-20deg); }
        }
        .glow-text { animation: goldGlow 3s ease-in-out infinite; }
        .spotlight { animation: spotlightSweep 4s ease-in-out forwards; }
      `}</style>

      <div className={isThumbnail ? "min-h-full" : "min-h-screen"} style={{ fontFamily: "'Playfair Display', Georgia, serif", background: "#0D0D0D" }}>

        {/* ── HERO ─────────────────────────────────── */}
        <section className={`relative flex flex-col items-center justify-center text-center overflow-hidden px-6 ${isThumbnail ? "min-h-[812px]" : "min-h-screen"}`}
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, #1A1208 0%, #0D0D0D 100%)" }}>
          <StarField />

          {/* Spotlight sweep */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="spotlight absolute inset-y-0 w-1/3" style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.05), transparent)", animationDelay: "1s" }} />
          </div>

          {/* Decorative gold rings */}
          {[300, 500, 700].map((s, i) => (
            <motion.div key={s} className="absolute rounded-full border pointer-events-none"
              style={{ width: s, height: s, borderColor: "rgba(201,168,76,0.08)" }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 30 + i * 10, repeat: Infinity, ease: "linear" }} />
          ))}

          <div className="relative z-10 max-w-4xl">
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 2 }}
              className="w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center"
              style={{ border: "1px solid rgba(201,168,76,0.4)", background: "rgba(201,168,76,0.05)" }}>
              <Star className="w-8 h-8" style={{ color: "#C9A84C", fill: "#C9A84C" }} />
            </motion.div>

            <motion.p initial={{ opacity: 0, letterSpacing: "0.8em" }} animate={{ opacity: 1, letterSpacing: "0.5em" }}
              transition={{ duration: 2 }} className="font-sans text-xs uppercase mb-10" style={{ color: "#888" }}>
              The Pleasure of Your Company
            </motion.p>

            <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="glow-text font-light leading-none" style={{ color: "#C9A84C", fontSize: "clamp(3rem, 11vw, 8.5rem)" }}>
              {brideName}
            </motion.h1>

            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.5, duration: 1.5 }}
              className="mx-auto my-6 h-px" style={{ width: 120, background: "linear-gradient(to right, transparent, #C9A84C, transparent)" }} />

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
              className="text-3xl font-light italic my-3" style={{ color: "rgba(201,168,76,0.6)" }}>&amp;</motion.p>

            <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="glow-text font-light leading-none" style={{ color: "#C9A84C", fontSize: "clamp(3rem, 11vw, 8.5rem)" }}>
              {groomName}
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.5 }}
              className="font-sans text-base tracking-widest mt-10" style={{ color: "#C0C0C0" }}>{fmt}</motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}
              className="font-sans text-sm mt-2" style={{ color: "#666" }}>{venue}</motion.p>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <ChevronDown className="w-5 h-5" style={{ color: "#C9A84C" }} />
            </motion.div>
          </motion.div>
        </section>

        {/* ── COUNTDOWN ───────────────────────────── */}
        <section className="py-20 text-center" style={{ background: "#111" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="font-sans text-xs uppercase tracking-[0.4em] mb-10" style={{ color: "#C9A84C" }}>The Night Approaches</p>
            <div className="flex gap-4 md:gap-10 justify-center flex-wrap">
              {[{ label: "Days", v: time.days }, { label: "Hours", v: time.hours }, { label: "Minutes", v: time.minutes }, { label: "Seconds", v: time.seconds }].map(i => (
                <div key={i.label} className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center text-2xl font-light"
                    style={{ border: "1px solid rgba(201,168,76,0.3)", color: "#C9A84C", background: "rgba(201,168,76,0.03)" }}>
                    {String(i.v).padStart(2, "0")}
                  </div>
                  <span className="font-sans text-[10px] uppercase tracking-widest" style={{ color: "#555" }}>{i.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── EVENTS ──────────────────────────────── */}
        <section className="py-24 px-4" style={{ background: "#0D0D0D" }}>
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <p className="font-sans text-xs uppercase tracking-[0.4em] mb-3" style={{ color: "#C9A84C" }}>An Evening Curated For You</p>
              <h2 className="text-4xl font-light" style={{ color: "#F5F0E8" }}>The Events</h2>
              <div className="mx-auto mt-4 h-px" style={{ width: 60, background: "linear-gradient(to right, transparent, #C9A84C, transparent)" }} />
            </motion.div>
            <div className="space-y-4">
              {events.map((ev, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                  className="p-8" style={{ background: "#141414", border: "1px solid rgba(201,168,76,0.15)" }}>
                  <div className="flex gap-5">
                    <div className="text-2xl font-sans font-light" style={{ color: "rgba(201,168,76,0.4)" }}>{String(i + 1).padStart(2, "0")}</div>
                    <div>
                      <h3 className="text-2xl font-light mb-2" style={{ color: "#F5F0E8" }}>{ev.name}</h3>
                      {ev.description && <p className="font-sans text-sm mb-4" style={{ color: "#888" }}>{ev.description}</p>}
                      <div className="flex flex-wrap gap-4 font-sans text-xs" style={{ color: "#666" }}>
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
          <section className="py-24 px-4" style={{ background: "#111" }}>
            <div className="max-w-5xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                <h2 className="text-4xl font-light" style={{ color: "#C9A84C" }}>Moments in the Dark</h2>
              </motion.div>
              <div className="columns-2 md:columns-3 gap-3 space-y-3">
                {gallery.map((img, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }} className="overflow-hidden" style={{ breakInside: "avoid", border: "1px solid rgba(201,168,76,0.2)" }}>
                    <img src={img.url} alt="" className="w-full object-cover transition-transform duration-700 hover:scale-105 brightness-75 hover:brightness-90" />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FOOTER ──────────────────────────────── */}
        <section className="py-20 text-center" style={{ background: "#0D0D0D", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Star className="w-8 h-8 mx-auto mb-6" style={{ color: "#C9A84C", fill: "#C9A84C" }} />
            <h2 className="text-3xl font-light mb-2" style={{ color: "#F5F0E8" }}>Your Presence Illuminates the Night</h2>
            <p className="font-sans text-sm mb-10" style={{ color: "#555" }}>{venue}</p>
            {!isPreview && invitationId && <RSVPModal invitationId={invitationId} />}
          </motion.div>
        </section>
      </div>
    </>
  );
}
