'use client'

export default function WatermarkOverlay() {
  return (
    <div
      className="fixed inset-0 z-[9998] pointer-events-none select-none"
      onContextMenu={(e) => e.preventDefault()}
      aria-hidden
    >
      {/* Diagonal watermark text */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${i * 14}%`,
            left: '-10%',
            width: '120%',
            transform: 'rotate(-25deg)',
            whiteSpace: 'nowrap',
            color: 'rgba(180, 120, 140, 0.06)',
            fontSize: '0.95rem',
            fontFamily: 'sans-serif',
            fontWeight: '700',
            letterSpacing: '0.6em',
            textTransform: 'uppercase',
            userSelect: 'none',
          }}
        >
          DNvites Preview — Not for Sharing &nbsp;&nbsp;·&nbsp;&nbsp; DNvites Preview — Not for
          Sharing &nbsp;&nbsp;·&nbsp;&nbsp; DNvites Preview — Not for Sharing
        </div>
      ))}
    </div>
  )
}
