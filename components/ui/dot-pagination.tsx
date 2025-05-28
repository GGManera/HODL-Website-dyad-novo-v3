"use client"

import { motion } from "framer-motion"

interface DotPaginationProps {
  total: number
  current: number
  onDotClick?: (index: number) => void
}

export default function DotPagination({ total, current, onDotClick }: DotPaginationProps) {
  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      {Array.from({ length: total }).map((_, index) => (
        <motion.button
          key={index}
          onClick={() => onDotClick?.(index)}
          className={`w-2 h-2 rounded-full transition-colors ${index === current ? "bg-blue-400" : "bg-gray-600"}`}
          whileTap={{ scale: 0.9 }}
          aria-label={`Go to tier ${index + 1}`}
        />
      ))}
    </div>
  )
}
