export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Soft glowing background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-(--dn-rose) opacity-[0.05] rounded-full blur-[100px] animate-glow-pulse" />
      </div>

      <div className="z-10 flex flex-col items-center animate-slide-up">
        <div className="relative mb-8">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full border-2 border-(--dn-rose) opacity-20 animate-spin-slow" style={{ margin: '-10px' }} />

          <div className="w-24 h-24 bg-white rounded-full shadow-2xl flex items-center justify-center relative z-10 border border-(--dn-rose)/10">
            <div className="text-(--dn-rose) animate-heartbeat">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-serif font-semibold text-(--dn-dark) tracking-wide">Preparing the Magic</h2>
          <div className="flex gap-1.5 justify-center">
            <div className="w-2 h-2 rounded-full bg-(--dn-rose) animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-(--dn-gold) animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-(--dn-rose) animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="text-sm text-muted-foreground font-serif italic pt-4">
            Just a moment while we set the stage...
          </p>
        </div>
      </div>
    </div>
  )
}
