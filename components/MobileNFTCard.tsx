"use client"

import { useState } from "react"
import Image from "next/image"
import { getOptimizedImageUrl } from "@/lib/utils"
import { useSwipeable } from "react-swipeable"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface MobileNFTCardProps {
  asset: any
  tier: string
  gemValue: string
  onAssetClick: (asset: any) => void
  onChangeTier: (direction: "next" | "prev") => void
  onChangeAsset: (direction: "next" | "prev") => void
  hasNextAsset: boolean
  hasPrevAsset: boolean
  hasNextTier: boolean
  hasPrevTier: boolean
  direction: number
}

export default function MobileNFTCard({
  asset,
  tier,
  gemValue,
  onAssetClick,
  onChangeTier,
  onChangeAsset,
  hasNextAsset,
  hasPrevAsset,
  hasNextTier,
  hasPrevTier,
  direction,
}: MobileNFTCardProps) {
  const [swipeDirection, setSwipeDirection] = useState<"horizontal" | "vertical" | null>(null)

  const handlers = useSwipeable({
    onSwiping: (event) => {
      if (!swipeDirection) {
        const angle = Math.abs(Math.atan2(event.deltaY, event.deltaX) * (180 / Math.PI))
        if (angle < 45 || angle > 135) {
          setSwipeDirection("horizontal")
        } else {
          setSwipeDirection("vertical")
        }
      }
    },
    onSwipedLeft: () => {
      if (swipeDirection === "horizontal" && hasNextAsset) {
        onChangeAsset("next")
      }
    },
    onSwipedRight: () => {
      if (swipeDirection === "horizontal" && hasPrevAsset) {
        onChangeAsset("prev")
      }
    },
    onSwipedUp: () => {
      if (swipeDirection === "vertical" && hasPrevTier) {
        onChangeTier("prev")
      }
    },
    onSwipedDown: () => {
      if (swipeDirection === "vertical" && hasNextTier) {
        onChangeTier("next")
      }
    },
    onTouchEndOrOnMouseUp: () => {
      setSwipeDirection(null)
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
    delta: 10,
  })

  return (
    <motion.div
      className="min-h-screen touch-none select-none"
      {...handlers}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="px-4 py-8">
        <motion.div
          className="rounded-2xl overflow-hidden"
          initial={false}
          animate={{ x: 0, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <h2 className="text-2xl text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent pt-8 pb-2">
            {`${tier} - ${gemValue} Hero`}
          </h2>
          <h3 className="text-white text-center pb-8">{asset.name}</h3>

          <div className="relative aspect-square w-full">
            <Image
              src={getOptimizedImageUrl(asset) || "/placeholder.svg"}
              alt={asset.name}
              fill
              className="object-contain"
              sizes="100vw"
              priority
              onClick={() => onAssetClick(asset)}
            />

            {/* Navigation Indicators */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 pointer-events-none">
              {hasPrevAsset && (
                <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <ChevronLeft className="w-6 h-6 text-white" />
                </div>
              )}
              {hasNextAsset && (
                <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <ChevronRight className="w-6 h-6 text-white" />
                </div>
              )}
            </div>

            {/* Swipe Direction Indicators */}
            <div className="absolute inset-0 pointer-events-none">
              {swipeDirection === "horizontal" && (
                <motion.div
                  className="absolute inset-y-0 left-0 w-1 bg-blue-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                />
              )}
              {swipeDirection === "vertical" && (
                <motion.div
                  className="absolute inset-x-0 top-0 h-1 bg-blue-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
