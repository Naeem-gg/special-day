'use client'

import { Button } from '@/components/ui/button'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-(--dn-rose) opacity-[0.03] rounded-full blur-3xl animate-glow-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-(--dn-gold) opacity-[0.03] rounded-full blur-3xl animate-glow-pulse"
          style={{ animationDelay: '1s' }}
        />
      </div>

      <div className="max-w-md w-full text-center z-10 animate-slide-up">
        <div className="mb-8">
          <div className="glass p-10 rounded-[2.5rem] border-destructive/10 relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-destructive/10 p-4 rounded-2xl backdrop-blur-md">
              <AlertCircle className="w-10 h-10 text-destructive animate-pulse" />
            </div>

            <h1 className="text-4xl font-serif font-bold text-(--dn-dark) mt-4 mb-2">
              Oops! Something went wrong
            </h1>
            <div className="w-12 h-1 bg-destructive/20 mx-auto mb-6 rounded-full" />

            <p className="text-muted-foreground leading-relaxed mb-6">
              We encountered an unexpected glitch while preparing your celebration. Our team has
              been notified and is working to fix it.
            </p>

            {error.digest && (
              <div className="text-[10px] font-mono text-muted-foreground/50 bg-muted/50 p-2 rounded-lg break-all">
                Error ID: {error.digest}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 justify-center items-center">
          <Button
            variant="default"
            className="w-full sm:w-auto rounded-full px-10 py-6 h-auto text-lg bg-(--dn-dark) hover:bg-(--dn-dark)/90 transition-all shadow-xl"
            onClick={() => reset()}
          >
            <RefreshCw className="mr-2 w-5 h-5" />
            Try Again
          </Button>

          <Button
            asChild
            variant="ghost"
            className="w-full sm:w-auto rounded-full px-10 py-6 h-auto text-lg text-(--dn-rose) hover:bg-(--dn-rose)/5"
          >
            <Link href="/">
              <Home className="mr-2 w-5 h-5" />
              Return Home
            </Link>
          </Button>
        </div>

        <p className="mt-12 text-sm text-muted-foreground font-medium">
          Still having trouble?{' '}
          <a href="mailto:support@dnvites.com" className="text-(--dn-rose) hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  )
}
