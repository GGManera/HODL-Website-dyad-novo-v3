"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

// Create a custom event for menu toggling
const toggleTopMenuEvent = new CustomEvent("toggleTopMenu")

export default function MobileMenu({ activePath }: { activePath: string }) {
  const [isTopMenuOpen, setIsTopMenuOpen] = useState(false)

  // Listen for the custom event from TopFloatingMenuButton
  useEffect(() => {
    const handleTopMenuStateChange = (e: CustomEvent) => {
      // Always update the local state to match the actual menu state
      setIsTopMenuOpen(e.detail.isOpen)
    }

    // Listen for the custom event from TopFloatingMenuButton
    window.addEventListener("topMenuStateChanged", handleTopMenuStateChange as EventListener)

    // Also listen for the specific close event
    const handleCloseEvent = () => {
      setIsTopMenuOpen(false)
    }
    window.addEventListener("closeTopMenu", handleCloseEvent as EventListener)

    return () => {
      window.removeEventListener("topMenuStateChanged", handleTopMenuStateChange as EventListener)
      window.removeEventListener("closeTopMenu", handleCloseEvent as EventListener)
    }
  }, [])

  const toggleMenu = () => {
    // If the menu is already open, explicitly set it to closed
    if (isTopMenuOpen) {
      // Dispatch a specific close event instead of a toggle
      window.dispatchEvent(new CustomEvent("closeTopMenu"))
      setIsTopMenuOpen(false)
    } else {
      // Otherwise toggle as before
      window.dispatchEvent(toggleTopMenuEvent)
    }
  }

  return (
    <div className="md:hidden">
      <button onClick={toggleMenu} className="text-white p-2">
        {isTopMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
  )
}
