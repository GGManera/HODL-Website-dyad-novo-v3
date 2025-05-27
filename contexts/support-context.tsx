"use client"

import { createIsolatedContext } from "@/lib/context-isolation"
import { useState, type ReactNode } from "react"

interface SupportModalContextType {
  isModalOpen: boolean
  setModalOpen: (isOpen: boolean) => void
}

// Create isolated context
const { Provider, useContext } = createIsolatedContext<SupportModalContextType>(
  {
    isModalOpen: false,
    setModalOpen: () => {},
  },
  "SupportModalContext",
)

export function SupportModalProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setModalOpen] = useState(false)

  return (
    <Provider
      value={{
        isModalOpen,
        setModalOpen,
      }}
    >
      {children}
    </Provider>
  )
}

export function useSupportModal() {
  return useContext()
}
