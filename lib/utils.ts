import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getOptimizedImageUrl(asset: any, isLargeImage = false): string {
  let imageUrl = null

  if (asset.collectible && asset.collectible.media && asset.collectible.media.length > 0) {
    const ipfsMedia = asset.collectible.media.find((m) => m.url && m.url.startsWith("https://ipfs.algonode.dev/ipfs/"))
    if (ipfsMedia) {
      imageUrl = ipfsMedia.url
    }
  }

  if (!imageUrl && asset.collectible && asset.collectible.metadata && asset.collectible.metadata.image) {
    if (asset.collectible.metadata.image.startsWith("ipfs://")) {
      imageUrl = `https://ipfs.algonode.dev/ipfs/${asset.collectible.metadata.image.slice(7)}`
    } else if (asset.collectible.metadata.image.startsWith("https://ipfs.algonode.dev/ipfs/")) {
      imageUrl = asset.collectible.metadata.image
    }
  }

  if (!imageUrl) {
    return "/placeholder.svg"
  }

  const width = isLargeImage ? 1200 : 300
  const quality = isLargeImage ? 100 : 70

  return `${imageUrl}?optimizer=image&width=${width}&quality=${quality}`
}
