"use client";

import Link from "next/link";
import { DNvitesLogo } from "@/components/branding/DNvitesLogo";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Send,
  Layout,
  Image as ImageIcon,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Star,
  Music,
  Gift,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { FloatingHearts } from "@/components/floating-hearts";
import { useEffect, useRef, useState } from "react";
import { Footer } from "@/components/Footer";

/* ── Petal Rain ───────────────────────── */
function PetalRain() {
  const [mounted, setMounted] = useState(false);
  const [petalStyles, setPetalStyles] = useState<any[]>([]);
  const petalsSymbols = ["🌸", "🌺", "🌷", "💮", "🌼"];

  useEffect(() => {
    const styles = Array.from({ length: 18 }).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      animationDuration: `${8 + Math.random() * 10}s`,
      animationDelay: `${Math.random() * 12}s`,
      fontSize: `${14 + Math.random() * 14}px`,
      opacity: 0.55 + Math.random() * 0.4,
      symbol: petalsSymbols[i % petalsSymbols.length]
    }));
    setPetalStyles(styles);
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petalStyles.map((style, i) => (
        <span
          key={i}
          className="petal select-none"
          style={{
            left: style.left,
            animationDuration: style.animationDuration,
            animationDelay: style.animationDelay,
            fontSize: style.fontSize,
            opacity: style.opacity,
          }}
        >
          {style.symbol}
        </span>
      ))}
    </div>
  );
}

/* ── Staggered container ──────────────── */
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

/* ── Feature Card ─────────────────────── */
function FeatureCard({
  icon, title, description, delay = 0,
}: {
  icon: React.ReactNode; title: string; description: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative p-10 bg-white rounded-[2.5rem] border border-rose-100 shadow-sm hover:shadow-2xl hover:shadow-rose-200/40 transition-all duration-500"
    >
      {/* soft glow */}
      <div className="absolute inset-0 rounded-[2.5rem] bg-linear-to-br from-rose-50/60 to-amber-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <motion.div
        whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.15 }}
        transition={{ duration: 0.5 }}
        className="w-16 h-16 bg-linear-to-br from-rose-100 to-amber-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm relative z-10"
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-serif text-gray-900 mb-3 relative z-10">{title}</h3>
      <p className="text-muted-foreground leading-relaxed relative z-10">{description}</p>
    </motion.div>
  );
}

/* ── Pricing Card ─────────────────────── */
function PricingCard({
  tier, price, features, isPopular = false, delay = 0,
}: {
  tier: string; price: string; features: string[]; isPopular?: boolean; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: isPopular ? 1.05 : 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: isPopular ? 1.08 : 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`relative p-8 rounded-4xl border overflow-hidden ${isPopular
        ? "bg-linear-to-br from-[#F43F8F] to-[#c73272] text-white border-transparent shadow-2xl shadow-rose-400/40 z-10"
        : "bg-white text-foreground border-rose-100 shadow-lg"
        }`}
    >
      {isPopular && (
        <>
          {/* Animated shine */}
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
          />
          <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 bg-linear-to-r from-[#D4AF37] to-amber-500 text-white text-[10px] font-bold uppercase tracking-widest mt-1 px-2 py-2 rounded-full shadow-lg">
            ✨ Most Loved
          </div>
        </>
      )}

      <div className="space-y-6 relative z-10">
        <div>
          <h4 className={`text-lg font-serif ${isPopular ? "text-white/90" : "text-muted-foreground"}`}>{tier}</h4>
          <div className="flex items-baseline gap-1 mt-2">
            <motion.span
              className="text-4xl font-serif"
              animate={isPopular ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ₹{price}
            </motion.span>
            <span className={`text-sm ${isPopular ? "text-white/60" : "text-muted-foreground"}`}>/ invite</span>
          </div>
        </div>

        <ul className="space-y-3">
          {features.map((feature, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: delay + idx * 0.06 }}
              className="flex items-center gap-3 text-sm"
            >
              <motion.div whileHover={{ scale: 1.3, rotate: 10 }}>
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${isPopular ? "text-white" : "text-[#F43F8F]"}`} />
              </motion.div>
              <span className={isPopular ? "text-white/90" : "text-muted-foreground"}>{feature}</span>
            </motion.li>
          ))}
        </ul>

        <Link href="/dashboard" className="block pt-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full py-3 rounded-full text-base font-semibold transition-all duration-300 ${isPopular
              ? "bg-white text-[#F43F8F] hover:bg-white/90 shadow-xl"
              : "bg-linear-to-r from-[#F43F8F] to-[#c73272] text-white hover:shadow-lg hover:shadow-rose-300/50"
              }`}
          >
            Choose This Plan 💌
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}

/* ── Scroll-progress bar ──────────────── */
function ProgressBar() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-100 origin-left"
      style={{
        scaleX: scrollYProgress,
        background: "linear-gradient(90deg, #F43F8F, #D4AF37)",
      }}
    />
  );
}

