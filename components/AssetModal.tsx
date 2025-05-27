"use client"
import { useEffect, useRef } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog"
import { getOptimizedImageUrl } from "@/lib/utils"
import { useAssetHolders } from "@/lib/api"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { useSwipeable } from "react-swipeable"

export default function AssetModal({ asset, onClose, nfds }) {
  const { data: assetHolders, isLoading: isLoadingHolders } = useAssetHolders(asset.asset_id.toString())
  const viewTypeRef = useRef<"mobile" | "desktop">(null)

  // Set the view type only once when component mounts
  useEffect(() => {
    if (viewTypeRef.current === null) {
      viewTypeRef.current = window.innerWidth < 768 ? "mobile" : "desktop"
    }
  }, [])

  const handlers = useSwipeable({
    onSwipedDown: onClose,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  })

  if (!asset || viewTypeRef.current === null) return null

  const getDisplayAddress = (holder) => {
    if (!holder || !holder.address) return "Unknown Address"
    return holder.nfd || `${holder.address.slice(0, 4)}...${holder.address.slice(-4)}`
  }

  const MobileModal = () => (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black z-50 overflow-y-auto"
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "100%" }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        {...handlers}
      >
        <div className="min-h-screen flex flex-col">
          <div className="flex justify-end p-4">
            <button onClick={onClose} className="text-white">
              <X size={24} />
            </button>
          </div>
          <div className="flex-grow overflow-y-auto px-4 pb-8">
            <h2 className="text-2xl font-bold text-center mb-4 text-blue-400">{asset.name}</h2>
            <Image
              src={getOptimizedImageUrl(asset, true) || "/placeholder.svg"}
              alt={asset.name}
              width={600}
              height={600}
              className="rounded-lg w-full h-auto mb-4 object-contain"
            />
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              {[
                { label: "Asset ID", value: asset.asset_id },
                { label: "Unit Name", value: asset.unit_name },
                { label: "Total Supply", value: asset.total_supply },
                {
                  label: "Creator",
                  value: getDisplayAddress({ address: asset.creator_address, nfd: nfds[asset.creator_address] }),
                },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-800/50 p-2 rounded-lg text-center">
                  <dt className="font-semibold text-gray-400">{label}</dt>
                  <dd className="text-white">{value}</dd>
                </div>
              ))}
            </div>
            {asset.collectible?.description && (
              <div className="mb-4 bg-gray-800/50 p-2 rounded-lg text-center">
                <dt className="font-semibold text-gray-400">Description</dt>
                <dd className="text-white">{asset.collectible.description}</dd>
              </div>
            )}
            {asset.collectible?.traits && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-center text-xl text-blue-400">Traits</h4>
                <div className="grid grid-cols-2 gap-2">
                  {asset.collectible.traits.map((trait, index) => (
                    <div key={index} className="bg-gray-800/50 p-2 rounded-lg text-center">
                      <dt className="font-semibold text-gray-400">{trait.display_name}</dt>
                      <dd className="text-white">{trait.display_value}</dd>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h4 className="font-semibold mb-2 text-center text-xl text-blue-400">Asset HODLers</h4>
              <div className="bg-gray-800/50 rounded-lg p-3">
                {isLoadingHolders ? (
                  <p className="text-center text-gray-400">Loading holders...</p>
                ) : assetHolders?.holders?.length > 0 ? (
                  <div className="max-h-60 overflow-y-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr>
                          <th className="pb-2 text-gray-400">Address / NFD</th>
                          <th className="pb-2 text-gray-400">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assetHolders.holders.map((holder) => (
                          <tr key={holder.address} className="border-t border-gray-700">
                            <td className="py-2 text-sm text-white">{getDisplayAddress(holder)}</td>
                            <td className="py-2 text-sm text-gray-400">{holder.amount.toLocaleString()} units</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-gray-400">No holders found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )

  return viewTypeRef.current === "mobile" ? (
    <MobileModal />
  ) : (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
      <DialogContent className="max-w-[90vw] sm:max-w-3xl w-full max-h-[85vh] overflow-y-auto bg-gradient-to-b from-gray-900 to-black p-6 rounded-[24px] border border-blue-500/20">
        <div className="space-y-4 sm:space-y-6 text-white font-raleway">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            {asset.name}
          </h2>
          <div className="relative w-full aspect-square max-h-[50vh] flex items-center justify-center">
            <Image
              src={getOptimizedImageUrl(asset, true) || "/placeholder.svg"}
              alt={asset.name}
              width={600}
              height={600}
              className="rounded-lg w-full h-full object-contain"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            {[
              { label: "Asset ID", value: asset.asset_id },
              { label: "Unit Name", value: asset.unit_name },
              { label: "Total Supply", value: asset.total_supply },
              {
                label: "Creator",
                value: getDisplayAddress({ address: asset.creator_address, nfd: nfds[asset.creator_address] }),
              },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-800/50 p-2 rounded-lg text-center">
                <dt className="font-semibold text-gray-400">{label}</dt>
                <dd className="text-white">{value}</dd>
              </div>
            ))}
          </div>
          {asset.collectible?.description && (
            <div className="mb-4 bg-gray-800/50 p-2 rounded-lg text-center">
              <dt className="font-semibold text-gray-400">Description</dt>
              <dd className="text-white">{asset.collectible.description}</dd>
            </div>
          )}
          {asset.collectible?.traits && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2 text-center text-xl text-blue-400">Traits</h4>
              <div className="grid grid-cols-2 gap-2">
                {asset.collectible.traits.map((trait, index) => (
                  <div key={index} className="bg-gray-800/50 p-2 rounded-lg text-center">
                    <dt className="font-semibold text-gray-400">{trait.display_name}</dt>
                    <dd className="text-white">{trait.display_value}</dd>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mt-4">
            <h4 className="font-semibold mb-2 text-center text-xl text-blue-400">Asset HODLers</h4>
            <div className="bg-gray-800/50 rounded-lg p-3">
              {isLoadingHolders ? (
                <p className="text-center text-gray-400">Loading holders...</p>
              ) : assetHolders?.holders?.length > 0 ? (
                <div className="max-h-60 overflow-y-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr>
                        <th className="pb-2 text-gray-400">Address / NFD</th>
                        <th className="pb-2 text-gray-400">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assetHolders.holders.map((holder) => (
                        <tr key={holder.address} className="border-t border-gray-700">
                          <td className="py-2 text-sm text-white">{getDisplayAddress(holder)}</td>
                          <td className="py-2 text-sm text-gray-400">{holder.amount.toLocaleString()} units</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-400">No holders found</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
