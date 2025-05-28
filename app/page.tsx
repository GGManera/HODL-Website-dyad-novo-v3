"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowDown } from "lucide-react"
import { Raleway } from "next/font/google"
import { useMediaQuery } from "@/hooks/use-media-query"
import Link from "next/link"
import { motion, useScroll, useTransform, useSpring, useReducedMotion, AnimatePresence } from "framer-motion"
import MobileBottomNav from "@/components/MobileBottomNav"
import Image from "next/image"
import dynamic from "next/dynamic"
import AboutCreator from "@/components/AboutCreator"

// IMPORTANT: AboutCreator component has been removed from this file

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-raleway",
})

// Smooth spring configuration for natural movement
const springConfig = {
  stiffness: 100,
  damping: 30,
  mass: 1,
}

function LinkButton({ href, text, sameTab }: { href: string; text: string; sameTab?: boolean }) {
  return (
    <motion.a
      href={href}
      target={sameTab ? "_self" : "_blank"}
      rel="noopener noreferrer"
      className="block w-full px-4 py-3 text-center rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-500/20 hover:border-blue-500/40 text-gray-200 hover:text-white transition-colors duration-300 backdrop-blur-sm font-sans"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={springConfig}
    >
      {text}
    </motion.a>
  )
}

function LinkGroup({
  title,
  links,
  index,
}: {
  title: string
  links: Array<{ href: string; text: string; sameTab?: boolean }>
  index: number
}) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      // Removed initial prop, relying on whileInView
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ ...springConfig, delay: index * 0.1 }}
      className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/10"
    >
      <h3 className="text-xl font-semibold mb-6 text-center text-blue-400 font-raleway">{title}</h3>
      <div className="space-y-3">
        {links.map((link, index) => (
          <LinkButton key={index} href={link.href} text={link.text} sameTab={link.sameTab} />
        ))}
      </div>
    </motion.div>
  )
}

// Dynamically import heavy components
const Sparkles = dynamic(() => import("@/components/Sparkles"), {
  ssr: false,
})

