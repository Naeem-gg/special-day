"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, ChevronDown, Sparkles } from "lucide-react";
import type { TemplateProps } from "./types";
import RSVPModal from "@/components/invitation/RSVPModal";

function CosmosCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = Array.from({ length: 300 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2,
      brightness: Math.random(),
      delta: (Math.random() - 0.5) * 0.015,
      color: Math.random() > 0.8 ? "#B8A0FF" : Math.random() > 0.5 ? "#FFD700" : "white",
    }));

    // Meteor state
    let meteors: { x: number; y: number; len: number; speed: number; opacity: number; active: boolean }[] = [];
    const spawnMeteor = () => {
      meteors.push({ x: Math.random() * canvas.width, y: 0, len: 80 + Math.random() * 60, speed: 6 + Math.random() * 4, opacity: 1, active: true });
    };

    let animId: number;
    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Aurora gradient
      const aurora = ctx.createLinearGradient(0, 0, canvas.width, canvas.height * 0.6);
      aurora.addColorStop(0, "rgba(108,59,166,0.08)");
      aurora.addColorStop(0.5, "rgba(10,14,42,0)");
      aurora.addColorStop(1, "rgba(78,0,120,0.06)");
      ctx.fillStyle = aurora;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      stars.forEach(s => {
        s.brightness += s.delta;
        if (s.brightness > 1 || s.brightness < 0.1) s.delta *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color.replace(")", `,${s.brightness})`).replace("rgb", "rgba").replace("white", `rgba(255,255,255,${s.brightness})`);
        ctx.fill();
      });

      // Meteors
      if (frame % 120 === 0) spawnMeteor();
      meteors = meteors.filter(m => m.active);
      meteors.forEach(m => {
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x + m.len, m.y + m.len);
        const grad = ctx.createLinearGradient(m.x, m.y, m.x + m.len, m.y + m.len);
        grad.addColorStop(0, `rgba(255,215,0,${m.opacity})`);
        grad.addColorStop(1, "transparent");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        m.x += m.speed;
        m.y += m.speed;
        m.opacity -= 0.02;
        if (m.opacity <= 0) m.active = false;
      });

      frame++;
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}

function ConstellationLines({ name1, name2 }: { name1: string; name2: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
      <svg width="600" height="200" viewBox="0 0 600 200">
        <motion.line x1="50" y1="100" x2="200" y2="50" stroke="#FFD700" strokeWidth="0.5"
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay: 3, duration: 2 }} />
        <motion.line x1="200" y1="50" x2="300" y2="100" stroke="#FFD700" strokeWidth="0.5"
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay: 3.5, duration: 2 }} />
        <motion.line x1="300" y1="100" x2="400" y2="50" stroke="#FFD700" strokeWidth="0.5"
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay: 4, duration: 2 }} />
        <motion.line x1="400" y1="50" x2="550" y2="100" stroke="#FFD700" strokeWidth="0.5"
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay: 4.5, duration: 2 }} />
        {[50, 200, 300, 400, 550].map((x, i) => (
          <motion.circle key={x} cx={x} cy={i % 2 === 0 ? 100 : 50} r="2" fill="#FFD700"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 3 + i * 0.3 }} />
        ))}
      </svg>
    </div>
  );
}

