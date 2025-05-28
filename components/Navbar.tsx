"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import MobileMenu from "./MobileMenu"
import { motion, AnimatePresence, useScroll } from "framer-motion"
import { useUIOverlay } from "@/contexts/ui-overlay-context" // Import the hook

export default function Navbar() {
  const pathname = usePathname()
  const [scrollY, setScrollY] = useState(0)
  const { scrollY: pageScrollY } = useScroll()
  const isHome = pathname === "/"
  const { isOverlayActive } = useUIOverlay() // Use the context

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogoClick = () => {
    if (isHome) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleLinkClick = () => {
    window.scrollTo({ top: 0 })

    // Set internal navigation flag when navigating within the site
    if (typeof window !== "undefined") {
      sessionStorage.setItem("nft-internal-navigation", "true")
    }
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/onboarding", label: "Get Started" },
    { href: "/support", label: "Support", prefetch: true },
    { href: "/nfts", label: "NFTs", prefetch: true },
    { href: "https://whitepaper.hodlcoin.co", label: "Whitepaper", external: true },
    { href: "https://dashboard.hodlcoin.co", label: "Dashboard", external: true },
    { href: "https://game.hodlcoin.co", label: "Game", external: true },
    { href: "https://heroes.hodlcoin.co", label: "Leaderboard", external: true, sameTab: true },
  ]

  // Hide the navbar if an overlay is active
  if (isOverlayActive) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.header
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-[100] flex justify-between items-center p-4 sm:p-6 bg-gray-900/80 backdrop-blur-sm h-16 font-raleway"
      >
        {isHome ? (
          <motion.button
            onClick={handleLogoClick}
            className="text-xl font-bold text-white hover:text-blue-400 transition-colors duration-300 font-raleway"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            HODL
          </motion.button>
        ) : (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/"
              onClick={handleLinkClick}
              className="text-xl font-bold text-white hover:text-blue-400 transition-colors duration-300 font-raleway"
            >
              HODL
            </Link>
          </motion.div>
        )}

        <nav className="hidden md:flex space-x-4 font-raleway">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            const isExternal = link.external

            // Add prefetch by default for internal links
            const shouldPrefetch = !isExternal && link.prefetch !== false

            if (isActive) {
              return (
                <span key={link.href} className="relative text-blue-400 cursor-default select-none font-raleway">
                  {link.label}
                  <motion.div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-400" layoutId="underline" />
                </span>
              )
            }

            if (isExternal) {
              return (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="text-white hover:text-blue-400 transition-colors duration-300 font-raleway"
                  target={link.sameTab ? "_self" : "_blank"}
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.label}
                </motion.a>
              )
            }

            return (
              <motion.div key={link.href} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href={link.href}
                  onClick={handleLinkClick}
                  prefetch={shouldPrefetch}
                  className="text-white hover:text-blue-400 transition-colors duration-300 font-raleway"
                >
                  {link.label}
                </Link>
              </motion.div>
            )
          })}
        </nav>
        <div className="md:hidden">
          <MobileMenu activePath={pathname} />
        </div>
      </motion.header>
      )}
    </AnimatePresence>
  )
}