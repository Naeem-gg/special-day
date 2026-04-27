"use client"

import Link from "next/link"
import { Home, ArrowLeft, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export default function NotFound() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Floating Petals - Only rendered on client to avoid hydration mismatch */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="petal text-(--dn-rose) opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${10 + Math.random() * 10}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            >
              {i % 2 === 0 ? "🌸" : "✨"}
            </div>
          ))}
        </div>
      )}

      <div className="max-w-md w-full text-center z-10 animate-slide-up">
        <div className="mb-8 relative inline-block">
          <div className="absolute inset-0 blur-3xl bg-(--dn-rose) opacity-10 rounded-full animate-glow-pulse" />
          <div className="relative glass p-8 rounded-4xl border-(--dn-rose)/10">
            <h1 className="text-8xl font-serif font-black gradient-text tracking-tighter mb-2">404</h1>
            <div className="w-16 h-1 bg-linear-to-r from-transparent via-(--dn-rose) to-transparent mx-auto mb-6" />
            <div className="space-y-4">
              <h2 className="text-2xl font-serif font-bold text-(--dn-dark)">Where's the party?</h2>
              <p className="text-muted-foreground leading-relaxed">
                This invitation seems to have lost its way. The page you're looking for doesn't exist or has been moved to a different celebration.
              </p>
            </div>
          </div>

          {/* Decorative Heart Icon */}
          <div className="absolute -top-4 -right-4 bg-white p-3 rounded-full shadow-lg border border-(--dn-rose)/10 animate-float">
            <Heart className="w-6 h-6 text-(--dn-rose) fill-(--dn-rose)" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            asChild
            variant="default"
            className="rounded-full px-8 py-6 h-auto text-lg bg-linear-to-r from-(--dn-rose) to-[#d43f7d] hover:opacity-90 transition-all shadow-lg hover:shadow-(--dn-rose)/25"
          >
            <Link href="/">
              <Home className="mr-2 w-5 h-5" />
              Go Back Home
            </Link>
          </Button>

          <Button
            variant="outline"
            className="rounded-full px-8 py-6 h-auto text-lg border-(--dn-rose)/20 text-(--dn-rose) hover:bg-(--dn-rose)/5"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Return Previous
          </Button>
        </div>

        <p className="mt-12 text-sm text-muted-foreground font-serif italic">
          DNvites — Creating memories, one page at a time.
        </p>
      </div>
    </div>
  )
}
