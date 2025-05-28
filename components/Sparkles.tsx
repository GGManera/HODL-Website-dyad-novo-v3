"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState, useCallback, useRef } from "react"

interface Sparkle {
  id: string
  size: number
  rotation: number
  maxOpacity: number
  style: {
    top: string
    left: string
  }
}

interface SparklesProps {
  instanceId?: string
}

export default function Sparkles({ instanceId }: SparklesProps) {
  const localInstanceId = useRef(`sparkles-${instanceId || Date.now()}-${Math.random().toString(36).substring(2, 9)}`)
  const [sparkles, setSparkles] = useState<Sparkle[]>([])
  const [scrollPercentage, setScrollPercentage] = useState(0)
  const mountedRef = useRef(true)
  const timeoutsRef = useRef<NodeJS.Timeout[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [isActive, setIsActive] = useState(true)

  const handleScroll = useCallback(() => {
    if (!mountedRef.current || !isActive) return

    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
    if (scrollHeight <= 0) return

    const currentScrollPosition = window.scrollY
    const newScrollPercentage = Math.min(100, Math.max(0, (currentScrollPosition / scrollHeight) * 100))
    setScrollPercentage(newScrollPercentage)
  }, [isActive])

  useEffect(() => {
    if (!isActive || !mountedRef.current) return

    let ticking = false
    let lastScrollY = 0

    const scrollListener = () => {
      const currentScroll = window.scrollY
      if (currentScroll !== lastScrollY && !ticking && mountedRef.current && isActive) {
        lastScrollY = currentScroll
        window.requestAnimationFrame(() => {
          if (mountedRef.current && isActive) {
            handleScroll()
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", scrollListener, { passive: true })

    return () => {
      window.removeEventListener("scroll", scrollListener)
    }
  }, [handleScroll, isActive])

  useEffect(() => {
    mountedRef.current = true
    const initTimeout = setTimeout(() => {
      if (mountedRef.current) {
        setIsActive(true)
      }
    }, 50)
    timeoutsRef.current.push(initTimeout)

    let ticking = false
    const scrollListener = () => {
      if (!ticking && mountedRef.current && isActive) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", scrollListener, { passive: true })

    return () => {
      mountedRef.current = false
      setIsActive(false)
      window.removeEventListener("scroll", scrollListener)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      timeoutsRef.current.forEach(clearTimeout)
      timeoutsRef.current = []
      setSparkles([])
      if (typeof window !== "undefined") {
        const highestId = setTimeout(() => {}, 0)
        for (let i = 0; i < highestId; i++) {
          clearTimeout(i)
          clearInterval(i)
        }
      }
    }
  }, [handleScroll])

  useEffect(() => {
    if (!mountedRef.current || !isActive) return

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    const baseInterval = 1200 // mais frequente
    const minInterval = 200
    const initialSparkleChance = 0.5 // chance inicial maior
    const maxSparkleChance = 0.95 // chance máxima maior

    const createSparkle = () => {
      if (!mountedRef.current || !isActive) return

      const sparkleId = `sparkle-${localInstanceId.current}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      const newSparkle = {
        id: sparkleId,
        size: Math.random() * 4 + 8, // 8-12px
        rotation: Math.random() * 360,
        maxOpacity: Math.random() * 0.7 + 0.4, // brilho mais suave, max 1.1
        style: {
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
        },
      }

      setSparkles((prev) => [...prev, newSparkle])

      const timeout = setTimeout(() => {
        if (mountedRef.current && isActive) {
          setSparkles((prev) => prev.filter((s) => s.id !== sparkleId))
        }
      }, 900) // duração um pouco maior
      timeoutsRef.current.push(timeout)
    }

    const adjustedInterval = Math.max(baseInterval - scrollPercentage * 20, minInterval)
    const adjustedChance = initialSparkleChance + (maxSparkleChance - initialSparkleChance) * (scrollPercentage / 100)

    intervalRef.current = setInterval(() => {
      if (!mountedRef.current || !isActive) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        return
      }

      if (Math.random() < adjustedChance) {
        createSparkle()
      }
    }, Math.random() * 1200 + 300)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [scrollPercentage, isActive])

  if (!isActive || !mountedRef.current) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <AnimatePresence mode="wait">
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1, 0.8, 0],
              opacity: [0, sparkle.maxOpacity, sparkle.maxOpacity * 0.6, 0],
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: 0.9,
              times: [0, 0.4, 0.7, 1],
              ease: [0.3, 0, 0.2, 1],
            }}
            style={{
              position: "absolute",
              width: sparkle.size,
              height: sparkle.size,
              ...sparkle.style,
              transform: `rotate(${sparkle.rotation}deg)`,
              boxShadow: "0 0 8px 3px rgba(255, 255, 255, 0.6)",
              transition: "box-shadow 0.3s ease",
              borderRadius: "50%",
            }}
            onAnimationComplete={() => {
              if (mountedRef.current && isActive) {
                setSparkles((prev) => prev.filter((s) => s.id !== sparkle.id))
              }
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: "white",
                clipPath:
                  "polygon(50% 0%, 45% 40%, 60% 40%, 60% 45%, 40% 45%, 40% 55%, 60% 55%, 60% 60%, 45% 60%, 50% 100%, 55% 60%, 40% 60%, 40% 55%, 60% 55%, 60% 45%, 40% 45%, 40% 40%, 55% 40%)",
                boxShadow: "0 0 22px 7px rgba(255, 255, 255, 0.85)",
                borderRadius: "50%",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(90deg, transparent 35%, white 50%, transparent 65%)",
                opacity: 0.8,
                borderRadius: "50%",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(0deg, transparent 35%, white 50%, transparent 65%)",
                opacity: 0.8,
                borderRadius: "50%",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(45deg, transparent 35%, white 50%, transparent 65%)",
                opacity: 0.6,
                borderRadius: "50%",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(-45deg, transparent 35%, white 50%, transparent 65%)",
                opacity: 0.6,
                borderRadius: "50%",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                boxShadow: "0 0 18px 6px rgba(255, 255, 255, 0.35)",
                filter: "blur(2.2px)",
                borderRadius: "50%",
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
