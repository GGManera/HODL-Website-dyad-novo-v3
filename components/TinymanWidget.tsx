"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"

interface TinymanWidgetProps {
  className?: string
  style?: React.CSSProperties
}

export default function TinymanWidget({ className, style }: TinymanWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Handle mounting/unmounting
  useEffect(() => {
    setIsMounted(true)

    return () => {
      setIsMounted(false)
    }
  }, [])

  // Create iframe only after component is mounted
  useEffect(() => {
    if (!isMounted || !containerRef.current) return

    // Safely remove any existing iframe
    if (iframeRef.current && iframeRef.current.parentNode === containerRef.current) {
      try {
        containerRef.current.removeChild(iframeRef.current)
      } catch (e) {
        console.error("Error removing iframe:", e)
      }
    }

    // Create a new iframe
    const iframe = document.createElement("iframe")
    iframeRef.current = iframe

    iframe.title = "tinyman swap widget"
    iframe.src =
      "https://tinymanorg.github.io/swap-widget/?platformName=Highly+Optimized+DeFi+Launchpad&network=mainnet&themeVariables=eyJ0aGVtZSI6ImRhcmsiLCJjb250YWluZXJCdXR0b25CZyI6IiMyOGU4ZmEiLCJ3aWRnZXRCZyI6IiMwQTE1MjUiLCJoZWFkZXJCdXR0b25CZyI6IiMxRjI5MzciLCJoZWFkZXJCdXR0b25UZXh0IjoiI2ZmZmZmZiIsImhlYWRlclRpdGxlIjoiI2ZmZmZmZiIsImNvbnRhaW5lckJ1dHRvblRleHQiOiIjIiwiaWZyYW1lQmciOiIjMWIyNDMwIiwiYm9yZGVyUmFkaXVzU2l6ZSI6Im1lZGl1bSIsInRpdGxlIjoiSGlnaGx5IE9wdGltaXplZCBEZUZpIExhdW5jaHBhZCIsInNob3VsZERpc3BsYXlUaW55YW1OZ29vIjp0cnVlfQ&assetIn=0&assetOut=2637649940"
    iframe.className = "rounded-lg h-[520px]"
    iframe.style.border = "none"
    iframe.style.minWidth = "380px"
    iframe.style.width = "100%"

    // Add strict sandbox attributes
    iframe.setAttribute("sandbox", "allow-same-origin allow-scripts allow-popups allow-forms")
    iframe.setAttribute("loading", "lazy")

    // Add event listeners
    const handleLoad = () => {
      if (isMounted) {
        setIsLoaded(true)
      }
    }

    iframe.addEventListener("load", handleLoad)

    // Safely append to container
    try {
      if (containerRef.current) {
        containerRef.current.appendChild(iframe)
      }
    } catch (e) {
      console.error("Error appending iframe:", e)
    }

    // Cleanup function
    return () => {
      iframe.removeEventListener("load", handleLoad)

      // Safely remove iframe if component unmounts
      if (iframeRef.current && containerRef.current) {
        try {
          // Check if iframe is still a child of the container
          if (containerRef.current.contains(iframeRef.current)) {
            containerRef.current.removeChild(iframeRef.current)
          }
        } catch (e) {
          console.error("Error during cleanup:", e)
        }
      }

      iframeRef.current = null
    }
  }, [isMounted])

  return (
    <div ref={containerRef} className={className} style={style} aria-label="Tinyman Swap Widget" role="region">
      {!isLoaded && (
        <div className="flex items-center justify-center h-[520px] bg-[#1B2430] rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-opacity-50"></div>
        </div>
      )}
    </div>
  )
}
