"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { getOptimizedImageUrl } from "@/lib/utils"

interface NFTCardProps {
  asset: any
  onClick: () => void
  view?: "tiers" | "editions"
  index?: number
  forceAnimation?: boolean
}

export default function NFTCard({ asset, onClick, view = "tiers", index = 0, forceAnimation = false }: NFTCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [hasBeenLoaded, setHasBeenLoaded] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)
  const [shouldStartAnimation, setShouldStartAnimation] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Set mounted state
  useEffect(() => {
    setIsMounted(true)

    // Check if this is a refresh
    try {
      if (typeof window !== "undefined") {
        const isRefresh = sessionStorage.getItem("is-refresh") === "true"
        if (isRefresh) {
          setHasBeenLoaded(true)
        }
      }
    } catch (e) {
      console.error("Error accessing sessionStorage:", e)
    }

    return () => {
      setIsMounted(false)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Handle force animation
  useEffect(() => {
    if (!isMounted) return

    if (forceAnimation) {
      setImageLoaded(false)
      setAnimationKey((prev) => prev + 1)
      setShouldStartAnimation(false)
    }
  }, [forceAnimation, isMounted])

  const getDisplayTitle = () => {
    if (!asset || !asset.name) return "Unknown"

    if (view === "tiers") {
      const parts = asset.name.split("-")
      const month = parts.length > 1 ? parts[1].trim() : ""
      const year = parts.length > 2 ? parts[2].trim() : ""
      return `${month} ${year}`
    } else {
      const parts = asset.name.split("-")
      return parts.length > 0 ? parts[0].trim() : asset.name
    }
  }

  const springConfig = {
    type: "spring",
    stiffness: 300,
    damping: 30,
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
    setHasBeenLoaded(true)

    // Start animation with a delay based on index
    const delay = index < 4 ? 0 : Math.min(index * 50, 500)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setShouldStartAnimation(true)
    }, delay)
  }

  // Handle image loading errors
  const handleImageError = () => {
    console.warn(`Failed to load image for asset: ${asset?.name || "unknown"}`)
    setImageLoaded(true)
    setHasBeenLoaded(true)
    setShouldStartAnimation(true)
  }

  // Only animate on first load or when forced
  const shouldAnimate = (!hasBeenLoaded || forceAnimation) && !shouldStartAnimation

  // If not mounted yet, render a placeholder
  if (!isMounted) {
    return (
      <div className="aspect-square w-full max-w-sm bg-gray-950/80 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50 animate-pulse"></div>
      </div>
    )
  }

  return (
    <motion.div
      key={`card-${asset?.asset_id || "unknown"}-${animationKey}`}
      initial={shouldAnimate ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
      animate={shouldStartAnimation || (!shouldAnimate && imageLoaded) ? { opacity: 1, scale: 1 } : {}}
      whileHover={{ scale: 0.95 }}
      transition={{
        ...springConfig,
        delay: shouldAnimate ? 0 : Math.min(index * 0.1, 1),
        scale: {
          type: "spring",
          stiffness: 300,
          damping: 25,
        },
      }}
      className="relative aspect-square w-full max-w-sm bg-gray-950/80 rounded-2xl overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      {/* Skeleton loader - only show if image hasn't been loaded */}
      <AnimatePresence>
        {!imageLoaded && (
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50 animate-pulse flex items-center justify-center"
          >
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 border-4 border-blue-400/30 rounded-full"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image with conditional animation */}
      <motion.div
        initial={shouldAnimate ? { scale: 0.9, opacity: 0 } : { scale: 1, opacity: 1 }}
        animate={shouldStartAnimation || (!shouldAnimate && imageLoaded) ? { scale: 1, opacity: 1 } : {}}
        transition={{
          ...springConfig,
          delay: shouldAnimate ? 0 : Math.min(index * 0.1, 1),
        }}
        className="relative w-full h-full"
      >
        <Image
          src={getOptimizedImageUrl(asset, true) || "/placeholder.svg"}
          alt={asset?.name || "NFT Image"}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={index < 4}
          loading={index < 4 ? "eager" : "lazy"}
          onLoadingComplete={handleImageLoad}
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
          {view !== "editions" && (
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-medium text-center truncate font-raleway">{getDisplayTitle()}</h3>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
