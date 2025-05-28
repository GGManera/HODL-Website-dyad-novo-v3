"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import Image from "next/image"
import { getOptimizedImageUrl } from "@/lib/utils"
import { useSwipeable } from "react-swipeable"
import { useMediaQuery } from "@/hooks/use-media-query"

interface NFTCarouselProps {
  isOpen: boolean
  onClose: () => void
  nfts: any[]
  currentIndex?: number
}

export default function NFTCarousel({ isOpen, onClose, nfts = [], currentIndex = 0 }: NFTCarouselProps) {
  // Core state
  const [currentPage, setCurrentPage] = useState(Math.floor(currentIndex / 4))
  const [isMounted, setIsMounted] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Animation state
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(null)

  // Calculate total pages (each page has 4 NFTs)
  const totalPages = Math.ceil(nfts.length / 4)

  // Mount state
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  // Update dimensions on window resize
  useEffect(() => {
    if (!isMounted) return

    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    return () => {
      window.removeEventListener("resize", updateDimensions)
    }
  }, [isMounted])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowRight") {
        goToNextPage()
      } else if (e.key === "ArrowLeft") {
        goToPrevPage()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, currentPage, totalPages])

  // Set initial page based on currentIndex
  useEffect(() => {
    if (currentIndex >= 0) {
      setCurrentPage(Math.floor(currentIndex / 4))
      setSlideDirection(null) // Reset direction when opening carousel
    }
  }, [currentIndex])

  // Navigation functions
  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setSlideDirection("left")
      setCurrentPage((prev) => prev + 1)
    }
  }

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setSlideDirection("right")
      setCurrentPage((prev) => prev - 1)
    }
  }

  const goToPage = (pageIndex: number) => {
    if (pageIndex === currentPage) return

    setSlideDirection(pageIndex > currentPage ? "left" : "right")
    setCurrentPage(pageIndex)
  }

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentPage < totalPages - 1) {
        setSlideDirection("left")
        setCurrentPage((prev) => prev + 1)
      }
    },
    onSwipedRight: () => {
      if (currentPage > 0) {
        setSlideDirection("right")
        setCurrentPage((prev) => prev - 1)
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
    trackTouch: true,
  })

  // Get current page NFTs
  const getCurrentPageNFTs = () => {
    const startIndex = currentPage * 4
    return nfts.slice(startIndex, startIndex + 4)
  }

  // Animation variants
  const pageVariants = {
    enter: (direction: "left" | "right" | null) => ({
      x: direction === "left" ? "50%" : direction === "right" ? "-50%" : 0, // Reduced slide distance
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: "left" | "right" | null) => ({
      x: direction === "left" ? "-50%" : direction === "right" ? "50%" : 0, // Reduced slide distance
      opacity: 0,
    }),
  }

  const pageTransition = {
    type: "spring",
    stiffness: 400,
    damping: 30,
    duration: 0.5,
  }

  // Early return if not mounted or no NFTs
  if (!isMounted || nfts.length === 0) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[1000] bg-black flex items-center justify-center"
          ref={containerRef}
          onClick={onClose} // Close on outside click
        >
          {/* Close button */}
          <motion.button
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-800/60 text-white hover:bg-gray-700/80 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation() // Prevent closing when clicking the button
              onClose()
            }}
          >
            <X size={24} />
          </motion.button>

          {/* NFT Grid Container */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden" {...handlers}>
            <AnimatePresence initial={false} custom={slideDirection} mode="wait">
              <motion.div
                key={`page-${currentPage}`}
                custom={slideDirection}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={pageTransition}
                className={`w-full h-full flex items-center justify-center ${isMobile ? "pt-16" : "pt-0"}`}
              >
                <div
                  className={`grid grid-cols-2 gap-3 md:gap-3 w-full ${
                    isMobile ? "h-auto px-4 max-h-[calc(100vh-120px)]" : "max-w-[85vh] pt-0 h-auto"
                  }`}
                >
                  {getCurrentPageNFTs().map((nft) => (
                    <motion.div
                      key={`nft-${nft.asset_id}`}
                      className={`relative overflow-hidden rounded-lg bg-gray-900/50 backdrop-blur-sm border border-blue-500/10 ${
                        isMobile ? "w-full max-w-sm mx-auto" : ""
                      }`}
                      style={{ aspectRatio: "1/1" }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image container
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Image
                          src={getOptimizedImageUrl(nft, true) || "/placeholder.svg"}
                          alt={nft.name || "NFT"}
                          fill
                          className="object-contain"
                          quality={90}
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                      </div>
                      {/* Remove the text label div */}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 pointer-events-none">
              {currentPage > 0 && (
                <motion.button
                  className="p-3 rounded-full bg-gray-800/60 text-white hover:bg-gray-700/80 transition-colors pointer-events-auto"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation() // Prevent closing
                    goToPrevPage()
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronLeft size={24} />
                </motion.button>
              )}

              {currentPage < totalPages - 1 && (
                <motion.button
                  className="p-3 rounded-full bg-gray-800/60 text-white hover:bg-gray-700/80 transition-colors pointer-events-auto ml-auto"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation() // Prevent closing
                    goToNextPage()
                  }}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight size={24} />
                </motion.button>
              )}
            </div>

            {/* Page indicator */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
              {Array.from({ length: totalPages }).map((_, index) => (
                <motion.button
                  key={`indicator-${index}`}
                  className={`w-2.5 h-2.5 rounded-full ${
                    currentPage === index ? "bg-blue-400" : "bg-gray-600 hover:bg-gray-500"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation() // Prevent closing
                    goToPage(index)
                  }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </div>

            {/* Page counter */}
            <div className="absolute top-4 left-4 bg-gray-800/60 px-3 py-1 rounded-full text-sm text-white">
              {currentPage + 1} / {totalPages}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}