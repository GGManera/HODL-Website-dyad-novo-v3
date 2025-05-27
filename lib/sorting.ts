export interface NFT {
  asset_id: string
  name: string
  collectible?: {
    traits?: Array<{
      display_name: string
      display_value: string
    }>
  }
}

export interface SortingState {
  gemOrder: "highest_first" | "highest_last"
  dateOrder: "newest_first" | "oldest_first"
}

export const getGemValue = (nft: NFT): number => {
  const gemTrait = nft.collectible?.traits?.find((t) => t.display_name === "Gem")
  return Number.parseInt(gemTrait?.display_value || "0")
}

export const getDate = (nft: NFT): Date => {
  const parts = nft.name.split("-")
  if (parts.length < 3) return new Date(0)
  const month = parts[1].trim()
  const year = parts[2].trim()
  const monthIndex = new Date(`${month} 1, 2000`).getMonth()
  return new Date(Number.parseInt(year), monthIndex)
}

export const getTier = (nft: NFT): number => {
  const tierTrait = nft.collectible?.traits?.find((t) => t.display_name === "Tier")
  return Number.parseInt(tierTrait?.display_value || "0")
}

export const sortNFTs = (nfts: NFT[], sortingState: SortingState): NFT[] => {
  return [...nfts].sort((a: NFT, b: NFT) => {
    const gemA = getGemValue(a)
    const gemB = getGemValue(b)
    const dateA = getDate(a)
    const dateB = getDate(b)

    // Primary sort by gem value
    if (gemA !== gemB) {
      return sortingState.gemOrder === "highest_first" ? gemB - gemA : gemA - gemB
    }

    // Secondary sort by date
    return sortingState.dateOrder === "newest_first"
      ? dateB.getTime() - dateA.getTime()
      : dateA.getTime() - dateB.getTime()
  })
}