/* ── Testimonial carousel ─────────────── */
const testimonials = [
  { name: "Sara & Ahmed", text: "Our guests couldn't stop talking about how gorgeous our invitation was! 😍", avatar: "1" },
  { name: "Priya & Raj", text: "So easy to set up, and it looked 10× better than a paper card. Loved it!", avatar: "2" },
  { name: "Zara & Omar", text: "The animations made everyone feel like they were opening a real envelope 💌", avatar: "3" },
];

function Testimonials() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % testimonials.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="py-20 overflow-hidden">
      <div className="container mx-auto px-6 max-w-2xl text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-sm font-bold uppercase tracking-widest text-[#F43F8F] mb-10"
        >
          💬 What Couples Say
        </motion.p>
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <p className="text-2xl font-serif text-gray-800 italic leading-relaxed">
              "{testimonials[current].text}"
            </p>
            <div className="flex items-center justify-center gap-3">
              <Image
                src={`https://i.pravatar.cc/48?u=${testimonials[current].avatar}`}
                alt={testimonials[current].name}
                width={48} height={48}
                className="rounded-full border-2 border-rose-200"
              />
              <span className="font-semibold text-gray-700">{testimonials[current].name}</span>
            </div>
          </motion.div>
        </AnimatePresence>
        {/* dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}>
              <motion.div
                className="rounded-full"
                animate={{
                  width: i === current ? 24 : 8,
                  height: 8,
                  backgroundColor: i === current ? "#F43F8F" : "#FCA5A5",
                }}
                transition={{ duration: 0.4 }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════ MAIN HOME PAGE ══════════════ */
export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroScroll, [0, 1], [0, 120]);
  const heroOpacity = useTransform(heroScroll, [0, 0.6], [1, 0]);

  return (
    <main className="min-h-screen bg-background font-sans selection:bg-rose-200/60 overflow-x-hidden">
      <ProgressBar />
      <FloatingHearts />
      <PetalRain />

      {/* ── Navigation ─────────────────── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 w-full z-50 glass border-b border-rose-100/50"
      >
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <DNvitesLogo />

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {["Features", "How it Works", "Pricing"].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <Link
                  href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                  className="text-sm font-medium text-muted-foreground hover:text-[#F43F8F] transition-colors duration-300"
                >
                  {item}
                </Link>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <Link href="/login">
                <Button variant="ghost" className="text-sm hover:text-[#F43F8F]">Sign In</Button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }}
            >
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  className="bg-linear-to-r from-[#F43F8F] to-[#c73272] text-white rounded-full px-6 py-2.5 text-sm font-semibold shadow-lg shadow-rose-300/40 hover:shadow-rose-400/60 transition-shadow"
                >
                  Create Your Invitation ✨
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-[#F43F8F] transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 backdrop-blur-xl border-b border-rose-100 overflow-hidden"
            >
              <div className="px-6 py-6 flex flex-col gap-5">
                {["Features", "How it Works", "Pricing"].map((item) => (
                  <Link
                    key={item}
                    href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-base font-semibold text-gray-800 hover:text-[#F43F8F] transition-colors"
                  >
                    {item}
                  </Link>
                ))}
                <div className="h-px bg-rose-100/50 w-full my-2" />
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-gray-800 hover:text-[#F43F8F]">
                  Sign In
                </Link>
                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                  <button className="w-full bg-linear-to-r from-[#F43F8F] to-[#c73272] text-white rounded-xl px-6 py-3.5 text-base font-bold shadow-lg shadow-rose-300/40 active:scale-[0.98] transition-transform">
                    Create Your Invitation ✨
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ── Hero Section ──────────────── */}
      <section ref={heroRef} className="relative pt-28 pb-24 px-6 min-h-screen flex items-center overflow-hidden">
        {/* Animated gradient orbs */}
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 -left-32 w-[600px] h-[600px] bg-rose-200/30 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 -right-32 w-[500px] h-[500px] bg-amber-200/30 rounded-full blur-3xl pointer-events-none"
        />

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Left text */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div variants={itemVariants}>
                <motion.div
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 border border-rose-200 text-[#F43F8F]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Your Love, Beautifully Shared</span>
                </motion.div>
              </motion.div>

              <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-serif leading-[1.1]">
                Make a Wedding Invitation{" "}
                <span className="gradient-text italic">They'll Never Forget</span>
              </motion.h1>

              <motion.p variants={itemVariants} className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Share your big day with the world — no designer needed! Just fill in a few details and
                get a gorgeous digital invite ready to send to everyone you love. 💍
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    className="group flex items-center gap-2 bg-linear-to-r from-[#F43F8F] to-[#c73272] text-white rounded-full px-8 h-14 text-base font-semibold shadow-xl shadow-rose-300/40 hover:shadow-rose-400/60 transition-all"
                  >
                    Start for Free
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </motion.button>
                </Link>
                <Link href="/preview">
                  <motion.button
                    whileHover={{ scale: 1.04, borderColor: "#F43F8F", color: "#F43F8F" }}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-2 border-2 border-border rounded-full px-8 h-14 text-base font-semibold transition-all text-foreground hover:border-rose-300"
                  >
                    👀 Try a Live Preview
                  </motion.button>
                </Link>
              </motion.div>

              {/* Social proof */}
              <motion.div variants={itemVariants} className="flex items-center gap-5">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow"
                    >
                      <Image src={`https://i.pravatar.cc/40?u=${i + 20}`} alt="happy couple" width={40} height={40} />
                    </motion.div>
                  ))}
                </div>
                <div>
                  <div className="flex text-amber-400 text-sm mb-0.5">{"★★★★★"}</div>
                  <p className="text-sm text-muted-foreground">
                    Loved by <span className="font-bold text-foreground">500+</span> couples this year
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Hero image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ y: heroY, opacity: heroOpacity }}
              className="relative"
            >
              <motion.div
                animate={{ rotate: [0, 1, -1, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="aspect-4/5 relative rounded-[3rem] overflow-hidden shadow-2xl glow-ring"
              >
                <Image src="/images/hero-bg.png" alt="Wedding Preview" fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

                {/* Floating overlay card */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-8 left-6 right-6 glass rounded-2xl p-5 shadow-xl border border-white/30"
                >
                  <div className="flex items-center justify-between text-black">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold">Our Special Day</p>
                      <p className="text-xl font-serif">Abdullah & Ayesha</p>
                      <p className="text-xs">15 June 2025 · Grand Ballroom</p>
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-12 h-12 bg-linear-to-br from-[#F43F8F] to-[#D4AF37] rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Heart className="w-6 h-6 text-white fill-white" />
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Decorative circle blobs */}
              <div className="absolute -top-10 -right-10 w-36 h-36 bg-rose-300/20 blur-3xl rounded-full animate-float" />
              <div className="absolute -bottom-10 -left-10 w-52 h-52 bg-amber-300/20 blur-3xl rounded-full animate-float-delayed" />
            </motion.div>
          </div>
        </div>

        {/* Scroll arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Features ──────────────────── */}
      <section id="features" className="py-28 bg-linear-to-b from-rose-50/40 to-amber-50/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-20 space-y-4"
          >
            <p className="text-sm font-bold uppercase tracking-widest text-[#F43F8F]">✨ What You'll Love</p>
            <h2 className="text-4xl md:text-5xl font-serif">Everything you need to share your joy</h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              className="divider-wave mx-auto max-w-[200px]"
            />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Layout className="w-6 h-6 text-[#F43F8F]" />}
              title="Gorgeous, Ready-Made Designs"
              description="Pick from stunning templates — no design skills needed. Just add your names and you're done!"
              delay={0}
            />
            <FeatureCard
              icon={<Send className="w-6 h-6 text-[#F43F8F]" />}
              title="Share in One Tap"
              description="Send your invite through WhatsApp, Instagram, or Email in seconds. No printing, no postage!"
              delay={0.15}
            />
            <FeatureCard
              icon={<ImageIcon className="w-6 h-6 text-[#F43F8F]" />}
              title="Show Off Your Photos"
              description="Create a beautiful photo gallery so your guests can relive your most precious moments."
              delay={0.3}
            />
            <FeatureCard
              icon={<Music className="w-6 h-6 text-[#F43F8F]" />}
              title="Set the Mood with Music"
              description="Add your favourite song so guests feel the love the moment they open the invitation."
              delay={0.15}
            />
            <FeatureCard
              icon={<Gift className="w-6 h-6 text-[#F43F8F]" />}
              title="Track Who's Coming"
              description="Your guests can RSVP with a click and you can see the list in real time - no spreadsheets needed!"
              delay={0.3}
            />
            <FeatureCard
              icon={<Star className="w-6 h-6 text-[#F43F8F]" />}
              title="Live for One Full Year"
              description="Your invitation stays online for a whole year. Family can revisit it any time they want."
              delay={0.45}
            />
          </div>
        </div>
      </section>

      {/* ── How it Works ──────────────── */}
      <section id="how-it-works" className="py-28 relative overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-rose-100/40 rounded-full pointer-events-none"
        />
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-center mb-20"
          >
            Ready in just 3 easy steps 🎉
          </motion.h2>
          <div className="space-y-14">
            {[
              { num: "1", icon: "📝", title: "Tell Us About Your Wedding", desc: "Add your names, date, and venue — it takes less than 2 minutes." },
              { num: "2", icon: "📸", title: "Add Your Photos", desc: "Upload some of your favourite pictures to make the invite feel personal and special." },
              { num: "3", icon: "💌", title: "Share With Everyone", desc: "Get a beautiful link and share it with your whole family and friends list — instantly." },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col md:flex-row gap-8 items-center"
              >
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  className="relative w-20 h-20 rounded-full bg-linear-to-br from-[#F43F8F] to-[#c73272] text-white flex items-center justify-center text-3xl font-serif shrink-0 shadow-xl shadow-rose-300/50"
                >
                  {step.icon}
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                    className="absolute inset-0 rounded-full bg-rose-400/30"
                  />
                </motion.div>
                <div className="space-y-2 text-center md:text-left">
                  <span className="text-xs font-bold text-[#F43F8F] uppercase tracking-widest">Step {step.num}</span>
                  <h4 className="text-2xl font-serif">{step.title}</h4>
                  <p className="text-muted-foreground text-lg leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────── */}
      <Testimonials />

      {/* ── Pricing ───────────────────── */}
      <section id="pricing" className="py-28 bg-linear-to-b from-amber-50/30 to-rose-50/40 relative overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.08, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-80 h-80 bg-rose-200/20 rounded-full blur-3xl pointer-events-none"
        />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-20 space-y-4"
          >
            <p className="text-sm font-bold uppercase tracking-widest text-[#F43F8F]">💸 Our Plans</p>
            <h2 className="text-4xl md:text-5xl font-serif">Pick the plan that fits your needs</h2>
            <p className="text-muted-foreground text-lg">No hidden fees. No tech headaches. Just love.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
            <PricingCard
              tier="Dearest Basic"
              price="399"
              features={["Beautiful animated design", "See who's coming (Guest List)", "Event details & direction map", "Space for 5 wedding photos", "1 year of hosting included"]}
              delay={0.1}
            />
            <PricingCard
              tier="Dearest Silver"
              price="799"
              features={["Everything in Basic", "Up to 20 photos", "Your favourite background music", "Exclusive 'Grand' color themes", "Download your guest names", "Helping Hand (Priority Help)"]}
              isPopular
              delay={0.2}
            />
            <PricingCard
              tier="Dearest Gold"
              price="999"
              features={["Everything in Silver", "Unlimited photo space", "Magic Interactive Envelope opening", "Custom decorative heart motif", "Lifetime access for memories", "Your personal wedding helper"]}
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────── */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="container mx-auto max-w-4xl"
        >
          <motion.div
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="relative overflow-hidden rounded-[3rem] p-14 text-center text-white"
            style={{ background: "linear-gradient(135deg, #F43F8F, #c73272, #D4AF37, #F43F8F)", backgroundSize: "300% 300%" }}
          >
            {/* shine effect */}
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
            />
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl mb-6"
            >
              💍
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-serif mb-4">Your special day deserves a special invite</h2>
            <p className="text-white/80 text-xl mb-10">Create yours in minutes — your guests will be amazed!</p>
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.93 }}
                className="bg-white text-[#F43F8F] font-bold text-lg px-2 py-2 rounded-full shadow-2xl hover:shadow-white/30 transition-all"
              >
                Start Creating for Free ✨
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
