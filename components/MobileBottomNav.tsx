"use client"

import Link from "next/link"
import { ArrowUp, Sprout, Home, Gem } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

const NFTIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
    <path
      d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 8L14.5 12L12 16L9.5 12L12 8Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M8 3V2M16 3V2M12 3V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

interface MobileBottomNavProps {
  onScrollTop?: () => void
  showScrollTop?: boolean
  variant?: "home" | "onboarding" | "nfts"
}

export default function MobileBottomNav({ onScrollTop, showScrollTop = true, variant = "home" }: MobileBottomNavProps) {
  const pathname = usePathname()
  const mountedRef = useRef(true)

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
    }
  }, [])

  const handleScrollTop = () => {
    if (!mountedRef.current) return
    onScrollTop?.()
  }

  const renderNavItems = () => {
    switch (variant) {
      case "home":
        return (
          <>
            {showScrollTop && (
              <button
                onClick={handleScrollTop}
                className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-blue-400 transition-colors -mt-2"
              >
                <ArrowUp className="h-6 w-6" />
                <span className="text-xs mt-1">Top</span>
              </button>
            )}
            <Link
              href="/onboarding"
              className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-blue-400 transition-colors -mt-2"
              prefetch={true}
            >
              <Sprout className="h-6 w-6" />
              <span className="text-xs mt-1">Get Started</span>
            </Link>
            <Link
              href="/nfts"
              className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-blue-400 transition-colors -mt-2"
              prefetch={true}
            >
              <Gem className="h-6 w-6" />
              <span className="text-xs mt-1">NFTs</span>
            </Link>
          </>
        )
      case "onboarding":
        return (
          <>
            <Link
              href="/"
              className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-blue-400 transition-colors -mt-2"
            >
              <Home className="h-6 w-6" />
              <span className="text-xs mt-1">Home</span>
            </Link>
            {showScrollTop && (
              <button
                onClick={handleScrollTop}
                className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-blue-400 transition-colors -mt-2"
              >
                <ArrowUp className="h-6 w-6" />
                <span className="text-xs mt-1">Top</span>
              </button>
            )}
            <Link
              href="/nfts"
              className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-blue-400 transition-colors -mt-2"
              prefetch={true}
            >
              <Gem className="h-6 w-6" />
              <span className="text-xs mt-1">NFTs</span>
            </Link>
          </>
        )
      case "nfts":
        return (
          <>
            <Link
              href="/"
              className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-blue-400 transition-colors -mt-2"
            >
              <Home className="h-6 w-6" />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link
              href="/onboarding"
              className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-blue-400 transition-colors -mt-2"
              prefetch={true}
            >
              <Sprout className="h-6 w-6" />
              <span className="text-xs mt-1">Get Started</span>
            </Link>
            {showScrollTop && (
              <button
                onClick={handleScrollTop}
                className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-blue-400 transition-colors -mt-2"
              >
                <ArrowUp className="h-6 w-6" />
                <span className="text-xs mt-1">Top</span>
              </button>
            )}
          </>
        )
      default:
        return null
    }
  }

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[4.5rem] bg-[#0a1525]/95 backdrop-blur-sm border-t border-blue-500/20 grid grid-cols-3 items-center justify-items-center z-50 pb-safe">
        {renderNavItems()}
      </nav>
      {/* Add a thin rectangle for additional padding */}
      <div className="h-[1px] w-full absolute bottom-0 left-0 right-0 bg-transparent" />
    </>
  )
}