export default function Home() {
  const [copied, setCopied] = useState(false)
  const [isUltrawide, setIsUltrawide] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const shouldReduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const mainRef = useRef(null)

  // Smooth scroll progress for parallax effects
  const smoothScrollY = useSpring(scrollY, springConfig)

  // Transform values for parallax effects
  const logoScale = useTransform(smoothScrollY, [0, 300], [1, 0.8])
  const logoOpacity = useTransform(smoothScrollY, [0, 300], [1, 0.6])
  const titleY = useTransform(smoothScrollY, [0, 300], [0, 50])
  const heroOpacity = useTransform(smoothScrollY, [0, 300], [1, 0.2])

  useEffect(() => {
    const handleResize = () => {
      const aspectRatio = window.innerWidth / window.innerHeight
      setIsUltrawide(aspectRatio > 21 / 9)
    }

    // Disable browser's automatic scroll restoration
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual"
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Add this useEffect near the other useEffect hooks
  useEffect(() => {
    // Handle page refresh - reset to top
    if (typeof window !== "undefined") {
      // Check if this is a page refresh
      const isRefresh = performance.navigation && performance.navigation.type === 1

      // If it's a refresh or initial load, scroll to top
      if (isRefresh || window.history.scrollRestoration) {
        window.scrollTo(0, 0)
        // Disable the browser's automatic scroll restoration
        if ("scrollRestoration" in history) {
          history.scrollRestoration = "manual"
        }
      }
    }
  }, [])

  const handleCopyCA = async () => {
    try {
      await navigator.clipboard.writeText("2637649940")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const scrollToContent = () => {
    const contentSection = document.getElementById("content")
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Staggered animation variants for features
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: springConfig,
    },
  } // Removed the trailing comma here

  return (
    <AnimatePresence>
      <motion.div
        className="min-h-screen bg-[#0a1525] text-white font-raleway"
        ref={mainRef}
        initial={{ opacity: 0 }} // Keep initial opacity animation on mount
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Logo Section */}
        <motion.div
          className="relative z-10 container mx-auto px-4 pt-28 pb-8"
          style={{ scale: logoScale, opacity: logoOpacity }}
          initial={{ scale: 0.8, opacity: 0, y: 20 }} // Set a fixed initial state
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.div
            className="flex justify-center"
            initial={{ scale: 0.8, opacity: 0 }} // Set a fixed initial state
            animate={{ scale: 1, opacity: 1 }}
            transition={{ ...springConfig, duration: 0.8 }}
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/HODL%20AVATAR.jpg-KKQIRhMfH2UcXfORK5liqDXPmfhgDX.jpeg"
              alt="HODL Logo"
              width={150}
              height={150}
              className="rounded-full border-4 border-blue-500/20 shadow-lg shadow-blue-500/20"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Hero Section */}
        <motion.section
          className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-32"
          style={{ opacity: heroOpacity }}
          initial={{ opacity: 0 }} // Keep initial opacity animation
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />

          {/* Hero Content */}
          <motion.div
            className="relative z-5 container mx-auto px-4 text-center"
            style={{ y: titleY }}
            initial={{ opacity: 0, y: 20 }} // Set a fixed initial state
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig, duration: 1, delay: 0.3 }}
          >
            {isMobile ? (
              <div className="space-y-6 -mt-32 w-full">
                <motion.div
                  className="hero-title-container mb-2 text-center"
                  initial={{ opacity: 0, y: 20 }} // Set a fixed initial state
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springConfig, duration: 0.8, delay: 0.5 }}
                >
                  <h1 className="mx-auto text-[min(8vw,4rem)] font-bold tracking-[-0.03em] gradient-heading font-raleway text-center">
                    <span className="gradient-text-fix">Heroes Of</span>
                    <br />
                    <span className="gradient-text-fix">Diamond Legacy</span>
                  </h1>
                </motion.div>

                <motion.p
                  className="text-xl md:text-2xl hero-subtitle max-w-2xl mx-auto px-4"
                  initial={{ opacity: 0, y: 20 }} // Set a fixed initial state
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springConfig, duration: 0.8, delay: 0.7 }}
                >
                  Honoring those who endure and rise through the power of resilience.
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                  initial={{ opacity: 0, y: 20 }} // Set a fixed initial state
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springConfig, duration: 0.8, delay: 0.9 }}
                >
                  <motion.a
                    href="https://vestige.fi/asset/2637649940"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-blue-400 transition-colors duration-300 text-lg font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Buy & HODL
                  </motion.a>
                </motion.div>
                <motion.div
                  className="mt-8 flex justify-center"
                  initial={{ opacity: 0 }} // Set a fixed initial state
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  <motion.div
                    className="cursor-pointer"
                    onClick={scrollToContent}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{ y: [0, 8, 0] }}
                    transition={{
                      y: {
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      },
                    }}
                  >
                    <ArrowDown className="w-8 h-8 text-blue-400" />
                  </motion.div>
                </motion.div>
              </div>
            ) : (
              <div className="space-y-6 -mt-32">
                <motion.div
                  className="hero-title-container mb-2"
                  initial={{ opacity: 0, y: 20 }} // Set a fixed initial state
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springConfig, duration: 0.8, delay: 0.5 }}
                >
                  <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight gradient-heading font-raleway mt-2">
                    <span className="gradient-text-fix">Heroes Of Diamond Legacy</span>
                  </h1>
                </motion.div>

                <motion.p
                  className="text-xl md:text-2xl hero-subtitle max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }} // Set a fixed initial state
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springConfig, duration: 0.8, delay: 0.7 }}
                >
                  Honoring those who endure and rise through the power of resilience.
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                  initial={{ opacity: 0, y: 20 }} // Set a fixed initial state
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springConfig, duration: 0.8, delay: 0.9 }}
                >
                  <motion.a
                    href="https://vestige.fi/asset/2637649940"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-blue-400 transition-colors duration-300 text-lg font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Buy & HODL
                  </motion.a>
                </motion.div>
                <motion.div
                  className="mt-8 flex justify-center"
                  initial={{ opacity: 0 }} // Set a fixed initial state
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  <motion.div
                    className="cursor-pointer"
                    onClick={scrollToContent}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{ y: [0, 8, 0] }}
                    transition={{
                      y: {
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      },
                    }}
                  >
                    <ArrowDown className="w-8 h-8 text-blue-400" />
                  </motion.div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </motion.section>

        {/* Main Content Wrapper with Continuous Background */}
        <div className="relative bg-gradient-to-b from-[#0a1525] via-gray-900/90 to-black/90">
          {/* Features Section */}
          <motion.section
            className="py-16 relative overflow-hidden"
            variants={containerVariants}
            initial="hidden" // Keep initial="hidden" for staggered animation
            whileInView="visible"
            viewport={{ once: true }}
            id="content"
          >
            <div className="container mx-auto px-4">
              <motion.div className="text-center mb-12" variants={itemVariants}>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-heading font-sans">
                  <span className="gradient-text-fix">Why Choose HODL?</span>
                </h2>
                <p className="text-gray-300 max-w-2xl mx-auto text-lg font-raleway">
                  Join a community of dedicated holders who understand the value of patience and long-term vision.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Algorand is Home. But Not the Cage.",
                    description:
                      "$HODL leverages Algorand's advanced, secure, and energy-efficient blockchain infrastructure, ensuring rapid transactions, minimal fees, and seamless integration within our ecosystem. Despite its roots on Algorand, $HODL was never about tribalism. We’re building a multichain ecosystem that honors those who came first, while opening the door to communities aligned with a vision that transcends maximalism.",
                    link: { href: "https://algorand.co", text: "algorand.co" },
                  },
                  {
                    title: "Evolving Art, Month by Month.",
                    description:
                      "Each month, a new artist joins the $HODL movement to reinterpret our four core NFTs through a fresh lens and unique style. Guided by a collaborative curation process, every edition pushes the concept forward. Think of it as a growing gallery where every piece tells a new chapter — same Heroes, new vibes.",
                    link: { href: "/nfts", text: "NFT Gallery", isInternal: true },
                  },
                  {
                    title: "Hold. Level Up. Get Airdrops.",
                    description:
                      "Hold longer, climb higher. Our leaderboard tracks your commitment, while milestone rewards keep things spicy. This is more than a meme. It's a movement disguised as a game. Competitive? Cooperative? Both. Top holders race for prestige and the biggest milestones. And in doing so, they’re drawing a chart that only wants to go up.",
                    link: {
                      href: "https://heroes.hodlcoin.co",
                      text: "Hall Of Degen Legends",
                    },
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/10 flex flex-col h-full" // Added flex, flex-col, h-full
                  >
                    <h3 className="text-xl font-semibold mb-4 text-blue-400 font-raleway">{feature.title}</h3>
                    <div className="flex-grow"> {/* Wrapper to make content grow */}
                      <p className="text-gray-300 font-raleway mb-6 text-justify">{feature.description}</p> {/* Added text-justify */}
                    </div>
                    {feature.link.isInternal ? (
                      <Link
                        href={feature.link.href}
                        className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors duration-300 font-medium mt-auto" // Added mt-auto
                      >
                        {feature.link.text}
                      </Link>
                    ) : (
                      <a
                        href={feature.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors duration-300 font-medium mt-auto" // Added mt-auto
                      >
                        {feature.link.text}
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Links Section */}
          <section className="py-16 relative overflow-hidden">
            <div className="container mx-auto px-4">
              <motion.div
                className="text-center mb-12 pt-2"
                // Removed initial prop, relying on whileInView
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={springConfig}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6 mt-0 gradient-heading font-sans">
                  <span className="gradient-text-fix">Our Links</span>
                </h2>
                <p className="text-gray-300 max-w-2xl mx-auto text-lg font-raleway">
                  Stay updated and engaged with our growing community across various platforms.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                <LinkGroup
                  title="Profiles"
                  links={[
                    { href: "https://x.com/ALGOHODLCOIN", text: "𝕏 Twitter" },
                    { href: "https://t.me/algohodlcoin", text: "Telegram" },
                    { href: "https://app.nf.domains/name/hodl.algo", text: "hodl.algo.xyz" },
                  ]}
                  index={0}
                />
                <LinkGroup
                  title="Project"
                  links={[
                    { href: "https://dashboard.hodlcoin.co", text: "Dashboard" },
                    { href: "https://whitepaper.hodlcoin.co", text: "Whitepaper" },
                    { href: "https://heroes.hodlcoin.co", text: "Leaderboard", sameTab: true },
                  ]}
                  index={1}
                />
                <LinkGroup
                  title="Performance"
                  links={[
                    {
                      href: "https://dexscreener.com/algorand/l3dyeqmgolgbziostcuv6ke3cc5d2e5p5ro4wlrrgboagfypow4yvukoxe",
                      text: "DEX Screener",
                    },
                    { href: "https://allo.info/asset/2637649940/holders", text: "Holders" },
                  ]}
                  index={2}
                />
              </div>
            </div>
          </section>

          {/* The HODL Culture Section */}
          <motion.section
            className="py-16 relative overflow-hidden"
            // Removed initial prop, relying on whileInView
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={springConfig}
          >
            <AboutCreator />
          </motion.section>

          {/* Footer */}
          {/* Add bottom padding on mobile to account for the navigation */}
          <motion.footer
            className="py-12 pb-28 md:pb-12 border-t border-blue-500/10 backdrop-blur-sm"
            // Removed initial prop, relying on whileInView
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={springConfig}
          >
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <motion.div
                  // Removed initial prop, relying on whileInView
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...springConfig, delay: 0.1 }}
                >
                  <h4 className="text-blue-400 font-semibold mb-2 font-raleway">Creator</h4>
                  <a
                    href="https://app.nf.domains/name/gabriel.algo"
                    className="text-gray-300 hover:text-white transition-colors font-raleway"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    gabriel.algo
                  </a>
                </motion.div>
                <motion.div
                  // Removed initial prop, relying on whileInView
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...springConfig, delay: 0.2 }}
                >
                  <h4 className="text-blue-400 font-semibold mb-2 font-raleway">Asset ID</h4>
                  <a
                    href="https://allo.info/asset/2637649940/token"
                    className="text-gray-300 hover:text-white transition-colors font-raleway"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    2637649940
                  </a>
                </motion.div>
                <motion.div
                  // Removed initial prop, relying on whileInView
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...springConfig, delay: 0.3 }}
                >
                  <h4 className="text-blue-400 font-semibold mb-2 font-raleway">Ticker</h4>
                  <a
                    href="https://vestige.fi/asset/2637649940"
                    className="text-gray-300 hover:text-white transition-colors font-raleway"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    $HODL
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.footer>
        </div>

        <MobileBottomNav onScrollTop={scrollToTop} />
      </motion.div>
    </AnimatePresence>
  )
}