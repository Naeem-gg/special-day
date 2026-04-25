"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ShoppingBag, X } from "lucide-react";
import { useRouter } from "next/navigation";

const PREVIEW_DURATION = 5 * 60; // 5 minutes in seconds

export default function PreviewBanner({ 
  template, startTime, brideName, groomName, dateStr 
}: { 
  template: string; startTime: number; brideName?: string; groomName?: string; dateStr?: string;
}) {
  const [secondsLeft, setSecondsLeft] = useState(PREVIEW_DURATION);
  const [expired, setExpired] = useState(false);
  const router = useRouter();

  const handleBuy = () => {
    let url = "/dashboard";
    const params = new URLSearchParams();
    if (template) params.append("template", template);
    if (brideName) params.append("brideName", brideName);
    if (groomName) params.append("groomName", groomName);
    if (dateStr) params.append("dateStr", dateStr);
    const qs = params.toString();
    if (qs) url += "?" + qs;
    router.push(url);
  };

  useEffect(() => {
    const update = () => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = PREVIEW_DURATION - elapsed;
      if (remaining <= 0) {
        setSecondsLeft(0);
        setExpired(true);
      } else {
        setSecondsLeft(remaining);
      }
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [startTime]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const pct = (secondsLeft / PREVIEW_DURATION) * 100;
  const isUrgent = secondsLeft < 60;

  const handleBack = () => {
    const params = new URLSearchParams();
    if (brideName) params.append("brideName", brideName);
    if (groomName) params.append("groomName", groomName);
    if (dateStr) params.append("dateStr", dateStr);
    if (template) params.append("template", template);
    router.push(`/preview?${params.toString()}`);
  };

  return (
    <>
      {/* ── Sticky Banner ── */}
      <div className="fixed top-0 left-0 right-0 z-[9999]" style={{ background: isUrgent ? "#7F1D1D" : "#1A0A12" }}>
        {/* Progress bar */}
        <div className="h-0.5" style={{ background: "rgba(255,255,255,0.1)" }}>
          <motion.div className="h-full" style={{ background: isUrgent ? "#EF4444" : "#D4AF37", width: `${pct}%` }}
            transition={{ duration: 1 }} />
        </div>

        <div className="flex items-center justify-between px-4 py-2.5 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleBack}
              className="group flex items-center gap-2 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest hidden sm:block">Back</span>
            </button>
            <span className="text-white/20 hidden md:block">|</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" style={{ color: isUrgent ? "#FCA5A5" : "#D4AF37" }} />
              <span className={`font-mono text-sm font-bold ${isUrgent ? "text-red-300" : "text-amber-300"}`}>
                {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
              </span>
              <span className="text-white/50 text-[10px] font-sans uppercase tracking-tight">left</span>
            </div>
          </div>

          <div className="text-center hidden lg:block">
            <p className="text-white/60 text-[10px] font-sans uppercase tracking-widest">Preview Mode • {template.replace(/-/g, ' ')}</p>
          </div>

          <button
            onClick={handleBuy}
            className="flex items-center gap-2 px-5 py-1.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg"
            style={{ background: "linear-gradient(90deg, #F43F8F, #D4AF37)", color: "white" }}>
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:block">Unlock Full Template</span>
            <span className="sm:hidden">Unlock</span>
          </button>
        </div>
      </div>

      {/* ── Expired Modal ── */}
      <AnimatePresence>
        {expired && (
          <motion.div className="fixed inset-0 z-[99999] flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div className="max-w-md w-full rounded-[2rem] p-10 text-center"
              style={{ background: "linear-gradient(135deg, #1A0A12, #2A1020)", border: "1px solid rgba(212,175,55,0.3)" }}
              initial={{ scale: 0.8, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }}>
              <div className="text-5xl mb-6">⏳</div>
              <h2 className="text-3xl font-serif font-light text-white mb-3">Your Preview Has Ended</h2>
              <p className="text-white/60 font-sans text-sm mb-8 leading-relaxed">
                Loved what you saw? Purchase this template to unlock your full, shareable invitation with RSVP tracking, gallery, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={handleBuy}
                  className="px-8 py-3 rounded-full font-sans font-bold text-sm uppercase tracking-wider"
                  style={{ background: "linear-gradient(90deg, #F43F8F, #D4AF37)", color: "white" }}>
                  Create My Invitation ✨
                </button>
                <button onClick={handleBack}
                  className="px-8 py-3 rounded-full font-sans text-sm border border-white/20 text-white/70 hover:text-white transition-colors">
                  Try Another Template
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for banner height */}
      <div className="h-10" />
    </>
  );
}
