'use client'

import Link from 'next/link'
import { DNvitesLogo } from '@/components/branding/DNvitesLogo'
import Image from 'next/image'
import { motion, useScroll, useTransform, AnimatePresence, Variants } from 'framer-motion'
import { Button } from '@/components/ui/button'
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
  Ticket,
  Percent,
  MoreHorizontal,
  ChevronRight,
  HelpCircle,
} from 'lucide-react'
import { FloatingHearts } from '@/components/floating-hearts'
import { useEffect, useRef, useState } from 'react'
import { Footer } from '@/components/Footer'
import MobileInvitationPreview from '@/components/MobileInvitationPreview'
import { TestimonialsList } from '@/components/testimonials/TestimonialsList'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

/* ── Typewriter ───────────────────────── */
function TypewriterHeading() {
  const phrases = [
    "They'll Never Forget",
    "That Sparkles with Joy",
    "as Unique as Your Love",
    "That Tells Your Story",
    "That Guests Will Cherish",
  ]
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [speed, setSpeed] = useState(100)

  useEffect(() => {
    const handleTyping = () => {
      const fullText = phrases[index]
      
      if (!isDeleting) {
        setText(fullText.substring(0, text.length + 1))
        setSpeed(100) // Typing speed

        if (text.length === fullText.length) {
          setIsDeleting(true)
          setSpeed(2500) // Wait before starting to delete
        }
      } else {
        setText(fullText.substring(0, text.length - 1))
        setSpeed(50) // Deleting speed

        if (text.length === 0) {
          setIsDeleting(false)
          setIndex((prev) => (prev + 1) % phrases.length)
          setSpeed(500) // Wait before typing next phrase
        }
      }
    }

    const timer = setTimeout(handleTyping, speed)
    return () => clearTimeout(timer)
  }, [text, isDeleting, index, speed, phrases])

  return (
    <span className="gradient-text italic inline-block min-w-[1ch]">
      {text}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        className="inline-block w-[3px] h-[0.9em] bg-[#D4AF37] ml-1 align-middle"
      />
    </span>
  )
}

/* ── Petal Rain ───────────────────────── */
function PetalRain() {
  const [mounted, setMounted] = useState(false)
  const [petalStyles, setPetalStyles] = useState<any[]>([])
  const petalsSymbols = ['🌸', '🌺', '🌷', '💮', '🌼']

  useEffect(() => {
    const styles = Array.from({ length: 18 }).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      animationDuration: `${8 + Math.random() * 10}s`,
      animationDelay: `${Math.random() * 12}s`,
      fontSize: `${14 + Math.random() * 14}px`,
      opacity: 0.55 + Math.random() * 0.4,
      symbol: petalsSymbols[i % petalsSymbols.length],
    }))
    setPetalStyles(styles)
    setMounted(true)
  }, [])

  if (!mounted) return null

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
  )
}

/* ── Staggered container ──────────────── */
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
}
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

/* ── Feature Card ─────────────────────── */
function FeatureCard({
  icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ReactNode
  title: string
  description: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative p-10 bg-white rounded-[2.5rem] border border-amber-100 shadow-sm hover:shadow-2xl hover:shadow-amber-200/40 transition-all duration-500"
    >
      {/* soft glow */}
      <div className="absolute inset-0 rounded-[2.5rem] bg-linear-to-br from-amber-50/60 to-amber-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <motion.div
        whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.15 }}
        transition={{ duration: 0.5 }}
        className="w-16 h-16 bg-linear-to-br from-amber-100 to-amber-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm relative z-10"
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-serif text-gray-900 mb-3 relative z-10">{title}</h3>
      <p className="text-muted-foreground leading-relaxed relative z-10">{description}</p>
    </motion.div>
  )
}

