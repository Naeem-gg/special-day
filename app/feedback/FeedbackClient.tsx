"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, AlertTriangle, Lightbulb, FileText, Send, CheckCircle2, ChevronDown, ChevronUp, Clock, Shield, X } from "lucide-react";
import Link from "next/link";
import { DNvitesLogo } from "@/components/branding/DNvitesLogo";
import { Footer } from "@/components/Footer";

const TYPES = [
  { value: "feedback", label: "General Feedback", icon: MessageSquare, color: "#F43F8F", bg: "#FFF0F6", desc: "Share your thoughts or suggestions" },
  { value: "complaint", label: "Complaint", icon: AlertTriangle, color: "#EF4444", bg: "#FFF5F5", desc: "Report an issue with our service" },
  { value: "grievance", label: "Grievance", icon: FileText, color: "#F97316", bg: "#FFF7ED", desc: "Raise a formal concern" },
  { value: "feature_request", label: "Feature Request", icon: Lightbulb, color: "#8B5CF6", bg: "#F5F3FF", desc: "Suggest a new feature" },
];

const STATUS_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  open: { label: "Open", color: "#F97316", bg: "#FFF7ED" },
  in_progress: { label: "In Progress", color: "#3B82F6", bg: "#EFF6FF" },
  resolved: { label: "Resolved", color: "#10B981", bg: "#ECFDF5" },
  closed: { label: "Closed", color: "#6B7280", bg: "#F9FAFB" },
};

type FeedbackItem = {
  id: number;
  name: string;
  email: string;
  type: string;
  subject: string;
  message: string;
  status: string;
  isPublic: boolean;
  createdAt: string;
  replies: { id: number; message: string; isAdmin: boolean; authorName: string; createdAt: string }[];
};

