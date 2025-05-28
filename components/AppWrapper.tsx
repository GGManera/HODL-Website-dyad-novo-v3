"use client"

import type React from "react"

import { ReactIsolator } from "@/lib/react-isolation"
import { useEffect, useState } from "react"

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  // Ensure the component only renders on the client
  useEffect(() => {
    setMounted(true)

    // Clean up all timeouts and intervals when unmounting
    return () => {
      if (typeof window !== "undefined") {
        const highestId = Number(setTimeout(() => {}, 0))
        for (let i = 0; i < highestId; i++) {
          clearTimeout(i)
          clearInterval(i)
        }
      }
    }
  }, [])

  if (!mounted) {
    return null
  }

  return <ReactIsolator>{children}</ReactIsolator>
}
