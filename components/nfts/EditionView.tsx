"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import NFTCard from "./NFTCard"
import { motion, AnimatePresence } from "framer-motion"
import { useNFTs } from "@/contexts/nft-context"
import NFTModal from "./NFTModal" // Keep import for type definition, but modal is rendered by parent

interface GroupedNFTs {
  [edition: string]: any[]
}

interface SortingState {
  gemOrder: "highest_first" | "highest_last"
  dateOrder: "newest_first" | "oldest_first"
}

interface EditionViewProps {
  sortingState: SortingState
  isPageMount: boolean
  isRefresh?: boolean
  onNFTClick: (nft: any) => void // Add onNFTClick prop
}

export default function EditionView({ sortingState, isPageMount, isRefresh = false, onNFTClick }: EditionViewProps) {
  const [isMounted, setIsMounted] = useState(false)
  const { nfts: allNfts, isLoading } = useNFTs()
  const [groupedNfts, setGroupedNfts] = useState<GroupedNFTs>({})
  // Removed selectedNFT state as it's now managed by parent
  const isMobile = useMediaQuery("(max-width: 768px)")
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

  // Group NFTs by edition
  useEffect(() => {
    if (!isMounted || !allNfts || !Array.isArray(allNfts)) return

    try {
      const grouped = allNfts.reduce(
        (acc, nft) => {
          if (!nft) return acc

          const parts = nft.name?.split("-") || []
          if (parts.length < 3) return acc

          const month = parts[1]?.trim() || ""
          const year = parts[2]?.trim() || ""
          const edition = `${month} ${year}`

          if (!acc[edition]) {
            acc[edition] = []
          }
          acc[edition].push(nft)
          return acc
        },
        {} as { [key: string]: any[] },
      )

      setGroupedNfts(grouped)
    } catch (e) {
      console.error("Error grouping NFTs:", e)
    }
  }, [allNfts, isMounted])

  // Sort grouped NFTs
  const sortedGroupedNfts = useMemo(() => {
    if (!isMounted) return {}

    try {
      const sorted = { ...groupedNfts }

      // Sort NFTs within each edition
      Object.keys(sorted).forEach((edition) => {
        sorted[edition] = [...sorted[edition]].sort((a, b) => {
          const getTierNumber = (tier: string | undefined) => {
            if (!tier) return 0
            const match = tier.match(/\d+/)
            return match ? Number.parseInt(match[0], 10) : 0
          }
          const tierTraitA = a.collectible?.traits?.find((t: any) => t.display_name === "Tier")
          const tierTraitB = b.collectible?.traits?.find((t: any) => t.display_name === "Tier")
          const gemA = getTierNumber(tierTraitA?.display_value)
          const gemB = getTierNumber(tierTraitB?.display_value)

          if (gemA !== gemB) {
            return sortingState.gemOrder === "highest_first" ? gemA - gemB : gemB - gemA
          }

          return 0
        })
      })

      // Sort editions chronologically
      return Object.entries(sorted)
        .sort(([editionA], [editionB]) => {
          const parseDate = (dateStr: string) => {
            const [month, year] = dateStr.split(" ")
            const monthIndex = new Date(`${month} 1, 2000`).getMonth()
            return new Date(Number.parseInt(year), monthIndex)
          }

          const dateA = parseDate(editionA)
          const dateB = parseDate(editionB)

          return sortingState.dateOrder === "newest_first"
            ? dateB.getTime() - dateA.getTime()
            : dateA.getTime() - dateB.getTime()
        })
        .reduce(
          (acc, [edition, nfts]) => {
            acc[edition] = nfts
            return acc
          },
          {} as { [key: string]: any[] },
        )
    } catch (e) {
      console.error("Error sorting NFTs:", e)
      return groupedNfts
    }
  }, [groupedNfts, sortingState, isMounted])

  // Sort editions
  const sortedEditions = useMemo(() => {
    if (!isMounted) return []

    try {
      return Object.keys(sortedGroupedNfts).sort((a, b) => {
        const parseDate = (dateStr: string) => {
          const [month, year] = dateStr.split(" ")
          const monthIndex = new Date(`${month} 1, 2000`).getMonth()
          return new Date(Number.parseInt(year), monthIndex)
        }

        const dateA = parseDate(a)
        const dateB = parseDate(b)

        return sortingState.dateOrder === "newest_first"
          ? dateB.getTime() - dateA.getTime()
          : dateA.getTime() - dateB.getTime()
      })
    } catch (e) {
      console.error("Error sorting editions:", e)
      return Object.keys(sortedGroupedNfts)
    }
  }, [sortedGroupedNfts, sortingState.dateOrder, isMounted])

  // Sort NFTs by gem value
  const sortNFTsByGemValue = (nftsArray: any[]) => {
    if (!nftsArray || !Array.isArray(nftsArray)) return []

    try {
      return [...nftsArray].sort((a, b) => {
        const getGemValue = (nft: any) => {
          const gemTrait = nft.collectible?.traits?.find((t: any) => t.display_name === "Gem")
          return Number.parseInt(gemTrait?.display_value || "0")
        }
        const gemA = getGemValue(a)
        const gemB = getGemValue(b)
        return sortingState.gemOrder === "highest_first" ? gemB - gemA : gemA - gemB
      })
    } catch (e) {
      console.error("Error sorting NFTs by gem value:", e)
      return nftsArray
    }
  }

  // Show loading when data is loading, but always render the page structure
  const shouldShowLoading = isLoading && !isRefresh

  // Add a safety timeout to prevent loading from getting stuck
  useEffect(() => {
    if (!isMounted) return

    if (shouldShowLoading) {
      const safetyTimeout = setTimeout(() => {
        console.log("EditionView safety timeout triggered")
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

  return (
    <div key={`content-${forceRerender}`} className={isMobile ? "space-y-12" : "space-y-8"}>
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
        <AnimatePresence>
          {sortedEditions.map((edition, sectionIndex) => (
            <section
              key={`edition-${edition}`}
              className={
                isMobile
                  ? "space-y-6 mb-12"
                  : "bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-blue-500/10"
              }
            >
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-${isMobile ? "xl" : "2xl"} font-bold ${
                  isMobile ? "text-center" : "mb-8 text-center"
                } bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-raleway`}
              >
                {edition}
              </motion.h2>
              <div className={isMobile ? "grid grid-cols-2 gap-4" : "grid grid-cols-4 gap-6"}>
                {sortNFTsByGemValue(sortedGroupedNfts[edition]).map((nft, index) => (
                  <NFTCard
                    key={nft.asset_id}
                    asset={nft}
                    onClick={() => onNFTClick(nft)} // Use the passed handler
                    view="editions"
                    index={index}
                    forceAnimation={isRefresh || isPageMount}
                  />
                ))}
              </div>
            </section>
          ))}
        </AnimatePresence>
      )}
      {/* Removed NFTModal rendering from here */}
    </div>
  )
}