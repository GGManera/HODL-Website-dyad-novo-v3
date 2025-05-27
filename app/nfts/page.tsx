// Make sure we're using proper suspense boundaries to isolate rendering
import { Suspense } from "react"
import NFTShell from "@/components/nfts/NFTShell"

// Ensure dynamic rendering and no caching
export const dynamic = "force-dynamic"
export const revalidate = 0

export default function NFTsPage() {
  // Use a suspense boundary to further isolate rendering
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a1525] flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50"></div>
        </div>
      }
    >
      <NFTShell />
    </Suspense>
  )
}
