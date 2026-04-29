'use client'

import { usePathname } from 'next/navigation'
import { HomeSkeleton } from '@/components/skeleton/HomeSkeleton'
import { DashboardSkeleton } from '@/components/skeleton/DashboardSkeleton'
import { ShellSkeleton } from '@/components/skeleton/ShellSkeleton'
import { InvitationSkeleton } from '@/components/skeleton/InvitationSkeleton'
import { motion, AnimatePresence } from 'framer-motion'

export default function Loading() {
  const pathname = usePathname()

  // Determine which skeleton to show based on the route
  const getSkeleton = () => {
    if (pathname === '/') return <HomeSkeleton />
    if (pathname?.startsWith('/dashboard')) return <DashboardSkeleton />
    if (pathname?.startsWith('/invite')) return <InvitationSkeleton />
    return <ShellSkeleton />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {getSkeleton()}
    </motion.div>
  )
}