/* ── Pricing Card ─────────────────────── */
function PricingCard({
  tier,
  price: inrPrice,
  originalPrice: inrOriginal,
  features,
  isPopular = false,
  delay = 0,
  currency,
}: {
  tier: string
  price: string
  originalPrice?: string
  features: string[]
  isPopular?: boolean
  delay?: number
  currency: Currency
}) {
  const isBasic = tier.toLowerCase().includes('basic')
  const isGold = tier.toLowerCase().includes('gold')
  const displayPrice = getDisplayPrice(parseInt(inrPrice), currency)
  const displayOriginal = inrOriginal ? getDisplayPrice(parseInt(inrOriginal), currency) : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: isPopular ? 1.05 : 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -12, transition: { duration: 0.4 } }}
      className={`relative p-8 rounded-[2.5rem] border transition-all duration-500 group ${
        isPopular
          ? 'bg-linear-to-br from-[#D4AF37] to-[#8E6F3E] text-white border-transparent shadow-[0_20px_50px_rgba(244,63,143,0.3)] z-10'
          : isGold
            ? 'bg-white text-foreground border-amber-100 shadow-[0_15px_40px_rgba(212,175,55,0.1)]'
            : 'bg-white text-foreground border-amber-100 shadow-[0_15px_40px_rgba(244,63,143,0.06)]'
      }`}
    >
      {isPopular && (
        <>
          {/* Animated shine */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/25 to-transparent skew-x-12 pointer-events-none"
          />
          <div className="absolute top-4 right-6 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/30">
            🔥 Most Popular
          </div>
        </>
      )}

      {isGold && !isPopular && (
        <div className="absolute top-4 right-6 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-amber-100">
          ⭐ Best Value
        </div>
      )}

      <div className="space-y-8 relative z-10">
        <div className="space-y-2">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
              isPopular ? 'bg-white/20' : isGold ? 'bg-amber-50' : 'bg-amber-50'
            }`}
          >
            {isBasic ? (
              <Heart className={isPopular ? 'text-white' : 'text-[#D4AF37]'} />
            ) : isGold ? (
              <Star className={isPopular ? 'text-white' : 'text-amber-500'} />
            ) : (
              <Sparkles className={isPopular ? 'text-white' : 'text-[#D4AF37]'} />
            )}
          </div>
          <h4
            className={`text-xl font-serif tracking-wide ${isPopular ? 'text-white' : 'text-gray-900'}`}
          >
            {tier}
          </h4>
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-serif ${isPopular ? 'text-white' : 'text-gray-900'}`}>
              {displayPrice.symbol}
              {displayPrice.amount}
            </span>
            {displayOriginal && (
              <span
                className={`text-xl font-serif line-through ${isPopular ? 'text-white/60' : 'text-gray-400'}`}
              >
                {displayOriginal.symbol}
                {displayOriginal.amount}
              </span>
            )}
            <span className={`text-sm ${isPopular ? 'text-white/60' : 'text-muted-foreground'}`}>
              / invitation
            </span>
          </div>
        </div>

        <div className={`h-px w-full ${isPopular ? 'bg-white/20' : 'bg-amber-100/50'}`} />

        <ul className="space-y-4">
          {features.map((feature, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: delay + 0.3 + idx * 0.1 }}
              className="flex items-start gap-3 text-sm"
            >
              <div
                className={`mt-1 rounded-full p-0.5 ${isPopular ? 'bg-white/20' : 'bg-amber-50'}`}
              >
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${isPopular ? 'text-white' : 'text-[#D4AF37]'}`}
                />
              </div>
              <span className={isPopular ? 'text-white/90' : 'text-gray-600 leading-tight'}>
                {feature}
              </span>
            </motion.li>
          ))}
        </ul>

        <Link href="/dashboard" className="block pt-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`w-full py-4 rounded-2xl text-base font-bold transition-all duration-300 shadow-xl ${
              isPopular
                ? 'bg-white text-[#D4AF37] hover:shadow-white/20'
                : isGold
                  ? 'bg-linear-to-r from-amber-500 to-[#D4AF37] text-white hover:shadow-amber-200/50'
                  : 'bg-linear-to-r from-[#D4AF37] to-[#8E6F3E] text-white hover:shadow-amber-200/50'
            }`}
          >
            {isBasic ? 'Start Creating 💌' : isPopular ? 'Get Started ✨' : 'Choose Premium 👑'}
          </motion.button>
        </Link>
      </div>
    </motion.div>
  )
}

/* ── Scroll-progress bar ──────────────── */
function ProgressBar() {
  const { scrollYProgress } = useScroll()
  return (
    <motion.div
      className="fixed top-8 left-0 right-0 h-1 z-100 origin-left"
      style={{
        scaleX: scrollYProgress,
        background: 'linear-gradient(90deg, #D4AF37, #D4AF37)',
      }}
    />
  )
}

import { detectCurrency, getDisplayPrice, Currency } from '@/lib/currency'

/* ════════ MAIN HOME CLIENT ══════════════ */
export default function HomeClient({
  testimonials,
  session,
}: {
  testimonials: any[]
  session: any
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currency, setCurrency] = useState<Currency>('INR')

  useEffect(() => {
    detectCurrency().then(setCurrency)
  }, [])
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroY = useTransform(heroScroll, [0, 1], [0, 120])
  const heroOpacity = useTransform(heroScroll, [0, 0.6], [1, 0])

  return (
    <main className="relative min-h-screen bg-background font-sans selection:bg-amber-200/60 overflow-x-hidden">
      <ProgressBar />
      <FloatingHearts />
      <PetalRain />

      {/* ── Announcement Bar ─────────── */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 w-full z-100"
      >
        <div className="bg-linear-to-r from-[#D4AF37] via-[#C5A059] to-[#8E6F3E] text-white py-1.5 px-4 text-center text-[10px] md:text-[11px] font-bold uppercase tracking-widest shadow-lg min-h-[32px] flex items-center justify-center">
          <div className="container mx-auto flex items-center justify-center gap-3">
            <motion.div
              animate={{ rotate: [0, 15, -15, 15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Ticket className="w-3 h-3" />
            </motion.div>
            <span className="flex items-center gap-2">
              <span>✨ Special Offer: Save 5% with code</span>
              <span className="bg-white text-[#D4AF37] px-1.5 py-0.5 rounded-md font-black">DN5</span>
              <span className="hidden sm:inline">— Limited Time Only! 💌</span>
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Navigation ─────────────────── */}
      <motion.nav
        initial={{ y: -130, opacity: 0 }}
        animate={{ y: 32, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 w-full z-50 glass border-b border-amber-100/50"
      >
        <div className="container relative mx-auto px-6 h-20 flex items-center justify-between">
          <DNvitesLogo />

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            <Link
              href="#features"
              className="text-sm font-bold text-gray-800 hover:text-[#D4AF37] transition-colors"
            >
              Features
            </Link>

            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-[#D4AF37] transition-all group">
                  More
                  <MoreHorizontal className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2 rounded-2xl border-amber-100 shadow-2xl shadow-amber-200/50">
                <div className="grid gap-1">
                  {[
                    { name: 'How it Works', icon: <Sparkles className="w-4 h-4" />, href: '#how-it-works' },
                    { name: 'Pricing', icon: <Ticket className="w-4 h-4" />, href: '#pricing' },
                    { name: 'Testimonials', icon: <Star className="w-4 h-4" />, href: '#testimonials' },
                    { name: 'FAQs', icon: <HelpCircle className="w-4 h-4" />, href: '#faqs' },
                  ].map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-amber-50 hover:text-[#D4AF37] transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 group-hover:text-[#D4AF37]">{item.icon}</span>
                        {item.name}
                      </div>
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </Link>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-4"
            >
              <Link
                href="https://instagram.com/dnvites"
                target="_blank"
                className="text-gray-400 hover:text-[#D4AF37] transition-colors"
                title="Follow us on Instagram"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </Link>
              <Link href="/gift">
                <Button
                  variant="ghost"
                  className="text-sm text-[#D4AF37] hover:text-[#B8860B] hover:bg-amber-50 flex items-center gap-1.5 font-bold"
                >
                  <Gift className="w-4 h-4" /> Gift an Invite
                </Button>
              </Link>
              {!session ? (
                <Link href="/login">
                  <Button variant="ghost" className="text-sm hover:text-[#D4AF37]">
                    Sign In
                  </Button>
                </Link>
              ) : (
                <Link href="/account">
                  <Button variant="ghost" className="text-sm text-[#D4AF37] font-bold">
                    My Account
                  </Button>
                </Link>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  className="bg-linear-to-r from-[#D4AF37] to-[#8E6F3E] text-white rounded-full px-6 py-2.5 text-sm font-semibold shadow-lg shadow-amber-300/40 hover:shadow-amber-400/60 transition-shadow"
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
              className="p-2 text-gray-600 hover:text-[#D4AF37] transition-colors"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
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
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 backdrop-blur-xl border-b border-amber-100 overflow-hidden"
            >
              <div className="px-6 py-6 flex flex-col gap-5">
                {['Features', 'How it Works', 'Pricing', 'Testimonials', 'FAQs'].map((item) => (
                  <Link
                    key={item}
                    href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-base font-semibold text-gray-800 hover:text-[#D4AF37] transition-colors"
                  >
                    {item}
                  </Link>
                ))}
                <Link
                  href="/gift"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-semibold text-[#D4AF37] flex items-center gap-2"
                >
                  <Gift className="w-5 h-5" /> Gift an Invite
                </Link>
                <div className="h-px bg-amber-100/50 w-full my-2" />
                {!session ? (
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-base font-semibold text-gray-800 hover:text-[#D4AF37]"
                  >
                    Sign In
                  </Link>
                ) : (
                  <Link
                    href="/account"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-base font-semibold text-[#D4AF37]"
                  >
                    My Account
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full"
                >
                  <button className="w-full bg-linear-to-r from-[#D4AF37] to-[#8E6F3E] text-white rounded-xl px-6 py-3.5 text-base font-bold shadow-lg shadow-amber-300/40 active:scale-[0.98] transition-transform">
                    Create Your Invitation ✨
                  </button>
                </Link>
                <div className="flex items-center gap-4 pt-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Follow Us
                  </span>
                  <Link
                    href="https://instagram.com/dnvites"
                    target="_blank"
                    className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-[#D4AF37]"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ── Hero Section ──────────────── */}
      <section
        ref={heroRef}
        className="relative pt-32 pb-24 px-6 min-h-screen flex items-center overflow-hidden"
      >
        {/* Animated gradient orbs */}
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 -left-32 w-[600px] h-[600px] bg-amber-200/30 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-0 -right-32 w-[500px] h-[500px] bg-amber-200/30 rounded-full blur-3xl pointer-events-none"
        />

        <div className="container relative mx-auto max-w-6xl z-10">
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
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-[#D4AF37]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Your Love, Beautifully Shared
                  </span>
                </motion.div>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-5xl md:text-7xl font-serif leading-[1.1] min-h-[2.2em] md:min-h-0"
              >
                Create a Digital Wedding Invitation <br />
                <span className="text-3xl md:text-5xl opacity-80 block mt-2">
                  <TypewriterHeading />
                </span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-xl text-muted-foreground leading-relaxed max-w-lg"
              >
                Share your big day with the world — no designer needed! Just fill in a few details
                and get a gorgeous digital invite ready to send to everyone you love. 💍
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    className="group flex items-center gap-2 bg-linear-to-r from-[#D4AF37] to-[#8E6F3E] text-white rounded-full px-8 h-14 text-base font-semibold shadow-xl shadow-amber-300/40 hover:shadow-amber-400/60 transition-all"
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
                <Link href="/dashboard?guest=true">
                  <motion.button
                    whileHover={{ scale: 1.04, borderColor: '#D4AF37', color: '#D4AF37' }}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-2 border-2 border-border rounded-full px-8 h-14 text-base font-semibold transition-all text-foreground hover:border-amber-300"
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
                      <Image
                        src={`https://i.pravatar.cc/40?u=${i + 20}`}
                        alt="happy couple"
                        width={40}
                        height={40}
                      />
                    </motion.div>
                  ))}
                </div>
                <div>
                  <div className="flex text-amber-400 text-sm mb-0.5">{'★★★★★'}</div>
                  <p className="text-sm text-muted-foreground">
                    Loved by <span className="font-bold text-foreground">500+</span> couples this
                    year
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Hero image - Replaced with MobileInvitationPreview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ y: heroY, opacity: heroOpacity }}
              className="relative"
            >
              <MobileInvitationPreview />

              {/* Decorative circle blobs */}
              <div className="absolute -top-10 -right-10 w-36 h-36 bg-amber-300/20 blur-3xl rounded-full animate-float" />
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
      <section id="features" className="py-28 bg-linear-to-b from-amber-50/40 to-amber-50/30">
        <div className="container relative mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-20 space-y-4"
          >
            <p className="text-sm font-bold uppercase tracking-widest text-[#D4AF37]">
              ✨ What You'll Love
            </p>
            <h2 className="text-4xl md:text-5xl font-serif">
              Everything you need to share your joy
            </h2>
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
              icon={<Layout className="w-6 h-6 text-[#D4AF37]" />}
              title="Gorgeous, Ready-Made Designs"
              description="Pick from stunning Styles — no design skills needed. Just add your names and you're done!"
              delay={0}
            />
            <FeatureCard
              icon={<Send className="w-6 h-6 text-[#D4AF37]" />}
              title="Share in One Tap"
              description="Send your invite through WhatsApp, Instagram, or Email in seconds. No printing, no postage!"
              delay={0.15}
            />
            <FeatureCard
              icon={<ImageIcon className="w-6 h-6 text-[#D4AF37]" />}
              title="Show Off Your Photos"
              description="Create a beautiful photo gallery so your guests can relive your most precious moments."
              delay={0.3}
            />
            <FeatureCard
              icon={<Music className="w-6 h-6 text-[#D4AF37]" />}
              title="Set the Mood with Music"
              description="Add your favourite song so guests feel the love the moment they open the invitation."
              delay={0.15}
            />
            <FeatureCard
              icon={<Gift className="w-6 h-6 text-[#D4AF37]" />}
              title="Track Who's Coming"
              description="Your guests can RSVP with a click and you can see the list in real time - no spreadsheets needed!"
              delay={0.3}
            />
            <FeatureCard
              icon={<Star className="w-6 h-6 text-[#D4AF37]" />}
              title="Live for One Full Year"
              description="Your invitation stays online for a whole year. Family can revisit it any time they want."
              delay={0.45}
            />
          </div>
        </div>
      </section>

      {/* ── Guest Experience ──────────────────── */}
      <section className="py-28 relative overflow-hidden bg-white">
        <div className="container relative mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-xs font-bold uppercase tracking-widest">
                💎 THE GUEST EXPERIENCE
              </div>
              <h2 className="text-4xl md:text-5xl font-serif leading-tight">
                Not just an invite, <br />
                <span className="gradient-text italic">but a digital event</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We've obsessed over every detail to make sure your guests are wowed from the second
                they tap the link. It's the replacement for expensive wedding websites and paper
                cards.
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: 'Animated Envelope',
                    desc: "A magical 'tap to open' experience that mimics a real wax-sealed envelope.",
                    icon: '💌',
                  },
                  {
                    title: 'Integrated Music',
                    desc: 'Your favourite song plays automatically to set the mood.',
                    icon: '🎵',
                  },
                  {
                    title: 'One-Tap Maps',
                    desc: 'No more lost guests. Every event has a direct link to Google & Apple Maps.',
                    icon: '📍',
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-xl shrink-0 shadow-sm">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square md:aspect-4/5 rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <Image
                src="/images/hero-bg.png"
                alt="Guest Experience Preview"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 right-10 text-white space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">
                  Live Guest View
                </p>
                <p className="text-2xl font-serif">
                  "The most beautiful invite I've ever received!"
                </p>
                <p className="text-sm italic opacity-70">— Ananya, Wedding Guest</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── How it Works ──────────────── */}
      <section id="how-it-works" className="py-28 relative overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-amber-100/40 rounded-full pointer-events-none"
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
              {
                num: '1',
                icon: '📝',
                title: 'Tell Us About Your Wedding',
                desc: 'Add your names, date, and venue — it takes less than 2 minutes.',
              },
              {
                num: '2',
                icon: '📸',
                title: 'Add Your Photos',
                desc: 'Upload some of your favourite pictures to make the invite feel personal and special.',
              },
              {
                num: '3',
                icon: '💌',
                title: 'Share With Everyone',
                desc: 'Get a beautiful link and share it with your whole family and friends list — instantly.',
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col md:flex-row gap-8 items-center"
              >
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  className="relative w-20 h-20 rounded-full bg-linear-to-br from-[#D4AF37] to-[#8E6F3E] text-white flex items-center justify-center text-3xl font-serif shrink-0 shadow-xl shadow-amber-300/50"
                >
                  {step.icon}
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                    className="absolute inset-0 rounded-full bg-amber-400/30"
                  />
                </motion.div>
                <div className="space-y-2 text-center md:text-left">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
                    Step {step.num}
                  </span>
                  <h4 className="text-2xl font-serif">{step.title}</h4>
                  <p className="text-muted-foreground text-lg leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────── */}
      <TestimonialsList initialTestimonials={testimonials} />

      {/* ── Paper vs Digital ──────────── */}
      <section className="py-28 bg-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(#f43f8f0a_1px,transparent_1px)] bg-size-[32px_32px] pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16 space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-100 text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
              📄 Paper vs ✨ Digital
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-gray-900">Why choose digital?</h2>
            <p className="text-muted-foreground text-lg">
              Traditional paper invites are expensive, slow, and wasteful. Here's how DNvites stacks
              up.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl mx-auto rounded-[2.5rem] overflow-hidden shadow-2xl shadow-amber-100/60 border border-amber-100"
          >
            <div className="grid grid-cols-3 bg-slate-900 text-white">
              <div className="p-5 text-sm font-bold uppercase tracking-widest text-slate-400">
                Feature
              </div>
              <div className="p-5 text-center border-l border-white/10">
                <span className="text-sm font-bold text-slate-300">📄 Paper Invitation</span>
              </div>
              <div className="p-5 text-center border-l border-white/10 bg-linear-to-br from-[#D4AF37]/20 to-transparent">
                <span className="text-sm font-bold text-[#D4AF37]">✨ DNvites Digital</span>
              </div>
            </div>

            {[
              {
                feature: '💰 Cost',
                paper: '₹8,000 – ₹40,000+',
                digital: 'From ₹399 one-time',
                highlight: true,
              },
              {
                feature: '⏱️ Time to Create',
                paper: '3 – 8 weeks',
                digital: 'Ready in minutes',
                highlight: false,
              },
              {
                feature: '📋 Guest Tracking',
                paper: 'Manual spreadsheets',
                digital: 'Automatic dashboard',
                highlight: true,
              },
              {
                feature: '🌍 Languages',
                paper: 'One per print run',
                digital: 'Multiple languages',
                highlight: false,
              },
              {
                feature: '✏️ Updates & Changes',
                paper: 'Reprint everything',
                digital: 'Edit in real-time',
                highlight: true,
              },
              {
                feature: '📬 Delivery',
                paper: 'Postal service (days)',
                digital: 'Instant via link',
                highlight: false,
              },
              {
                feature: '📱 Mobile Friendly',
                paper: 'N/A',
                digital: 'Perfect on any device',
                highlight: true,
              },
              {
                feature: '🌿 Eco-Friendly',
                paper: 'Paper & ink waste',
                digital: '100% digital & green',
                highlight: false,
              },
            ].map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className={`grid grid-cols-3 border-t border-slate-100 ${row.highlight ? 'bg-slate-50/80' : 'bg-white'} group hover:bg-amber-50/40 transition-colors`}
              >
                <div className="p-5 text-sm font-semibold text-slate-700">{row.feature}</div>
                <div className="p-5 text-center border-l border-slate-100">
                  <span className="text-sm text-slate-400 flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0 inline-block" />
                    {row.paper}
                  </span>
                </div>
                <div className="p-5 text-center border-l border-amber-100 bg-amber-50/30 group-hover:bg-amber-50/60">
                  <span className="text-sm font-semibold text-slate-900 flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0 inline-block" />
                    {row.digital}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-10 max-w-2xl mx-auto text-center"
          >
            <div className="inline-flex flex-col sm:flex-row items-center gap-3 px-8 py-5 rounded-full bg-linear-to-r from-[#D4AF37] to-[#8E6F3E] text-white shadow-2xl shadow-amber-300/50">
              <span className="text-2xl">💸</span>
              <span className="text-base md:text-lg font-bold">
                Save up to <span className="text-2xl font-extrabold">₹39,000+</span> compared to
                traditional paper invitations
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Pricing ───────────────────── */}
      <section
        id="pricing"
        className="py-32 bg-linear-to-b from-amber-50/50 via-white to-amber-50/50 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-20 left-[10%] opacity-10"
          >
            <Heart className="w-20 h-20 text-[#D4AF37]" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-20 right-[10%] opacity-10"
          >
            <Sparkles className="w-24 h-24 text-amber-400" />
          </motion.div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-amber-100/20 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-20 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-100 text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
              <Ticket className="w-4 h-4" />
              Transparent Pricing
            </div>
            <h2 className="text-4xl md:text-6xl font-serif text-gray-900 leading-tight">
              One simple price for your <br className="hidden md:block" />
              <span className="gradient-text italic">Perfect Day</span>
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Choose the perfect plan to share your love story. No hidden fees, no recurring
              subscriptions. Just a one-time payment for a lifetime of memories.
            </p>

            {/* 🚀 Limited Launch Highlight */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="relative max-w-lg mx-auto"
            >
              <div className="absolute -inset-1 bg-linear-to-r from-[#D4AF37] via-amber-400 to-[#D4AF37] rounded-2xl blur-md opacity-30 animate-pulse" />
              <div className="relative bg-white border border-amber-100 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-4 shadow-xl shadow-amber-100/40">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-gray-900 uppercase tracking-tighter">
                    🚀 Exclusive <span className="text-[#D4AF37]">Launch Pricing</span>
                  </p>
                  <p className="text-[11px] text-gray-500 font-medium leading-tight">
                    Valid only for the{' '}
                    <span className="text-[#D4AF37] font-bold">first 20 customers</span>. Prices
                    will increase by ₹300 soon!
                  </p>
                </div>
                <div className="ml-auto bg-amber-100 text-[#D4AF37] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest hidden sm:block">
                  Limited
                </div>
              </div>
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            <PricingCard
              tier="Dearest Basic"
              price="399"
              originalPrice="699"
              features={[
                'Beautiful animated design',
                'Event details & direction map',
                'Space for 1 wedding photo',
                '1 year of hosting included',
                'Edit details for 48 hours',
                'Shareable via WhatsApp & Social',
              ]}
              delay={0.1}
              currency={currency}
            />
            <PricingCard
              tier="Dearest Silver"
              price="799"
              originalPrice="1299"
              features={[
                'Everything in Basic',
                "See who's coming (Guest List)",
                'Up to 5 photos',
                'Your favourite background music',
                'Edit details for 48 hours',
                'Download your guest names',
                'Helping Hand (Priority Help)',
              ]}
              isPopular
              delay={0.2}
              currency={currency}
            />
            <PricingCard
              tier="Dearest Gold"
              price="999"
              originalPrice="1999"
              features={[
                'Everything in Silver',
                'Up to 10 photos',
                'Magic Interactive Envelope opening',
                'Custom decorative heart motif',
                'Edit details for 48 hours',
                'Lifetime access for memories',
                'Your personal wedding helper',
              ]}
              delay={0.3}
              currency={currency}
            />
          </div>
        </div>
      </section>

      {/* ── FAQ Section ────────────────── */}
      <section id="faqs" className="py-28 bg-amber-50/20">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-serif">Commonly Asked Questions</h2>
            <p className="text-muted-foreground text-lg">Everything you need to know about your digital invitation.</p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: "How do I share my digital wedding invitation?",
                a: "Once you create your invitation, you'll get a unique link. You can simply copy this link and send it via WhatsApp, Instagram DM, Email, or even include it on your paper Save the Date cards."
              },
              {
                q: "Can I edit my invitation after I've shared it?",
                a: "Yes! You can edit the details like venue, time, and photos for up to 48 hours after purchase. The changes will reflect instantly for everyone who opens your link."
              },
              {
                q: "How does the RSVP tracking work?",
                a: "Your guests will see an RSVP button on your invitation. When they fill it out, their response (Name, Number of Guests, Attending status) is instantly updated in your private dashboard."
              },
              {
                q: "Can I add music to my invitation?",
                a: "Absolutely! Our Silver and Gold plans allow you to add any song. You can upload an MP3 or provide a link to a song that sets the perfect mood for your guests."
              },
              {
                q: "How long will my invitation stay online?",
                a: "All invitations stay live for at least one full year from the date of creation. Our Gold plan even offers lifetime access so you can revisit your digital memories forever."
              }
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">Q: {faq.q}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Schema for Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How do I share my digital wedding invitation?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Once you create your invitation, you'll get a unique link. You can simply copy this link and send it via WhatsApp, Instagram DM, Email, or even include it on your paper Save the Date cards."
                }
              },
              {
                "@type": "Question",
                "name": "Can I edit my invitation after I've shared it?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! You can edit the details like venue, time, and photos for up to 48 hours after purchase. The changes will reflect instantly for everyone who opens your link."
                }
              },
              {
                "@type": "Question",
                "name": "How does the RSVP tracking work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Your guests will see an RSVP button on your invitation. When they fill it out, their response (Name, Number of Guests, Attending status) is instantly updated in your private dashboard."
                }
              }
            ]
          })
        }}
      />

      {/* ── CTA Banner ────────────────── */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="container relative mx-auto max-w-4xl"
        >
          <motion.div
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="relative overflow-hidden rounded-[3rem] p-14 text-center text-white"
            style={{
              background: 'linear-gradient(135deg, #D4AF37, #8E6F3E, #D4AF37, #D4AF37)',
              backgroundSize: '300% 300%',
            }}
          >
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
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
            <h2 className="text-4xl md:text-5xl font-serif mb-4">
              Your special day deserves a special invite
            </h2>
            <p className="text-white/80 text-xl mb-10">
              Create yours in minutes — your guests will be amazed!
            </p>
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.93 }}
                className="bg-white text-[#D4AF37] font-bold text-lg px-8 py-4 rounded-full shadow-2xl hover:shadow-white/30 transition-all"
              >
                Start Creating for Free ✨
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </main>
  )
}
