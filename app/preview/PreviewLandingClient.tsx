"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { TEMPLATES, TemplateMeta } from "@/components/templates/types";
import TemplateRouter from "@/components/templates/TemplateRouter";
import { Sparkles, Eye } from "lucide-react";

const TIER_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  basic: { label: "Basic", color: "#5A8A4A", bg: "#F2F7EE" },
  standard: { label: "Standard", color: "#0A3F6B", bg: "#EBF8FF" },
  premium: { label: "Premium", color: "#C9A84C", bg: "#1A1208" },
};

function TemplateThumbnail({ template, selected, onSelect, brideName, groomName, weddingDate }: { template: TemplateMeta; selected: boolean; onSelect: () => void; brideName: string; groomName: string; weddingDate: string; }) {
  const tier = TIER_LABELS[template.tier];
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative cursor-pointer rounded-3xl overflow-hidden flex flex-col w-full mx-auto"
      style={{
        border: selected ? "2px solid #F43F8F" : "2px solid transparent",
        boxShadow: selected ? "0 0 0 4px rgba(244,63,143,0.2), 0 20px 40px rgba(0,0,0,0.15)" : "0 4px 20px rgba(0,0,0,0.08)",
        background: `linear-gradient(135deg, ${template.palette[0]}, ${template.palette[1]})`
      }}
    >
      <div className="h-64 relative w-full overflow-hidden" style={{ background: `linear-gradient(135deg, ${template.palette[0]}, ${template.palette[1]})` }}>
        <div className="absolute top-1/2 left-1/2 pointer-events-none" style={{
          width: '375px',
          height: '812px',
          transform: 'translate(-50%, -50%) scale(0.65)'
        }}>
          <TemplateRouter
            template={template.slug}
            brideName={brideName || "Ayesha"}
            groomName={groomName || "Ahmed"}
            date={weddingDate ? new Date(weddingDate) : new Date(Date.now() + 86400000)}
            venue="Grand Ballroom"
            events={[{ name: "Ceremony", time: "4:00 PM", location: "Main Hall", description: "Vows and Rings" }]}
            gallery={[]}
            isPreview={true}
            isThumbnail={true}
          />
        </div>
        <div className="absolute inset-0 bg-transparent z-10" />

        <AnimatePresence>
          {hovered && (
            <motion.div className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.4)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center gap-2 text-white font-sans text-sm font-bold">
                <Eye className="w-4 h-4" />
                Preview
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider"
          style={{ background: tier.bg, color: tier.color }}>
          {tier.label}
        </div>

        {selected && (
          <motion.div className="absolute top-3 left-3 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: "#F43F8F" }}
            initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <span className="text-white text-xs">✓</span>
          </motion.div>
        )}
      </div>

      <div className="p-4 bg-white">
        <h3 className="font-serif text-base text-gray-900 mb-1">{template.name}</h3>
        <p className="font-sans text-xs text-gray-500 leading-relaxed">{template.description}</p>
      </div>
    </motion.div>
  );
}

export default function PreviewLandingClient({ initialParams, error: errorParam }: { initialParams: any, error?: string | null }) {
  const [selectedTemplate, setSelectedTemplate] = useState(initialParams.template || "rose-gold");
  const [brideName, setBrideName] = useState(initialParams.brideName || "");
  const [groomName, setGroomName] = useState(initialParams.groomName || "");
  const [weddingDate, setWeddingDate] = useState(initialParams.dateStr || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handlePreview = async (templateSlug?: string) => {
    const slugToUse = templateSlug || selectedTemplate;
    if (!brideName || !groomName || !weddingDate) {
      setError("Please fill in your names and date above first! ✨");
      // Scroll to top to show form
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/preview/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          brideName, 
          groomName, 
          dateStr: weddingDate, 
          template: slugToUse 
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/preview/${slugToUse}?token=${data.token}`);
    } catch (e: any) {
      setError(e.message || "Failed to start preview");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #FFF8F0 0%, #FEF0F0 50%, #FFF5E6 100%)", fontFamily: "'Playfair Display', Georgia, serif" }}>

      <div className="text-center pt-20 pb-12 px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-4xl mb-4">💍</div>
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
            Try Before You <span style={{ color: "#F43F8F" }}>Buy</span>
          </h1>
          <p className="font-sans text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
            Enter your names and choose a template. We'll generate a live 5-minute preview — just for you, on this device.
          </p>
          {errorParam === "expired" && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="mt-4 inline-block px-5 py-2.5 rounded-full font-sans text-sm"
              style={{ background: "#FEF3F3", color: "#E53E3E", border: "1px solid #FED7D7" }}>
              ⏰ Your preview expired. Enter your details again to preview.
            </motion.div>
          )}
        </motion.div>
      </div>

      <div className="max-w-xl mx-auto px-6 mb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl shadow-rose-100/40 p-8 border border-rose-100">
          <h2 className="font-serif text-xl text-gray-900 mb-6">Your Details</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-sans text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1.5 block">Partner 1</label>
                <input value={brideName} onChange={e => setBrideName(e.target.value)} placeholder="Ayesha"
                  className="w-full border border-rose-200 rounded-xl px-4 h-11 font-sans text-sm focus:border-rose-400 focus:outline-none" />
              </div>
              <div>
                <label className="font-sans text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1.5 block">Partner 2</label>
                <input value={groomName} onChange={e => setGroomName(e.target.value)} placeholder="Ahmed"
                  className="w-full border border-rose-200 rounded-xl px-4 h-11 font-sans text-sm focus:border-rose-400 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="font-sans text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1.5 block">Wedding Date & Time</label>
              <input type="datetime-local" value={weddingDate} onChange={e => setWeddingDate(e.target.value)}
                className="w-full border border-rose-200 rounded-xl px-4 h-11 font-sans text-sm focus:border-rose-400 focus:outline-none" />
            </div>
          </div>
          {error && <p className="font-sans text-xs text-red-500 mt-3">{error}</p>}
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-8">
          <h2 className="text-3xl font-light text-gray-900 mb-2">Choose Your Template</h2>
          <p className="font-sans text-sm text-gray-500">All templates are available to preview. Template access depends on your chosen plan.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATES.map((t, i) => (
            <motion.div key={t.slug} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
              <TemplateThumbnail 
                template={t} 
                selected={selectedTemplate === t.slug} 
                onSelect={() => {
                  setSelectedTemplate(t.slug);
                  handlePreview(t.slug);
                }} 
                brideName={brideName} 
                groomName={groomName} 
                weddingDate={weddingDate} 
              />
            </motion.div>
          ))}
        </div>

        {loading && (
          <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-[100] flex flex-col items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-rose-200 border-t-[#F43F8F] rounded-full mb-4"
            />
            <p className="font-serif text-lg text-gray-900 animate-pulse">Generating your custom preview...</p>
          </div>
        )}
      </div>
    </div>
  );
}
