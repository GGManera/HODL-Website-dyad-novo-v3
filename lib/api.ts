"use client"

import { useState, useEffect } from "react"

const HODL_WALLET_ADDRESS = "PTPAK7NH3KA3D23WBR5GWVS57SO3FCJFBGK2IPDQQFFEXDHO4ENVH65PPM"

// Add caching for API calls
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Add proper type annotations for the getCreatedAssets function return type
export async function getCreatedAssets(): Promise<any[]> {
  // Check cache first
  if (typeof window !== "undefined") {
    const cachedData = localStorage.getItem("nft-data")
    const cacheTimestamp = localStorage.getItem("nft-data-timestamp")

    if (cachedData && cacheTimestamp) {
      const timestamp = Number.parseInt(cacheTimestamp)
      if (Date.now() - timestamp < CACHE_DURATION) {
        try {
          const parsedData = JSON.parse(cachedData)
          // Return cached data immediately - even if it's empty
          // This allows the page to load faster with cached data
          return parsedData.filter((asset: any) => asset.params["unit-name"] === "HERO")
        } catch (e) {
          console.error("Error parsing cached NFT data:", e)
          // Continue if parse error
        }
      }
    }
  }

  try {
    const res = await fetch(`https://mainnet-api.algonode.cloud/v2/accounts/${HODL_WALLET_ADDRESS}`, {
      next: { revalidate: 300 }, // Cache for 5 minutes on server
    })

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const data = await res.json()

    if (!data || !Array.isArray(data["created-assets"])) {
      console.error("Unexpected API response structure:", data)
      return []
    }

    // Filter for HERO unit name
    const filteredAssets = data["created-assets"].filter(
      (asset: any) => asset.params && asset.params["unit-name"] === "HERO",
    )

    // Cache the filtered data
    if (typeof window !== "undefined") {
      localStorage.setItem("nft-data", JSON.stringify(filteredAssets))
      localStorage.setItem("nft-data-timestamp", Date.now().toString())
    }

    return filteredAssets
  } catch (error) {
    console.error("Failed to fetch created assets:", error)
    return []
  }
}

// Add caching for asset details
const assetDetailsCache = new Map()

export async function getAssetDetails(assetId: number) {
  // Check memory cache first
  if (assetDetailsCache.has(assetId)) {
    return assetDetailsCache.get(assetId)
  }

  try {
    const res = await fetch(`https://mainnet.api.perawallet.app/v1/public/assets/${assetId}/`, {
      next: { revalidate: 300 },
    })

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const data = await res.json()

    let tier = "Unknown"
    let gemValue = "Unknown"
    let month = "Unknown"

    if (data.collectible && data.collectible.traits) {
      const tierTrait = data.collectible.traits.find((trait) => trait.display_name.toLowerCase().includes("tier"))
      const gemTrait = data.collectible.traits.find((trait) => trait.display_name.toLowerCase().includes("gem"))
      const monthTrait = data.collectible.traits.find((trait) => trait.display_name.toLowerCase().includes("month"))

      if (tierTrait) tier = `Tier ${tierTrait.display_value}`
      if (gemTrait) gemValue = gemTrait.display_value
      if (monthTrait) month = monthTrait.display_value
    }

    const result = { ...data, tier, gemValue, month }

    // Cache the result in memory
    assetDetailsCache.set(assetId, result)

    return result
  } catch (error) {
    console.error(`Failed to fetch asset details for asset ${assetId}:`, error)
    return null
  }
}

export async function getNFDs(addresses: string[]) {
  try {
    const res = await fetch(`/api/get-nfds?addresses=${addresses.join(",")}`)
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    return await res.json()
  } catch (error) {
    console.error("Error fetching NFDs:", error)
    return {}
  }
}

export async function getAssetHolders(assetId: string) {
  try {
    const response = await fetch(`/api/asset-holders?assetId=${assetId}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching asset holders:", error)
    throw error
  }
}

export function useAssetHolders(assetId: string | undefined) {
  const [data, setData] = useState<{ holders: Array<{ address: string; amount: number }> } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchHolders() {
      if (!assetId) return

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/asset-holders?assetId=${assetId}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const result = await response.json()
        setData(result)
      } catch (e) {
        setError(e instanceof Error ? e : new Error("An error occurred"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchHolders()
  }, [assetId])

  return { data, isLoading, error }
}
