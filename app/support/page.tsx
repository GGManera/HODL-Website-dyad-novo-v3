import Link from "next/link"

// Static fallback component with no client-side logic
function SupportFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50"></div>
    </div>
  )
}

// Export configuration to ensure proper rendering
export const dynamic = "force-dynamic"
export const revalidate = 0

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <main className="max-w-5xl mx-auto px-4 py-24 relative z-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-8 gradient-heading leading-tight py-2">
          <span className="gradient-text-fix">Support HODL Movement</span>
        </h1>

        <p className="text-xl text-center text-gray-300 max-w-3xl mx-auto mb-12">
          Every HODLer plays a vital role in our community. Here's how you can contribute to our shared success.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-800/50 rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-blue-400">Community Support</h2>
            <p className="mb-6 text-gray-300">
              Join our active community on Telegram and Twitter to stay updated and help spread the word about HODL.
            </p>
            <div className="flex flex-col space-y-4">
              <a
                href="https://t.me/algohodlcoin"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-500/20 hover:border-blue-500/40 text-gray-200 hover:text-white transition-all duration-300 backdrop-blur-sm"
              >
                Join Telegram
              </a>
              <a
                href="https://x.com/ALGOHODLCOIN"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-500/20 hover:border-blue-500/40 text-gray-200 hover:text-white transition-all duration-300 backdrop-blur-sm"
              >
                Follow on X (Twitter)
              </a>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-blue-400">Buy & HODL</h2>
            <p className="mb-6 text-gray-300">
              The most direct way to support the project is to buy and hold HODL tokens, demonstrating your belief in
              the project's future.
            </p>
            <div className="flex flex-col space-y-4">
              <a
                href="https://app.tinyman.org/#/swap?asset_in=0&asset_out=2637649940"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-500/20 hover:border-blue-500/40 text-gray-200 hover:text-white transition-all duration-300 backdrop-blur-sm"
              >
                Buy on Tinyman
              </a>
              <a
                href="https://vestige.fi/asset/2637649940"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-500/20 hover:border-blue-500/40 text-gray-200 hover:text-white transition-all duration-300 backdrop-blur-sm"
              >
                Buy on Vestige
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="bg-gray-800/50 rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-blue-400">Social Media Support</h2>
            <p className="mb-6 text-gray-300">
              Help spread the word about HODL by engaging with our content on social media platforms.
            </p>
            <ul className="list-disc list-inside space-y-3 text-gray-300">
              <li>Like, comment, and share our posts</li>
              <li>Use hashtags like #HODL, #HODLcoin, and #Algorand</li>
              <li>Create your own content about your HODL journey</li>
              <li>Participate in community discussions</li>
            </ul>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-blue-400">Be. Influence.</h2>
            <p className="mb-6 text-gray-300">
              Become an influential voice in the crypto community and help shape the future of HODL.
            </p>
            <ul className="list-disc list-inside space-y-3 text-gray-300">
              <li>Share your knowledge and experience</li>
              <li>Create educational content about HODL</li>
              <li>Welcome newcomers to the community</li>
              <li>Represent HODL in other crypto communities</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-blue-400 text-center">Join the Movement Today</h2>
          <p className="text-gray-300 text-center mb-8">
            Every action you take, no matter how small, contributes to our collective success. Start supporting HODL
            today and be part of our growing community of diamond-handed holders.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/nfts"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-500/20 hover:border-blue-500/40 text-gray-200 hover:text-white transition-all duration-300 backdrop-blur-sm"
            >
              View HODL NFTs
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-500/20 hover:border-blue-500/40 text-gray-200 hover:text-white transition-all duration-300 backdrop-blur-sm"
            >
              Return Home
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-blue-500/10 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">HODL - Heroes Of Diamond Legacy</p>
        </div>
      </footer>
    </div>
  )
}
