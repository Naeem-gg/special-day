'use client'

import { useState } from 'react'
import {
  AdminOverview,
  InvitationManager,
  CouponManager,
  TierManager,
  AdminSettings,
  GiftInviteManager,
} from '@/components/admin/AdminDashboard'
import { TestimonialManager } from '@/components/admin/TestimonialManager'
import { FeedbackManager } from '@/components/admin/FeedbackManager'
import { Button } from '@/components/ui/button'
import {
  LogOut,
  LayoutDashboard,
  Ticket,
  Users,
  CreditCard,
  Settings,
  Gift,
  MessageSquare,
  ArrowLeft,
  Inbox,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DNvitesLogo } from '@/components/branding/DNvitesLogo'
import { motion, AnimatePresence } from 'framer-motion'

interface AdminClientPageProps {
  initialStats: any
  initialInvitations: any[]
  initialCoupons: any[]
  initialTiers: any[]
  initialTestimonials: any[]
}

export function AdminClientPage({
  initialStats,
  initialInvitations,
  initialCoupons,
  initialTiers,
  initialTestimonials,
}: AdminClientPageProps) {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/adminn/login')
  }

  const sections = [
    {
      id: 'stats',
      label: 'Overview',
      desc: 'Business metrics',
      icon: LayoutDashboard,
      color: 'rose',
      component: <AdminOverview initialStats={initialStats} />,
    },
    {
      id: 'invitations',
      label: 'Invites',
      desc: 'Manage cards',
      icon: Users,
      color: 'blue',
      component: <InvitationManager initialInvitations={initialInvitations} />,
    },
    {
      id: 'coupons',
      label: 'Coupons',
      desc: 'Discounts',
      icon: Ticket,
      color: 'purple',
      component: <CouponManager initialCoupons={initialCoupons} />,
    },
    {
      id: 'tiers',
      label: 'Pricing',
      desc: 'Manage plans',
      icon: CreditCard,
      color: 'amber',
      component: <TierManager initialTiers={initialTiers} />,
    },
    {
      id: 'testimonials',
      label: 'Reviews',
      desc: 'Feedback',
      icon: MessageSquare,
      color: 'emerald',
      component: <TestimonialManager initialTestimonials={initialTestimonials} />,
    },
    {
      id: 'feedback',
      label: 'Feedback',
      desc: 'Complaints & grievances',
      icon: Inbox,
      color: 'orange',
      component: <FeedbackManager />,
    },
    {
      id: 'gift',
      label: 'Gift',
      desc: 'Send credit',
      icon: Gift,
      color: 'pink',
      component: <GiftInviteManager />,
    },
    {
      id: 'settings',
      label: 'Settings',
      desc: 'Admin security',
      icon: Settings,
      color: 'slate',
      component: <AdminSettings />,
    },
  ]

  const currentSection = sections.find((s) => s.id === activeSection)

  const COLOR_MAP: Record<string, string> = {
    rose: 'bg-rose-50 text-rose-500',
    blue: 'bg-blue-50 text-blue-500',
    purple: 'bg-purple-50 text-purple-500',
    amber: 'bg-amber-50 text-amber-500',
    emerald: 'bg-emerald-50 text-emerald-500',
    pink: 'bg-pink-50 text-pink-500',
    orange: 'bg-orange-50 text-orange-500',
    slate: 'bg-slate-100 text-slate-500',
  }

  return (
    <div className="min-h-screen bg-[#FDFCFD] selection:bg-rose-100">
      {/* Premium Top Bar */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-rose-50 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveSection(null)}
            className="p-1.5 bg-rose-50 rounded-lg hover:scale-105 transition-transform"
          >
            <DNvitesLogo className="h-5 w-auto" />
          </button>
          <div className="h-4 w-px bg-rose-100 mx-2" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-300">
            Admin Panel
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/" target="_blank">
            <Button
              variant="ghost"
              size="sm"
              className="text-[11px] font-bold text-gray-500 hover:text-[#F43F8F] uppercase tracking-wider"
            >
              Site View
            </Button>
          </Link>
          <div className="h-4 w-px bg-gray-100 mx-2" />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-[11px] font-bold text-red-400 hover:text-red-500 hover:bg-red-50 uppercase tracking-wider"
          >
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-10">
        <AnimatePresence mode="wait">
          {!activeSection ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {sections.map((section) => (
                <motion.button
                  key={section.id}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSection(section.id)}
                  className="aspect-square bg-white border border-gray-100 rounded-[2.5rem] p-8 text-left shadow-sm hover:shadow-xl hover:shadow-rose-100/50 hover:border-rose-100 transition-all flex flex-col justify-between group"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${COLOR_MAP[section.color]}`}
                  >
                    <section.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{section.label}</h3>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">
                      {section.desc}
                    </p>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveSection(null)}
                  className="w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-sm hover:bg-rose-50 hover:text-[#F43F8F] transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 font-serif">
                    {currentSection?.label}
                  </h2>
                  <p className="text-sm text-gray-400 font-medium">{currentSection?.desc}</p>
                </div>
              </div>

              <div className="bg-white border border-gray-50 rounded-[3rem] p-6 md:p-10 shadow-2xl shadow-rose-100/20">
                {currentSection?.component}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 pointer-events-none">
        <div className="max-w-6xl mx-auto flex justify-center">
          <p className="text-[10px] font-bold text-gray-200 uppercase tracking-[0.4em]">
            DNvites Control v2.0
          </p>
        </div>
      </div>
    </div>
  )
}
