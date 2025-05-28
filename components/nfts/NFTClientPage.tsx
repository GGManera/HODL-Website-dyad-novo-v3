"use client"

import { useState, useEffect, useRef } from "react"
import TierView from "@/components/nfts/TierView"
import EditionView from "@/components/nfts/EditionView"
import { motion, AnimatePresence } from "framer-motion"
import { useNFTs } from "@/contexts/nft-context" // Import the hook, not the provider
import MobileBottomNav from "@/components/MobileBottomNav"
import { useMediaQuery } from "@/hooks/use-media-query"
import FullScreenButton from "@/components/nfts/FullScreenButton"
import NFTCarousel from "@/components/nfts/NFTCarousel"
import { useUIOverlay } from "@/contexts/ui-overlay-context" // Import the UI overlay hook

type GroupingMode = "tiers" | "editions"
type SortingOrder = "highest_first" | "highest_last" | "newest_first" | "oldest_first"

interface SortingState {
  gemOrder: "highest_first" | "highest_last"
  dateOrder: "newest_first" | "oldest_first"
}

interface NFTClientPageProps {
  instanceId: string
}

export default function NFTClientPage({ instanceId }: NFTClientPageProps) {
  // Add this defensive check at the beginning of the component to avoid rendering issues
  const [hydrated, setHydrated] = useState(false)

  // Create a ref to track if this is a fresh mount or a refresh
  const isRefreshRef = useRef(false)

  // Set up state
  const [groupingMode, setGroupingMode] = useState<GroupingMode>("editions")
  const [sortingState, setSortingState] = useState<SortingState>({
    // Mudado de "highest_first" para "highest_last" como padrão
    gemOrder: "highest_last",
    dateOrder: "newest_first",
  })
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobileState, setIsMobileState] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Add state for carousel and modal
  const [isCarouselOpen, setIsCarouselOpen] = useState(false)
  const [selectedNFT, setSelectedNFT] = useState(null)

  // Check if we're on mobile
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Use the NFT context hook and UI overlay context hook
  const { nfts: allNfts, isLoading, loadingProgress } = useNFTs()
  const { setOverlayActive } = useUIOverlay()

  // Add this useEffect after your existing state declarations
  useEffect(() => {
    // This ensures we're fully hydrated before rendering complex components
    setHydrated(true)

    // Update mobile state
    setIsMobileState(isMobile)

    // Track mounted state for safe cleanup
    const mountedRef = { current: true }

    // Force reset any stale state
    if (typeof window !== "undefined") {
      try {
        // Clear internal navigation flags to prevent stale state
        sessionStorage.removeItem("nft-internal-navigation")

        // Mark if this is a refresh for child components
        const isRefresh =
          window.performance.navigation?.type === 1 ||
          (window.performance as any).getEntriesByType?.("navigation")?.[0]?.type === "reload"

        if (isRefresh) {
          sessionStorage.setItem("is-refresh", "true")
          isRefreshRef.current = true
        } else {
          sessionStorage.removeItem("is-refresh")
        }
      } catch (e) {
        console.error("Error accessing sessionStorage:", e)
      }
    }

    return () => {
      // Mark as unmounted
      mountedRef.current = false

      // Force cleanup of any lingering animations or effects
      if (typeof window !== "undefined") {
        // Clear all timeouts that might be causing the issue
        const highestId = setTimeout(() => {}, 0)
        for (let i = 0; i < highestId; i++) {
          clearTimeout(i)
        }

        // Remove any lingering scroll listeners
        const originalAddEventListener = window.addEventListener
        const originalRemoveEventListener = window.removeEventListener

        // Restore original methods if they were modified
        if (window.addEventListener !== originalAddEventListener) {
          window.addEventListener = originalAddEventListener
        }
        if (window.removeEventListener !== originalRemoveEventListener) {
          window.removeEventListener = originalRemoveEventListener
        }

        // Clear all timeouts and intervals
        const highestIdCleanup = setTimeout(() => {}, 0)
        for (let i = 0; i < highestIdCleanup; i++) {
          clearTimeout(i)
          clearInterval(i)
        }

        // Clear any lingering local storage keys that could affect navigation
        try {
          sessionStorage.removeItem("nft-internal-navigation")
          sessionStorage.removeItem("is-refresh")
        } catch (e) {
          console.error("Error cleaning up session storage:", e)
        }
      }
    }
  }, [isMobile])

  // Update mobile state when the media query changes
  useEffect(() => {
    setIsMobileState(isMobile)
  }, [isMobile])

  // Avoid hydration issues by ensuring we're only rendering on the client
  useEffect(() => {
    // Force a repaint to ensure client-side rendering takes precedence
    const repaint = document.body.offsetHeight
  }, [])

  // Check if this is a refresh
  useEffect(() => {
    // Track mounted state for safe cleanup
    const mountedRef = { current: true }

    // Throttle scroll events to reduce console messages
    let ticking = false
    let lastScrollY = 0
    const handleScroll = () => {
      const currentScroll = window.scrollY

      // Only process if scroll position actually changed
      if (currentScroll !== lastScrollY && !ticking && mountedRef.current) {
        lastScrollY = currentScroll

        window.requestAnimationFrame(() => {
          if (!mountedRef.current) return

          const threshold = 100
          const progress = Math.min(currentScroll / threshold, 1)
          setScrollProgress(progress)
          ticking = false
        })
        ticking = true
      }
    }

    // Use passive listener for better performance
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Mark as initialized
    setIsInitialized(true)

    // Clean up
    return () => {
      mountedRef.current = false
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Function to get all NFTs sorted according to current settings
  const getAllSortedNFTs = () => {
    if (!allNfts || allNfts.length === 0) return []

    return [...allNfts].sort((a, b) => {
      // Functions to extract values for sorting
      const getGemValue = (nft: any) => {
        const gemTrait = nft.collectible?.traits?.find((t: any) => t.display_name === "Gem")
        return Number.parseInt(gemTrait?.display_value || "0")
      }

      const getDate = (nft: any) => {
        if (!nft || !nft.name) return new Date(0)
        const parts = nft.name.split("-")
        if (parts.length < 3) return new Date(0)
        const month = parts[1].trim()
        const year = parts[2].trim()
        const monthIndex = new Date(`${month} 1, 2000`).getMonth()
        return new Date(Number.parseInt(year), monthIndex)
      }

      // Apply gem sorting first
      const gemA = getGemValue(a)
      const gemB = getGemValue(b)

      if (gemA !== gemB) {
        return sortingState.gemOrder === "highest_first" ? gemB - gemA : gemA - gemB
      }

      // Then sort by date
      const dateA = getDate(a)
      const dateB = getDate(b)

      return sortingState.dateOrder === "newest_first"
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime()
    })
  }

  // Add proper type annotations for the handleViewModeChange function
  const handleViewModeChange = (mode: GroupingMode) => {
    if (mode === groupingMode) return
    setGroupingMode(mode)
  }

  // Add proper type annotations for the handleSortingChange function
  const handleSortingChange = (newOrder: SortingOrder) => {
    if (newOrder === "highest_first" || newOrder === "highest_last") {
      setSortingState((prev) => ({ ...prev, gemOrder: newOrder }))
    } else {
      setSortingState((prev) => ({ ...prev, dateOrder: newOrder as "newest_first" | "oldest_first" }))
    }
  }

  // Scroll to top handler
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Handle opening/closing the carousel
  const openCarousel = () => {
    setIsCarouselOpen(true)
  }

  const closeCarousel = () => {
    setIsCarouselOpen(false)
  }

  // Handle opening/closing the NFT modal
  const handleNFTSelect = (nft: any) => {
    setSelectedNFT(nft)
  }

  const handleNFTClose = () => {
    setSelectedNFT(null)
  }

  // Effect to update UI overlay context based on modal/carousel state
  useEffect(() => {
    setOverlayActive(isCarouselOpen || !!selectedNFT)
  }, [isCarouselOpen, selectedNFT, setOverlayActive])

  // If not hydrated yet, show a loading state
  if (!hydrated || !isInitialized) {
    return (
      <div className="min-h-screen bg-[#0a1525] text-white pt-16 flex flex-col items-center justify-center">
        <div className="container mx-auto px-4 py-24 flex flex-col items-center">
          <div className="relative w-16 h-16 mb-8">
            <div className="absolute inset-0 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 border-4 border-blue-400/30 rounded-full"></div>
          </div>
          <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            {isInitialized ? "Finalizing..." : "Initializing..."}
          </h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a1525] text-white pt-16 flex flex-col">
      {/* Headers */}
      <div className="fixed top-16 left-0 right-0 z-50">
        <div className="h-16 bg-[#0a1525]/60 backdrop-blur-sm flex items-center justify-center border-b border-blue-500/20">
          <div className="inline-flex rounded-lg border border-blue-500/20 p-1">
            <motion.button
              onClick={() => handleViewModeChange("editions")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                groupingMode === "editions" ? "bg-blue-500/20 text-blue-400" : "text-gray-400"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              Editions
            </motion.button>
            <motion.button
              onClick={() => handleViewModeChange("tiers")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                groupingMode === "tiers" ? "bg-blue-500/20 text-blue-400" : "text-gray-400"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              Tiers
            </motion.button>
            <FullScreenButton onClick={openCarousel} isActive={isCarouselOpen} />
          </div>
        </div>

        <motion.div
          className="bg-[#0a1525]/60 backdrop-blur-sm border-b border-blue-500/20 overflow-hidden"
          style={{
            height: `${(1 - scrollProgress) * 48}px`,
            opacity: 1 - scrollProgress,
          }}
        >
          <div className="h-12 flex items-center justify-center">
            {groupingMode === "tiers" ? (
              <div className="inline-flex items-center gap-2">
                <motion.button
                  onClick={() => handleSortingChange("highest_last")}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    sortingState.gemOrder === "highest_last" ? "text-blue-400" : "text-gray-400"
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  Highest Last
                </motion.button>
                <motion.button
                  onClick={() => handleSortingChange("highest_first")}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    sortingState.gemOrder === "highest_first" ? "text-blue-400" : "text-gray-400"
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  Highest First
                </motion.button>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2">
                <motion.button
                  onClick={() => handleSortingChange("newest_first")}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    sortingState.dateOrder === "newest_first" ? "text-blue-400" : "text-gray-400"
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  Newest First
                </motion.button>
                <motion.button
                  onClick={() => handleSortingChange("oldest_first")}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    sortingState.dateOrder === "oldest_first" ? "text-blue-400" : "text-gray-400"
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  Oldest First
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Main Content with View Transitions */}
      <main className="container mx-auto px-4 pt-36 pb-24 flex-grow">
        <AnimatePresence mode="wait">
          {groupingMode === "tiers" ? (
            <motion.div
              key={`tiers-view-${instanceId}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <TierView
                sortingState={sortingState}
                isPageMount={true}
                isRefresh={isRefreshRef.current}
                onNFTClick={handleNFTSelect} // Pass the handler
              />
            </motion.div>
          ) : (
            <motion.div
              key={`editions-view-${instanceId}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <EditionView
                sortingState={sortingState}
                isPageMount={true}
                isRefresh={isRefreshRef.current}
                onNFTClick={handleNFTSelect} // Pass the handler
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* NFT Carousel */}
      {hydrated && (
        <NFTCarousel isOpen={isCarouselOpen} onClose={closeCarousel} nfts={getAllSortedNFTs()} />
      )}

      {/* NFT Modal */}
      {selectedNFT && <NFTModal asset={selectedNFT} onClose={handleNFTClose} />}

      {/* Footer */}
      <footer className="py-12 pb-32 md:pb-12 border-t border-blue-500/10 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-400 font-raleway">
            <p>HODL - Heroes Of Diamond Legacy</p>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      {isMobileState && <MobileBottomNav variant="nfts" onScrollTop={handleScrollTop} />}
    </div>
  )
}