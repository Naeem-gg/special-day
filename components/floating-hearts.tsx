"use client"

import { useEffect, useState } from "react"
import { HeartIcon } from "lucide-react"

interface Heart {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  speed: number
  color: string
}

export function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([])

  useEffect(() => {
    // Create initial hearts
    const initialHearts: Heart[] = Array.from({ length: 15 }, (_, i) => createHeart(i))
    setHearts(initialHearts)

    // Animation frame for moving hearts
    let animationId: number
    let lastTime = 0

    const animate = (time: number) => {
      if (time - lastTime > 50) {
        // Update every 50ms for performance
        lastTime = time
        setHearts((prevHearts) =>
          prevHearts.map((heart) => {
            // Move heart upward
            const y = heart.y - heart.speed

            // If heart is out of view, reset it at the bottom
            if (y < -100) {
              return {
                ...createHeart(heart.id),
                y: window.innerHeight + Math.random() * 100,
              }
            }

            return {
              ...heart,
              y,
              // Add slight horizontal movement
              x: heart.x + Math.sin(time * 0.001 + heart.id) * 0.5,
            }
          }),
        )
      }

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  // Create a new heart with random properties
  const createHeart = (id: number): Heart => {
    const colors = ["#ff6b6b", "#ff8e8e", "#ffb8b8", "#ff4757", "#ff6b81"]

    return {
      id,
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + Math.random() * 100,
      size: 10 + Math.random() * 20,
      opacity: 0.1 + Math.random() * 0.5,
      speed: 0.5 + Math.random() * 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute"
          style={{
            left: `${heart.x}px`,
            top: `${heart.y}px`,
            opacity: heart.opacity,
            transform: `rotate(${Math.sin(heart.id) * 20}deg)`,
            transition: "transform 2s ease-in-out",
            color: heart.color,
            width: `${heart.size}px`,
            height: `${heart.size}px`,
          }}
        >
          <HeartIcon className="w-full h-full" />
        </div>
      ))}
    </div>
  )
}
