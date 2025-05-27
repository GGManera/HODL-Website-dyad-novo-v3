"use client"

import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

export default function FloatingMenuButton() {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    // Fechar o menu quando a rota mudar
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLinkClick = () => {
    setIsOpen(false)
    window.scrollTo({ top: 0 })

    // Set internal navigation flag when navigating within the site
    if (typeof window !== "undefined") {
      sessionStorage.setItem("nft-internal-navigation", "true")
    }
  }

  // Definir os links de navegação (mesmos do MobileMenu original)
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/onboarding", label: "Get Started" },
    { href: "/support", label: "Support", external: false, prefetch: true },
    { href: "/nfts", label: "NFTs", external: false, prefetch: true },
    { href: "https://whitepaper.hodlcoin.co", label: "Whitepaper", external: true },
    { href: "https://dashboard.hodlcoin.co", label: "Dashboard", external: true },
    { href: "https://game.hodlcoin.co", label: "Game", external: true },
    { href: "https://heroes.hodlcoin.co", label: "Leaderboard", external: true, sameTab: true },
  ]

  // Invertemos a ordem dos links para que apareçam de baixo para cima
  const displayLinks = [...navLinks].reverse()

  return (
    <>
      <div className="fixed md:hidden z-40 bottom-24 right-4" ref={buttonRef}>
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800/40 backdrop-blur-sm text-white shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <X size={18} opacity={0.7} /> : <Menu size={18} opacity={0.7} />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            className="fixed md:hidden bottom-[81px] right-[76px] bg-gray-900/80 backdrop-blur-sm rounded-lg z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col space-y-4 items-end text-right p-4">
              {displayLinks.map((link) => {
                const isActive = pathname === link.href
                const isExternal = link.external

                if (isActive) {
                  return (
                    <span key={link.href} className="text-blue-400 cursor-default select-none font-medium">
                      {link.label}
                    </span>
                  )
                }

                if (isExternal) {
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      className="text-white hover:text-blue-400 transition-colors duration-300"
                      target={link.sameTab ? "_self" : "_blank"}
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  )
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-white hover:text-blue-400 transition-colors duration-300"
                    onClick={handleLinkClick}
                    prefetch={link.prefetch}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
