"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import dynamic from "next/dynamic"
import { useInView } from "react-intersection-observer"
import { useAssetHolders } from "@/lib/api"
import MobileNFTCard from "./MobileNFTCard"

const AssetModal = dynamic(() => import("@/components/AssetModal"), {
  loading: () => <p>Loading...</p>,
})

const ASSETS_PER_PAGE = 12

interface TierSectionProps {
  tier: string
  gemValue: string
  assets: any
  nfds: any
  onChangeTier: (direction: "prev" | "next") => void
  currentMonthIndex: number
  setCurrentMonthIndex: (index: number) => void
  hasNextTier: boolean
  hasPrevTier: boolean
}

export default function TierSection({
  tier,
  gemValue,
  assets,
  nfds,
  onChangeTier,
  currentMonthIndex,
  setCurrentMonthIndex,
  hasNextTier,
  hasPrevTier,
}: TierSectionProps) {
  const scrollRef = useRef(null)
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [direction, setDirection] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const { data: assetHolders, isLoading: isLoadingHolders } = useAssetHolders(selectedAsset?.asset_id.toString())
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollContainerRef = useRef(null)
  const [visibleAssets, setVisibleAssets] = useState(ASSETS_PER_PAGE)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const allAssets: any[] = Object.values(assets).flat()

  const handleSwipe = (direction: "next" | "prev") => {
    setDirection(direction === "next" ? 1 : -1)
    setCurrentMonthIndex((prevIndex) => {
      const newIndex =
        direction === "next"
          ? (prevIndex + 1) % allAssets.length
          : (prevIndex - 1 + allAssets.length) % allAssets.length
      return newIndex
    })
  }

  const handleAssetClick = useCallback((asset) => {
    setSelectedAsset(asset)
  }, [])

  const handleLoadMore = useCallback(() => {
    setVisibleAssets((prevVisible) => prevVisible + ASSETS_PER_PAGE)
  }, [])

  const flattenedAssets = useMemo(() => {
    return Object.entries(assets).flatMap(([month, monthAssets]) => monthAssets.map((asset) => ({ ...asset, month })))
  }, [assets])

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollPosition = container.scrollLeft
      const cardWidth = container.offsetWidth
      const newIndex = Math.round(scrollPosition / cardWidth)
      setCurrentIndex(newIndex)
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToCard = useCallback((index) => {
    const container = scrollContainerRef.current
    if (container) {
      container.scrollTo({
        left: index * container.offsetWidth,
        behavior: "smooth",
      })
    }
  }, [])

  const closeModal = () => {
    setSelectedAsset(null)
  }

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-[#0a1525]">
        <div className="absolute inset-4 rounded-3xl bg-gradient-to-b from-gray-900/90 to-gray-950/90 backdrop-blur-sm">
          {allAssets[currentMonthIndex] && (
            <MobileNFTCard
              key={allAssets[currentMonthIndex].asset_id}
              asset={allAssets[currentMonthIndex]}
              tier={tier}
              gemValue={gemValue}
              onAssetClick={() => {}}
              onChangeTier={onChangeTier}
              onChangeAsset={handleSwipe}
              hasNextAsset={currentMonthIndex < allAssets.length - 1}
              hasPrevAsset={currentMonthIndex > 0}
              hasNextTier={hasNextTier}
              hasPrevTier={hasPrevTier}
              direction={direction}
            />
          )}
        </div>
      </div>
    )
  }

  // Desktop view remains unchanged
  return null
}
