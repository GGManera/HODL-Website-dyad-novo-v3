"use client"

import { useState, useEffect, useRef } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)
  const [mounted, setMounted] = useState(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    setMounted(true)
    mountedRef.current = true

    const media = window.matchMedia(query)

    // Set initial value
    setMatches(media.matches)

    // Set up event listener
    const listener = () => {
      if (mountedRef.current) {
        setMatches(media.matches)
      }
    }

    // Use the appropriate method based on browser support
    if (media.addEventListener) {
      media.addEventListener("change", listener)
    } else {
      // Fallback for older browsers
      media.addListener(listener)
    }

    return () => {
      mountedRef.current = false

      // Clean up listener using the appropriate method
      if (media.removeEventListener) {
        media.removeEventListener("change", listener)
      } else {
        // Fallback for older browsers
        media.removeListener(listener)
      }
    }
  }, [query])

  // Return false during SSR, actual value after mount
  return mounted ? matches : false
}
