"use client"

import { Gem } from "lucide-react"
import { motion } from "framer-motion"

interface GemIndicatorProps {
  activeTier: number
  sortOrder: "highest_first" | "highest_last"
}

interface GemConfig {
  color: string
  rotation: number
  label: string
}

const gemConfigs: { [key: number]: GemConfig } = {
  1: { color: "rgb(209, 231, 255)", rotation: 0, label: "Diamond" }, // Diamond at 0°
  2: { color: "rgb(147, 197, 253)", rotation: 90, label: "Sapphire" }, // Sapphire at 90°
  3: { color: "rgb(252, 165, 165)", rotation: 180, label: "Ruby" }, // Ruby at 180°
  4: { color: "rgb(134, 239, 172)", rotation: 270, label: "Emerald" }, // Emerald at 270°
}

export default function GemIndicator({ activeTier, sortOrder }: GemIndicatorProps) {
  const tiers = sortOrder === "highest_first" ? [1, 2, 3, 4] : [4, 3, 2, 1]

  return (
    <div className="flex justify-center items-center gap-3 mt-4 mb-2">
      {tiers.map((tier) => (
        <motion.div
          key={tier}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <Gem
            className={`w-5 h-5 transition-all duration-300 ${tier === activeTier ? "opacity-100" : "opacity-30"}`}
            style={{
              transform: `rotate(${gemConfigs[tier].rotation}deg)`,
              color: tier === activeTier ? gemConfigs[tier].color : "rgb(156, 163, 175)",
            }}
          />
          <span className="sr-only">{gemConfigs[tier].label}</span>
        </motion.div>
      ))}
    </div>
  )
}
