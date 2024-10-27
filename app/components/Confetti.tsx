'use client'

import { useEffect } from 'react'
import confetti from 'canvas-confetti'

export default function Confetti({ duration = 2000, intensity = 150 }: { duration?: number; intensity?: number }) {
  // const [hasPlayed, setHasPlayed] = useState(false)

  useEffect(() => {
    // const hasPlayedThisSession = sessionStorage.getItem('confettiPlayed')

    // if (!hasPlayedThisSession && !hasPlayed) {
      const end = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#bb0000', '#ffffff']
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#bb0000', '#ffffff']
        });
      
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
        // else {
        //   setHasPlayed(true)
        //   sessionStorage.setItem('confettiPlayed', 'true')
        // }
      }

      frame()
    // }

    return () => {
      confetti.reset()
    }
  }, [duration, intensity])

  return null
}