function FeedbackThread({ item }: { item: FeedbackItem }) {
  const [open, setOpen] = useState(false);
  const typeInfo = TYPES.find(t => t.value === item.type) || TYPES[0];
  const statusStyle = STATUS_STYLES[item.status] || STATUS_STYLES.open;
  const Icon = typeInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-5 flex items-start gap-4 hover:bg-gray-50/50 transition-colors"
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: typeInfo.bg }}>
          <Icon className="w-5 h-5" style={{ color: typeInfo.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: typeInfo.color }}>{typeInfo.label}</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ background: statusStyle.bg, color: statusStyle.color }}>
              {statusStyle.label}
            </span>
            {item.replies.some(r => r.isAdmin) && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-[#F43F8F] flex items-center gap-1">
                <Shield className="w-2.5 h-2.5" /> Admin Replied
              </span>
            )}
          </div>
          <h3 className="font-semibold text-gray-900 truncate">{item.subject}</h3>
          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {item.name} · {new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
        <div className="shrink-0 text-gray-300 ml-2">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-gray-50">
              <p className="text-sm text-gray-700 leading-relaxed mt-4 p-4 bg-gray-50 rounded-xl">{item.message}</p>

              {item.replies.length > 0 && (
                <div className="mt-4 space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Replies</p>
                  {[...item.replies].reverse().map(reply => (
                    <div key={reply.id} className={`flex gap-3 ${reply.isAdmin ? "flex-row-reverse" : ""}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${reply.isAdmin ? "bg-rose-100 text-[#F43F8F]" : "bg-gray-100 text-gray-500"}`}>
                        {reply.isAdmin ? "DN" : reply.authorName[0]}
                      </div>
                      <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${reply.isAdmin ? "bg-gradient-to-br from-[#F43F8F] to-[#c73272] text-white rounded-tr-sm" : "bg-gray-100 text-gray-700 rounded-tl-sm"}`}>
                        {reply.isAdmin && (
                          <p className="text-[10px] font-bold uppercase tracking-wider mb-1 text-white/70">DNvites Support</p>
                        )}
                        {reply.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const SUCCESS_MESSAGES: Record<string, { title: string; text: string }> = {
  feedback: {
    title: "Thank You! 💌",
    text: "We truly appreciate your thoughts. Your feedback helps us make DNvites better for everyone. We'll review it and respond below shortly."
  },
  complaint: {
    title: "We're on it! 🚨",
    text: "We're sorry to hear about your issue. Your complaint has been prioritized, and our team will address it publicly below as soon as possible."
  },
  grievance: {
    title: "Message Recorded ⚠️",
    text: "We take your concerns very seriously. Your grievance has been safely recorded, and a senior team member will investigate and respond here shortly."
  },
  feature_request: {
    title: "Great Idea! ✨",
    text: "Thanks for the suggestion! We've added your request to our board. We love building features that our community actually wants."
  }
};

export default function FeedbackClient({ initialThreads }: { initialThreads: FeedbackItem[] }) {
  const [selectedType, setSelectedType] = useState("feedback");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [threads, setThreads] = useState<FeedbackItem[]>(initialThreads);
  const [loadingThreads, setLoadingThreads] = useState(false);

  const successContent = SUCCESS_MESSAGES[selectedType] || SUCCESS_MESSAGES.feedback;

  // Refresh threads after submission or periodically
  const fetchThreads = async () => {
    try {
      const res = await fetch("/api/feedback");
      const data = await res.json();
      if (Array.isArray(data)) setThreads(data);
    } catch (err) {
      console.error("Failed to fetch threads:", err);
    }
  };

  useEffect(() => {
    if (submitted) {
      fetchThreads();
    }
  }, [submitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: selectedType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      setSubmitted(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #FFF8F0 0%, #FEF0F6 60%, #FFF5E6 100%)", fontFamily: "'Playfair Display', Georgia, serif" }}>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-rose-50 px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <DNvitesLogo className="h-6 w-auto" />
        </Link>
        <h1 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Help & Feedback</h1>
        <Link href="/" className="text-xs font-bold text-gray-400 hover:text-[#F43F8F] transition-colors uppercase tracking-wider">← Home</Link>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-16 space-y-16">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <div className="text-5xl">💬</div>
          <h2 className="text-4xl md:text-5xl font-light text-gray-900">
            We're all <span style={{ color: "#F43F8F" }}>ears</span>
          </h2>
          <p className="font-sans text-gray-500 max-w-lg mx-auto leading-relaxed">
            Share your feedback, report a complaint, raise a grievance, or suggest a feature. We read every single message and respond publicly.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-3xl p-12 text-center shadow-xl shadow-rose-100/40 border border-rose-100"
              >
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-serif text-gray-900 mb-3">{successContent.title}</h3>
                <p className="font-sans text-gray-500 text-sm mb-8 leading-relaxed">
                  {successContent.text}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="font-sans text-sm font-bold text-[#F43F8F] hover:underline"
                >
                  Submit another →
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="bg-white rounded-3xl shadow-xl shadow-rose-100/40 border border-rose-100 overflow-hidden"
              >
                {/* Type selector */}
                <div className="p-6 border-b border-rose-50">
                  <p className="font-sans text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">What is this about?</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {TYPES.map(t => {
                      const Icon = t.icon;
                      const active = selectedType === t.value;
                      return (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => setSelectedType(t.value)}
                          className="flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all text-center"
                          style={{
                            borderColor: active ? t.color : "transparent",
                            background: active ? t.bg : "#f9f9f9",
                          }}
                        >
                          <Icon className="w-5 h-5" style={{ color: active ? t.color : "#aaa" }} />
                          <span className="font-sans text-[11px] font-bold" style={{ color: active ? t.color : "#888" }}>{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-sans text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">Your Name *</label>
                      <input
                        required
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Anjali Sharma"
                        className="w-full border border-rose-200 rounded-xl px-4 h-11 font-sans text-sm focus:border-[#F43F8F] focus:outline-none focus:ring-2 focus:ring-[#F43F8F]/10"
                      />
                    </div>
                    <div>
                      <label className="font-sans text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">Email Address *</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="you@email.com"
                        className="w-full border border-rose-200 rounded-xl px-4 h-11 font-sans text-sm focus:border-[#F43F8F] focus:outline-none focus:ring-2 focus:ring-[#F43F8F]/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-sans text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">Subject *</label>
                    <input
                      required
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                      placeholder="Brief summary of your message"
                      className="w-full border border-rose-200 rounded-xl px-4 h-11 font-sans text-sm focus:border-[#F43F8F] focus:outline-none focus:ring-2 focus:ring-[#F43F8F]/10"
                    />
                  </div>

                  <div>
                    <label className="font-sans text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="Describe your feedback, complaint, or request in detail..."
                      className="w-full border border-rose-200 rounded-xl px-4 py-3 font-sans text-sm focus:border-[#F43F8F] focus:outline-none focus:ring-2 focus:ring-[#F43F8F]/10 resize-none"
                    />
                  </div>

                  {error && (
                    <p className="font-sans text-sm text-red-500 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-13 flex items-center justify-center gap-2 rounded-2xl font-sans font-bold text-white text-sm disabled:opacity-60 transition-all hover:shadow-lg hover:shadow-rose-200/50"
                    style={{ background: "linear-gradient(90deg, #F43F8F, #c73272)", height: "52px" }}
                  >
                    {loading ? (
                      <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>

                  <p className="font-sans text-[11px] text-center text-gray-400">
                    Your message will be posted publicly (without your email) so our team can respond transparently.
                  </p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Public Board */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-rose-100" />
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-gray-400">Community Board</span>
            <div className="h-px flex-1 bg-rose-100" />
          </div>

          {loadingThreads ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-rose-200 border-t-[#F43F8F] rounded-full animate-spin mx-auto" />
            </div>
          ) : threads.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-sans text-sm">No messages yet. Be the first to share feedback!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {threads.map(item => <FeedbackThread key={item.id} item={item} />)}
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
