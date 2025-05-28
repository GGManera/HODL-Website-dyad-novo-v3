"use client"

import { motion } from "framer-motion"
import { ImageIcon } from "lucide-react"

interface FullScreenButtonProps {
  onClick: () => void
  isActive?: boolean
}

export default function FullScreenButton({ onClick, isActive = false }: FullScreenButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm font-medium ${
        isActive ? "bg-blue-500/20 text-blue-400" : "text-gray-400"
      }`}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex items-center gap-1">
        <ImageIcon size={16} />
        <span>Gallery</span>
      </div>
    </motion.button>
  )
}
