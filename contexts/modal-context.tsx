"use client"

import { createIsolatedContext } from "@/lib/context-isolation"
import { useState, type ReactNode } from "react"

interface ModalContextType {
  isModalOpen: boolean
  setModalOpen: (isOpen: boolean) => void
}

// Create isolated context
const { Provider, useContext } = createIsolatedContext<ModalContextType>(
  {
    isModalOpen: false,
    setModalOpen: () => {},
  },
  "ModalContext",
)

export function ModalProvider({ children }: { children: ReactNode }) {
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

export function useModal() {
  return useContext()
}
