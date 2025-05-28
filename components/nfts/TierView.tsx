"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import NFTCard from "./NFTCard"
import NFTModal from "./NFTModal" // Keep import for type definition, but modal is rendered by parent
import GemIndicator from "./GemIndicator"
import { motion, AnimatePresence } from "framer-motion"
import { useNFTs } from "@/contexts/nft-context"

interface SortingState {
  gemOrder: "highest_first" | "highest_last"
  dateOrder: "newest_first" | "oldest_first"
}

interface TierViewProps {
  sortingState: SortingState
  isPageMount: boolean
  isRefresh?: boolean
  onNFTClick: (nft: any) => void // Add onNFTClick prop
}

export default function TierView({ sortingState, isPageMount, isRefresh = false, onNFTClick }: TierViewProps) {
  const [isMounted, setIsMounted] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { nfts: allNfts, isLoading, loadingProgress, hasInitialLoad } = useNFTs()
  const [groupedNfts, setGroupedNfts] = useState<{ [tier: string]: any[] }>({})
  // Removed selectedNFT state as it's now managed by parent
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [forceRerender, setForceRerender] = useState(0)
  const timeoutsRef = useRef<NodeJS.Timeout[]>([])

  // Set mounted state
  useEffect(() => {
    setIsMounted(true)
    return () => {
      setIsMounted(false)
      timeoutsRef.current.forEach(clearTimeout)
    }
  }, [])

  // Force rerender on refresh
  useEffect(() => {
    if (!isMounted) return

    if (isRefresh || isPageMount) {
      const timer = setTimeout(() => {
        setForceRerender((prev) => prev + 1)
      }, 50)

      timeoutsRef.current.push(timer)
      return () => clearTimeout(timer)
    }
  }, [isRefresh, isPageMount, isMounted])

  // Group and sort NFTs
  useEffect(() => {
    if (!isMounted || !allNfts || !Array.isArray(allNfts)) return

    try {
      // Group NFTs by tier
      const grouped = allNfts.reduce(
        (acc, nft) => {
          if (!nft || !nft.tier) return acc
          if (!acc[nft.tier]) {
            acc[nft.tier] = []
          }
          acc[nft.tier].push(nft)
          return acc
        },
        {} as { [tier: string]: any[] },
      )

      // Sort NFTs within each tier
      Object.keys(grouped).forEach((tier) => {
        grouped[tier].sort((a, b) => {
          const getDate = (nft) => {
            if (!nft || !nft.name) return new Date(0)
            const parts = nft.name.split("-")
            if (parts.length < 3) return new Date(0)
            const month = parts[1].trim()
            const year = parts[2].trim()
            const monthIndex = new Date(`${month} 1, 2000`).getMonth()
            return new Date(Number.parseInt(year), monthIndex)
          }

          const dateA = getDate(a)
          const dateB = getDate(b)

          return sortingState.dateOrder === "newest_first"
            ? dateB.getTime() - dateA.getTime()
            : dateA.getTime() - dateB.getTime()
        })
      })

      setGroupedNfts(grouped)
    } catch (e) {
      console.error("Error grouping NFTs:", e)
    }
  }, [allNfts, sortingState, isMounted])

  // Handle scroll events with better throttling
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const scrollPosition = container.scrollLeft
    const width = container.offsetWidth
    const newIndex = Math.floor((scrollPosition + width / 2) / width)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const container = scrollContainerRef.current
    if (!container) return

    let ticking = false
    let lastScrollLeft = 0

    const scrollListener = () => {
      const currentScroll = container.scrollLeft

      // Only process if scroll position actually changed
      if (currentScroll !== lastScrollLeft && !ticking && isMounted) {
        lastScrollLeft = currentScroll

        window.requestAnimationFrame(() => {
          if (isMounted) {
            handleScroll()
          }
          ticking = false
        })
        ticking = true
      }
    }

    container.addEventListener("scroll", scrollListener)
    return () => {
      if (container) {
        container.removeEventListener("scroll", scrollListener)
      }
    }
  }, [handleScroll, isMounted])

  // Determine if we should show the loading screen
  const shouldShowLoading = isLoading && !isRefresh

  // Add a safety timeout to prevent loading from getting stuck
  useEffect(() => {
    if (!isMounted) return

    if (shouldShowLoading) {
      const safetyTimeout = setTimeout(() => {
        console.log("TierView safety timeout triggered")
        setForceRerender((prev) => prev + 1)
      }, 10000)

      timeoutsRef.current.push(safetyTimeout)
      return () => clearTimeout(safetyTimeout)
    }
  }, [shouldShowLoading, isMounted])

  // If not mounted yet, render a placeholder
  if (!isMounted) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 border-4 border-blue-400/30 rounded-full"></div>
        </div>
      </div>
    )
  }

  if (isMobile) {
    // Add proper type annotations for the getTierNumber function
    const getTierNumber = (tier: string) => {
      const match = tier.match(/\d+/)
      return match ? Number.parseInt(match[0], 10) : 0
    }

    const tiers = Object.keys(groupedNfts).sort((a, b) => {
      const numA = getTierNumber(a)
      const numB = getTierNumber(b)
      return sortingState.gemOrder === "highest_first" ? numA - numB : numB - numA
    })

    return (
      <motion.div
        className="min-h-screen bg-[#0a1525]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <AnimatePresence mode="wait">
          {shouldShowLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[50vh] space-y-4"
            >
              <div className="relative w-16 h-16 mb-8">
                <div className="absolute inset-0 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 border-4 border-blue-400/30 rounded-full"></div>
              </div>
              <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Loading NFTs...
              </h2>
            </motion.div>
          ) : (
            <>
              <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none"
                style={{ scrollSnapType: "x mandatory" }}
              >
                {tiers.map((tier) => {
                  const tierNumber = Number(tier.match(/\d+/)?.[0] || 0)
                  return (
                    <div
                      key={`${tier}-${sortingState.gemOrder}-${forceRerender}`}
                      className="flex-none w-full snap-center px-4"
                      style={{ scrollSnapAlign: "start" }}
                    >
                      <div className="max-w-sm mx-auto">
                        <motion.h2
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-raleway"
                        >
                          {tier} -{" "}
                          {tierNumber === 1
                            ? "Diamond"
                            : tierNumber === 2
                              ? "Sapphire"
                              : tierNumber === 3
                                ? "Ruby"
                                : "Emerald"}
                        </motion.h2>
                        <div className="space-y-4">
                          {(groupedNfts[tier] || []).map((nft, index) => (
                            <div key={nft.asset_id} className="aspect-square w-full">
                              <NFTCard
                                asset={nft}
                                onClick={() => onNFTClick(nft)} // Use the passed handler
                                view="tiers"
                                index={index}
                                forceAnimation={isRefresh || isPageMount}
                              />
                            </div>
                          ))}
                        </div>
                        <GemIndicator activeTier={tierNumber} sortOrder={sortingState.gemOrder} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </AnimatePresence>

        {/* Removed NFTModal rendering from here */}
      </motion.div>
    )
  }

  return (
    <div className="space-y-16">
      {shouldShowLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center min-h-[50vh] space-y-4"
        >
          <div className="relative w-16 h-16 mb-8">
            <div className="absolute inset-0 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 border-4 border-blue-400/30 rounded-full"></div>
          </div>
          <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Loading NFTs...
          </h2>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          {(sortingState.gemOrder === "highest_first" ? [1, 2, 3, 4] : [4, 3, 2, 1]).map((tier) => (
            <section key={tier} className="relative">
              <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-raleway">
                Tier {tier} - {tier === 1 ? "Diamond" : tier === 2 ? "Sapphire" : tier === 3 ? "Ruby" : "Emerald"}
              </h2>
              <div className="relative">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-blue-500/60 scrollbar-track-gray-900/40 hover:scrollbar-thumb-blue-500/80 pb-4">
                  <div className="flex gap-6 pb-2 pl-6 pr-6">
                    {groupedNfts[`Tier ${tier}`]?.map((nft, index) => (
                      <div key={nft.asset_id} className="w-72 min-w-[288px] flex-shrink-0">
                        <NFTCard
                          asset={nft}
                          onClick={() => onNFTClick(nft)} // Use the passed handler
                          view="tiers"
                          index={index}
                          forceAnimation={isRefresh || isPageMount}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </AnimatePresence>
      )}

      {/* Removed NFTModal rendering from here */}
    </div>
  )
}