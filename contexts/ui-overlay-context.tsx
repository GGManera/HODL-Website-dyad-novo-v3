"use client"

import { createIsolatedContext } from "@/lib/context-isolation"
import { useState, type ReactNode } from "react"

interface UIOverlayContextType {
  isOverlayActive: boolean
  setOverlayActive: (isActive: boolean) => void
}

// Create isolated context
const { Provider, useContext } = createIsolatedContext<UIOverlayContextType>(
  {
    isOverlayActive: false,
    setOverlayActive: () => {},
  },
  "UIOverlayContext",
)

export function UIOverlayProvider({ children }: { children: ReactNode }) {
  const [isOverlayActive, setOverlayActive] = useState(false)

  return (
    <Provider
      value={{
        isOverlayActive,
        setOverlayActive,
      }}
    >
      {children}
    </Provider>
  )
}

export function useUIOverlay() {
  return useContext()
}