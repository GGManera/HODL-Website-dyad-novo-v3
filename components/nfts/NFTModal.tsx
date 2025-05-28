"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import Image from "next/image"
import { getOptimizedImageUrl } from "@/lib/utils"
import { useAssetHolders } from "@/lib/api"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft } from "lucide-react"

interface NFTModalProps {
  asset: any
  onClose: () => void
}

interface Holder {
  address: string
  amount: number
  nfd?: string
}

const springConfig = {
  type: "spring",
  stiffness: 300,
  damping: 30,
}

export default function NFTModal({ asset, onClose }: NFTModalProps) {
  // Removed local isOpen state, as it's now controlled by the parent
  const { data, isLoading: isLoadingHolders } = useAssetHolders(asset.asset_id?.toString())
  const [sortedHolders, setSortedHolders] = useState<Holder[]>([])
  const [isLoadingNFDs, setIsLoadingNFDs] = useState(false)
  const [creatorNFD, setCreatorNFD] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const mountedRef = useRef(true)

  // Set mounted ref
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (!mountedRef.current) return

    async function fetchCreatorNFD() {
      try {
        const response = await fetch(`/api/get-nfds?addresses=${asset.creator_address}`)
        const { nfds } = await response.json()
        if (mountedRef.current && nfds[asset.creator_address]?.name) {
          setCreatorNFD(nfds[asset.creator_address].name)
        }
      } catch (error) {
        console.error("Erro ao buscar NFD do criador:", error)
      }
    }

    fetchCreatorNFD()
  }, [asset.creator_address])

  useEffect(() => {
    if (!mountedRef.current) return

    async function fetchAndSortHolders() {
      if (!data?.holders) return

      setIsLoadingNFDs(true)
      try {
        const nonZeroHolders = data.holders.filter((holder) => holder.amount > 0)
        const addresses = nonZeroHolders.map((h) => h.address)
        const response = await fetch(`/api/get-nfds?addresses=${addresses.join(",")}`)
        const { nfds } = await response.json()

        if (!mountedRef.current) return

        const holdersWithNFDs = nonZeroHolders.map((holder) => ({
          ...holder,
          nfd: nfds[holder.address]?.name,
        }))

        const sorted = holdersWithNFDs.sort((a, b) => {
          const hasNfdA = Boolean(a.nfd)
          const hasNfdB = Boolean(b.nfd)

          if (hasNfdA && !hasNfdB) return -1
          if (!hasNfdA && hasNfdB) return 1

          if (hasNfdA && hasNfdB) {
            return a.nfd.localeCompare(b.nfd)
          }

          return a.address.localeCompare(b.address)
        })

        if (mountedRef.current) {
          setSortedHolders(
            data.holders.filter((holder) => holder.amount > 0).sort((a, b) => a.address.localeCompare(b.address)),
          )
        }
      } catch (error) {
        console.error("Erro ao buscar NFDs:", error)
        if (mountedRef.current) {
          setSortedHolders(
            data.holders.filter((holder) => holder.amount > 0).sort((a, b) => a.address.localeCompare(b.address)),
          )
        }
      } finally {
        if (mountedRef.current) {
          setIsLoadingNFDs(false)
        }
      }
    }

    fetchAndSortHolders()
  }, [data?.holders])

  const getDisplayAddress = (holder: Holder) => {
    if (holder.nfd) return holder.nfd
    return `${holder.address.slice(0, 4)}...${holder.address.slice(-4)}`
  }

  const getNFDUrl = (holder: Holder) => {
    if (holder.nfd) {
      return `https://app.nf.domains/name/${holder.nfd}`
    }
    return null
  }

  const getCreatorDisplay = () => {
    if (creatorNFD) return creatorNFD
    return `${asset.creator_address.slice(0, 4)}...${asset.creator_address.slice(-4)}`
  }

  const getCreatorUrl = () => {
    if (creatorNFD) {
      return `https://app.nf.domains/name/${creatorNFD}`
    }
    return null
  }

  const copyAssetId = async () => {
    try {
      await navigator.clipboard.writeText(asset.asset_id.toString())
      setIsCopied(true)
      setTimeout(() => {
        if (mountedRef.current) {
          setIsCopied(false)
        }
      }, 2000)
    } catch (err) {
      console.error("Falha ao copiar:", err)
    }
  }

  // The Dialog's open state is now controlled by the parent component
  return (
    <AnimatePresence>
      <Dialog open={true} onOpenChange={onClose}> {/* Dialog is always open when rendered, onClose is passed */}
        <DialogContent className="max-w-[95vw] sm:max-w-3xl w-full max-h-[94vh] overflow-hidden bg-transparent border-0 p-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={springConfig}
            className="overflow-y-auto scrollbar-thin scrollbar-track-gray-800/50 scrollbar-thumb-blue-500/20 hover:scrollbar-thumb-blue-500/30 bg-gradient-to-b from-gray-900 to-black p-6 rounded-2xl border border-blue-500/20 max-h-[94vh]"
          >
            <div className="space-y-3 sm:space-y-4 text-white font-raleway">
              <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-raleway">
                {asset.name}
              </h2>

              <div className="relative aspect-square w-full max-w-xl mx-auto">
                <Image
                  src={getOptimizedImageUrl(asset, true) || "/placeholder.svg"}
                  alt={asset.name}
                  fill
                  className="object-contain rounded-lg cursor-pointer"
                  priority
                  quality={100}
                  onClick={onClose}
                />
              </div>

              {/* Botões com melhor layout para mobile */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`https://explorer.perawallet.app/asset/${asset.asset_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center text-center px-4 py-3 h-full rounded-lg bg-[#FFEE55] hover:bg-[#E5D54C] text-black transition-colors text-sm font-semibold"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span>View in</span>
                      <span>Pera Explorer</span>
                    </div>
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pera-logomark-black-ZuSGEKX5criUX5INlIGCQXaXBmHFix.png"
                      alt="Pera"
                      className="w-4 h-4"
                    />
                  </div>
                </a>
                <a
                  href={asset.collectible?.media?.[0]?.url || asset.collectible?.metadata?.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center text-center px-4 py-3 h-full rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-colors text-sm font-medium"
                >
                  <div className="flex flex-col">
                    <span>Original</span>
                    <span>Image</span>
                  </div>
                </a>
              </div>

              {/* NFT Properties */}
              <div className="mt-6 space-y-4">
                {/* Asset Details */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    {
                      label: "Asset ID",
                      value: asset.asset_id,
                      isNumeric: true,
                    },
                    {
                      label: "Unit Name",
                      value: asset.unit_name || "HERO",
                      isNumeric: false,
                    },
                    {
                      label: "Creator",
                      value: getCreatorDisplay(),
                      isNumeric: false,
                      url: getCreatorUrl(),
                    },
                    {
                      label: "Total Supply",
                      value: asset.total_supply || "1",
                      isNumeric: true,
                    },
                  ].map(({ label, value, isNumeric, url }) => (
                    <div key={label} className="bg-gray-800/50 p-2 rounded-lg text-center">
                      <dt className="font-semibold text-gray-400 font-mono">{label}</dt>
                      {url ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-blue-400 transition-colors font-mono"
                        >
                          {value}
                        </a>
                      ) : (
                        <dd className="text-white font-mono">{value}</dd>
                      )}
                    </div>
                  ))}
                </div>

                {/* Description */}
                {asset.collectible?.description && (
                  <div className="bg-gray-800/50 p-3 rounded-lg text-center">
                    <dt className="font-semibold text-gray-400 mb-1 font-mono">Description</dt>
                    <dd className="text-white font-raleway">{asset.collectible.description}</dd>
                  </div>
                )}

                {/* Traits */}
                {asset.collectible?.traits && asset.collectible.traits.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold mb-2 text-center text-xl text-blue-400 font-raleway">Traits</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {asset.collectible.traits.map((trait, index) => (
                        <div key={index} className="bg-gray-800/50 p-2 rounded-lg text-center">
                          <dt className="font-semibold text-gray-400 font-mono">{trait.display_name}</dt>
                          <dd className="text-white font-mono">{trait.display_value}</dd>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Holders Section */}
                <div className="mt-4">
                  <h4 className="font-semibold mb-2 text-center text-xl text-blue-400 font-raleway">Asset HODLers</h4>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    {isLoadingHolders ? (
                      <p className="text-center text-gray-400 font-mono">Loading holders...</p>
                    ) : sortedHolders?.length > 0 ? (
                      <div className="max-h-60 overflow-y-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr>
                              <th className="pb-2 text-gray-400 font-mono">Address / NFD</th>
                              <th className="pb-2 text-gray-400 font-mono">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sortedHolders.map((holder) => (
                              <tr key={holder.address} className="border-t border-gray-700">
                                <td className="py-2 text-sm text-white">
                                  {holder.nfd ? (
                                    <a
                                      href={`https://app.nf.domains/name/${holder.nfd}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-white hover:text-blue-400 transition-colors font-mono"
                                    >
                                      {holder.nfd}
                                    </a>
                                  ) : (
                                    <span className="font-mono">{getDisplayAddress(holder)}</span>
                                  )}
                                </td>
                                <td className="py-2 text-sm text-gray-400 font-mono">
                                  {holder.amount.toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-center text-gray-400 font-mono">No holders found</p>
                    )}
                  </div>
                </div>
              </div>

              <motion.button
                onClick={onClose}
                className="mt-6 mx-auto flex items-center justify-center w-10 h-10 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </motion.button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  )
}