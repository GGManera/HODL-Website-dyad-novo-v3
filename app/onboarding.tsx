"use client"

import React from "react"
import { motion } from "framer-motion"
// Removed Sparkles import
// import Sparkles from "@/components/Sparkles"
import Image from "next/image"
import MobileBottomNav from "@/components/MobileBottomNav"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useEffect, useState, useRef } from "react"
import TinymanWidget from "@/components/TinymanWidget"

class ErrorBoundary extends React.Component<{
  children: React.ReactNode
  fallback: React.ReactNode
}> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error("Widget error:", error)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

export default function Onboarding() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [isHydrated, setIsHydrated] = useState(false)
  const mountedRef = useRef(true)
  const timeoutsRef = useRef<NodeJS.Timeout[]>([])
  const scrollListenersRef = useRef<(() => void)[]>([])

  // Hydration and cleanup
  useEffect(() => {
    setIsHydrated(true)
    mountedRef.current = true

    // Reset scroll position on page load/refresh
    window.scrollTo(0, 0)

    // Disable browser's automatic scroll restoration
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual"
    }

    // Clean up function
    return () => {
      mountedRef.current = false

      // Clear all timeouts
      timeoutsRef.current.forEach(clearTimeout)
      timeoutsRef.current = []

      // Remove all scroll listeners
      scrollListenersRef.current.forEach((removeListener) => removeListener())
      scrollListenersRef.current = []

      // Force cleanup of any lingering animations or effects
      if (typeof window !== "undefined") {
        // Get a numeric ID by converting the Timeout to a number
        const highestId = Number(setTimeout(() => {}, 0))
        for (let i = 0; i < highestId; i++) {
          clearTimeout(i)
          clearInterval(i)
        }
      }
    }
  }, [])

  const scrollToTop = () => {
    if (!mountedRef.current) return

    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // If not hydrated yet, show a minimal loading state
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white font-raleway">
      {/* Removed Sparkles instance */}
      <main className="max-w-5xl mx-auto px-2 sm:px-4 py-24 relative z-10 overflow-x-hidden">
        <motion.h2
          className="text-4xl sm:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text leading-tight py-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="md:inline-block md:whitespace-nowrap">Your Journey to HODL</span>{" "}
          <span className="whitespace-nowrap block md:inline-block">Begins Here</span>
        </motion.h2>

        <div className="space-y-16">
          <OnboardingStep
            stepNumber={1}
            title="Set Up Your Algorand Wallet"
            description="Start your HODL journey with a secure Algorand wallet. We recommend Pera Wallet for its user-friendly interface and robust security features."
            delay={0.2}
          >
            <div className="bg-gray-800/50 px-6 py-6 rounded-lg shadow-inner mt-4">
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold mb-3 text-blue-400">Getting Started</h4>
                    <ol className="list-decimal list-inside space-y-2 text-gray-300">
                      <li>Download Pera Wallet from your app store</li>
                      <li>Open the app and select "Create a new wallet"</li>
                      <li>
                        Securely store your 25-word recovery phrase
                        <div className="ml-6 mt-1 text-sm text-gray-400 italic">
                          (You can also skip this step for now, but remember to back it up later for security)
                        </div>
                      </li>
                    </ol>
                  </div>
                  <div className="flex justify-center w-full">
                    <a
                      href="https://perawallet.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#FFEE55] hover:bg-[#E5D54C] text-black transition-colors text-sm font-semibold"
                    >
                      <span>Get Pera Wallet</span>
                      <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pera-logomark-black-ZuSGEKX5criUX5INlIGCQXaXBmHFix.png"
                        alt="Pera"
                        className="w-4 h-4 ml-2"
                      />
                    </a>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center bg-gray-900/50 rounded-lg p-6">
                  <div className="bg-white p-1 rounded-lg shadow-lg mb-3">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-qYubpJjeo3VK7xu9rrTIHwkYY6ODur.png"
                      alt="QR Code to download Pera Wallet"
                      width={100}
                      height={100}
                      className="w-auto h-auto"
                    />
                  </div>
                  <span className="text-sm text-gray-400">Scan to download</span>
                </div>
              </div>
            </div>
          </OnboardingStep>

          <OnboardingStep
            stepNumber={2}
            title="Acquire ALGO Tokens"
            description="To interact with the Algorand blockchain and purchase $HODL, you'll need ALGO tokens. Here's how you can get them:"
            delay={0.4}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <div className="bg-gray-800/50 p-6 rounded-lg shadow-inner">
                <h4 className="text-xl font-semibold mb-4 text-blue-400">Centralized Exchanges</h4>
                <p className="mb-4 text-gray-300">Purchase ALGO from these popular exchanges:</p>
                <div className="flex flex-col space-y-4">
                  <a
                    href="https://www.binance.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-200 hover:text-white flex items-center justify-center px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 backdrop-blur-sm"
                  >
                    Binance
                  </a>
                  <a
                    href="https://www.coinbase.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-200 hover:text-white flex items-center justify-center px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 backdrop-blur-sm"
                  >
                    Coinbase
                  </a>
                  <a
                    href="https://www.kraken.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-200 hover:text-white flex items-center justify-center px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 backdrop-blur-sm"
                  >
                    Kraken
                  </a>
                  <a
                    href="https://www.kucoin.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-200 hover:text-white flex items-center justify-center px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 backdrop-blur-sm"
                  >
                    KuCoin
                  </a>
                  <a
                    href="https://crypto.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-200 hover:text-white flex items-center justify-center px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 backdrop-blur-sm"
                  >
                    Crypto.com
                  </a>
                </div>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-lg shadow-inner">
                <h4 className="text-xl font-semibold mb-4 text-blue-400">Cross-Chain Bridges</h4>
                <p className="mb-4 text-gray-300">Transfer assets from other blockchains:</p>
                <div className="flex flex-col space-y-4">
                  <a
                    href="https://messina.one/bridge"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-200 hover:text-white flex items-center justify-center px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 backdrop-blur-sm"
                  >
                    Messina Bridge
                  </a>
                  <a
                    href="https://swapspace.co/cross-chain/algo-erc20-bridge"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-200 hover:text-white flex items-center justify-center px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 backdrop-blur-sm"
                  >
                    Swap Space
                  </a>
                  <a
                    href="https://portalbridge.com/advanced-tools/#/transfer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-200 hover:text-white flex items-center justify-center px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 backdrop-blur-sm"
                  >
                    Portal Bridge
                  </a>
                </div>
              </div>
            </div>
          </OnboardingStep>

          <OnboardingStep
            stepNumber={3}
            title="Buy $HODL Tokens"
            description="Now that you have ALGO in your Pera Wallet, it's time to acquire $HODL tokens and join our community of diamond-handed holders!"
            delay={0.6}
          >
            <div className="mt-4 space-y-6">
              <div className="bg-gray-800/50 p-6 rounded-lg shadow-inner">
                <h4 className="text-xl font-semibold mb-4 text-blue-400">Swap ALGO for $HODL</h4>
                <p className="mb-4 text-gray-300">Buy $HODL directly through our integrated Tinyman widget:</p>
              </div>

              <div className="flex justify-center w-full">
                <div className="bg-[#1B2430] rounded-2xl p-6 w-fit mx-auto border border-[#1B2430]">
                  {isHydrated && (
                    <ErrorBoundary
                      fallback={
                        <div className="flex items-center justify-center h-[520px] bg-[#1B2430] rounded-lg">
                          <p className="text-white text-center">
                            Widget unavailable. Please visit{" "}
                            <a
                              href="https://app.tinyman.org/#/swap?asset_in=0&asset_out=2637649940"
                              className="text-blue-400 underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Tinyman
                            </a>{" "}
                            directly.
                          </p>
                        </div>
                      }
                    >
                      <TinymanWidget />
                    </ErrorBoundary>
                  )}
                </div>
              </div>

              <div className="bg-gray-800/50 p-6 rounded-lg shadow-inner">
                <h4 className="text-xl font-semibold mb-4 text-blue-400">Alternative DEX Options</h4>
                <p className="mb-4 text-gray-300">You can also acquire $HODL on these decentralized exchanges:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href="https://vestige.fi/asset/2637649940"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-500/20 hover:border-blue-500/40 text-gray-200 hover:text-white transition-all duration-300 backdrop-blur-sm"
                  >
                    Trade on Vestige
                  </a>
                  <a
                    href="https://app.tinyman.org/#/swap?asset_in=0&asset_out=2637649940"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-500/20 hover:border-blue-500/40 text-gray-200 hover:text-white transition-all duration-300 backdrop-blur-sm"
                  >
                    Trade on Tinyman
                  </a>
                </div>
              </div>
            </div>
          </OnboardingStep>
        </div>

        <motion.section
          className="mt-16 bg-gray-800/50 rounded-lg p-8 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h3 className="text-2xl font-semibold mb-4 text-blue-400 text-center">Join the HODL Community</h3>
          <p className="mb-6 text-gray-300 text-center">
            Connect with fellow HODLers, stay updated on the latest news, and get support from our vibrant community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
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
        </motion.section>
      </main>

      {/* Add padding to account for mobile navigation */}
      <footer className="py-12 pb-28 md:pb-12 border-t border-blue-500/10 bg-black/50 backdrop-blur-sm relative z-40">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            Created by{" "}
            <a
              href="https://app.nf.domains/name/gabriel.algo"
              className="text-blue-400 hover:text-blue-500 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              gabriel.algo
            </a>
          </p>
        </div>
      </footer>

      {isMobile && isHydrated && (
        <MobileBottomNav onScrollTop={scrollToTop} showScrollTop={true} variant="onboarding" />
      )}
    </div>
  )
}

// Add proper type annotations for the OnboardingStep component
interface OnboardingStepProps {
  stepNumber: number
  title: string
  description: string
  children: React.ReactNode
  delay: number
}

function OnboardingStep({ stepNumber, title, description, children, delay }: OnboardingStepProps) {
  return (
    <motion.section
      className="bg-gray-800/50 rounded-lg p-8 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex items-center mb-4">
        <div className="bg-[#0a1525] rounded-full w-10 h-10 flex items-center justify-center mr-4 border border-blue-500/20">
          <span className="text-white font-bold text-lg -mt-0.5">{stepNumber}</span>
        </div>
        <h3 className="text-2xl font-semibold text-blue-400">{title}</h3>
      </div>
      <p className="mb-6 text-gray-300">{description}</p>
      {children}
    </motion.section>
  )
}