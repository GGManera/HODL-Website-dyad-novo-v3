"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { getOptimizedImageUrl } from "@/lib/utils"

// Add proper type definitions for the component props
interface AssetCardProps {
  asset: any
  onClick: (asset: any) => void
}

export default function AssetCard({ asset, onClick }: AssetCardProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: "200px 0px",
  })

  return (
    <motion.div
      ref={ref}
      className="bg-gray-800/50 rounded-lg p-4 shadow-lg flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      {inView && (
        <>
          <Image
            src={getOptimizedImageUrl(asset) || "/placeholder.svg"}
            alt={asset.name}
            width={200}
            height={200}
            className="rounded-lg w-full h-auto cursor-pointer object-contain mb-4"
            onClick={() => onClick(asset)}
          />
          <Link
            href={`https://explorer.perawallet.app/assets/${asset.asset_id}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
          >
            View on Pera Explorer
          </Link>
        </>
      )}
    </motion.div>
  )
}