export default function CelestialTemplate({ brideName, groomName, date, venue, events, gallery, isPreview, isThumbnail, invitationId, tier }: TemplateProps) {
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
        @keyframes auroraShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes celestialGlow {
          0%, 100% { text-shadow: 0 0 30px rgba(255,215,0,0.5), 0 0 60px rgba(108,59,166,0.3); }
          50% { text-shadow: 0 0 50px rgba(255,215,0,0.8), 0 0 100px rgba(108,59,166,0.5), 0 0 150px rgba(255,215,0,0.2); }
        }
        .aurora-text {
          background: linear-gradient(90deg, #FFD700, #B8A0FF, #4ECDC4, #FFD700, #B8A0FF);
          background-size: 300% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: auroraShift 6s ease-in-out infinite;
        }
        .celestial-glow { animation: celestialGlow 4s ease-in-out infinite; }
      `}</style>

      <div className={isThumbnail ? "min-h-full" : "min-h-screen"} style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>

        {/* ── HERO ─────────────────────────────────── */}
        <section className={`relative flex flex-col items-center justify-center text-center overflow-hidden px-6 ${isThumbnail ? "min-h-[812px]" : "min-h-screen"}`}
          style={{ background: "linear-gradient(180deg, #020412 0%, #0A0E2A 40%, #0D0620 100%)" }}>
          <CosmosCanvas />
          <ConstellationLines name1={brideName} name2={groomName} />

          {/* Aurora background bloom */}
          <div className="absolute inset-0 pointer-events-none">
            <div style={{ position: "absolute", top: "20%", left: "30%", width: "40%", height: "40%", background: "radial-gradient(ellipse, rgba(108,59,166,0.12) 0%, transparent 70%)", filter: "blur(40px)" }} />
            <div style={{ position: "absolute", top: "30%", right: "20%", width: "30%", height: "30%", background: "radial-gradient(ellipse, rgba(0,200,200,0.06) 0%, transparent 70%)", filter: "blur(30px)" }} />
          </div>

          <div className="relative z-10 max-w-4xl">
            <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 2 }}
              className="w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center text-3xl"
              style={{ background: "radial-gradient(circle, rgba(255,215,0,0.15), rgba(108,59,166,0.1))", border: "1px solid rgba(255,215,0,0.3)" }}>
              ✨
            </motion.div>

            <motion.p initial={{ opacity: 0, letterSpacing: "0.9em" }} animate={{ opacity: 1, letterSpacing: "0.5em" }}
              transition={{ duration: 2.5 }} className="font-sans text-[10px] uppercase mb-10" style={{ color: "#B8A0FF" }}>
              Written in the Stars
            </motion.p>

            <motion.h1 initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="aurora-text celestial-glow font-light leading-none" style={{ fontSize: "clamp(3rem, 11vw, 8.5rem)" }}>
              {brideName}
            </motion.h1>

            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.8, duration: 1.5 }}
              className="mx-auto my-6 h-px" style={{ width: 120, background: "linear-gradient(to right, transparent, #FFD700, #B8A0FF, transparent)" }} />

            <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.5 }}
              className="text-3xl my-2" style={{ color: "rgba(255,215,0,0.6)" }}>✦</motion.div>

            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 2, duration: 1.5 }}
              className="mx-auto my-6 h-px" style={{ width: 120, background: "linear-gradient(to right, transparent, #B8A0FF, #FFD700, transparent)" }} />

            <motion.h1 initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="aurora-text celestial-glow font-light leading-none" style={{ fontSize: "clamp(3rem, 11vw, 8.5rem)" }}>
              {groomName}
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.5 }}
              className="font-sans text-base tracking-widest mt-10" style={{ color: "#C0B0FF" }}>{fmt}</motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}
              className="font-sans text-sm mt-2" style={{ color: "#6A5A8A" }}>{venue}</motion.p>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <ChevronDown className="w-5 h-5" style={{ color: "#FFD700" }} />
            </motion.div>
          </motion.div>
        </section>

        {/* ── COUNTDOWN ───────────────────────────── */}
        <section className="py-20 text-center" style={{ background: "#0A0E2A" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="font-sans text-xs uppercase tracking-[0.4em] mb-10" style={{ color: "#B8A0FF" }}>Until Our Stars Align</p>
            <div className="flex gap-4 md:gap-10 justify-center flex-wrap">
              {[{ label: "Days", v: time.days }, { label: "Hours", v: time.hours }, { label: "Minutes", v: time.minutes }, { label: "Seconds", v: time.seconds }].map(i => (
                <div key={i.label} className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-2xl font-light"
                    style={{ background: "radial-gradient(circle, rgba(255,215,0,0.1), rgba(108,59,166,0.15))", color: "#FFD700", border: "1px solid rgba(255,215,0,0.25)", boxShadow: "0 0 20px rgba(108,59,166,0.3)" }}>
                    {String(i.v).padStart(2, "0")}
                  </div>
                  <span className="font-sans text-[10px] uppercase tracking-widest" style={{ color: "#6A5A8A" }}>{i.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── EVENTS ──────────────────────────────── */}
        <section className="py-24 px-4" style={{ background: "#060818" }}>
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <p className="font-sans text-xs uppercase tracking-[0.4em] mb-3" style={{ color: "#B8A0FF" }}>Constellations of the Evening</p>
              <h2 className="text-4xl font-light" style={{ color: "#E0D4FF" }}>The Events</h2>
              <div className="mx-auto mt-4 h-px" style={{ width: 60, background: "linear-gradient(to right, transparent, #FFD700, #B8A0FF, transparent)" }} />
            </motion.div>
            <div className="space-y-4">
              {events.map((ev, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                  className="p-8 rounded-2xl overflow-hidden relative"
                  style={{ background: "linear-gradient(135deg, rgba(108,59,166,0.15), rgba(10,14,42,0.8))", border: "1px solid rgba(184,160,255,0.2)" }}>
                  <div className="absolute top-0 right-0 text-4xl opacity-10 mr-4 mt-2">✦</div>
                  <p className="font-sans text-xs uppercase tracking-widest mb-2" style={{ color: "#FFD700" }}>✦ Event {i + 1}</p>
                  <h3 className="text-2xl font-light mb-2" style={{ color: "#E0D4FF" }}>{ev.name}</h3>
                  {ev.description && <p className="font-sans text-sm mb-4" style={{ color: "#8A7AAA" }}>{ev.description}</p>}
                  <div className="flex flex-wrap gap-4 font-sans text-xs" style={{ color: "#6A5A8A" }}>
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
          <section className="py-24 px-4" style={{ background: "#0A0E2A" }}>
            <div className="max-w-5xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                <h2 className="text-4xl font-light" style={{ color: "#FFD700" }}>Stardust Memories</h2>
              </motion.div>
              <div className="columns-2 md:columns-3 gap-4 space-y-4">
                {gallery.map((img, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="overflow-hidden rounded-2xl" style={{ breakInside: "avoid", border: "1px solid rgba(184,160,255,0.2)", boxShadow: "0 0 20px rgba(108,59,166,0.2)" }}>
                    <img src={img.url} alt="" className="w-full object-cover transition-transform duration-700 hover:scale-105 brightness-75 hover:brightness-90 saturate-[0.8]" />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FOOTER ──────────────────────────────── */}
        <section className="py-20 text-center" style={{ background: "linear-gradient(180deg, #060818, #020412)" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Sparkles className="w-8 h-8 mx-auto mb-6" style={{ color: "#FFD700" }} />
            <h2 className="text-3xl font-light mb-2" style={{ color: "#E0D4FF" }}>Come, Celebrate Under the Stars</h2>
            <p className="font-sans text-sm mb-10" style={{ color: "#6A5A8A" }}>{venue}</p>
            {!isPreview && invitationId && <RSVPModal invitationId={invitationId} />}
          </motion.div>
        </section>
      </div>
    </>
  );
}
