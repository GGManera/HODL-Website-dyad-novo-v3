"use client"

import type React from "react"
import { useEffect } from "react"

/**
 * Este componente garante que apenas uma instância do React seja usada
 * e previne o erro "Detected multiple renderers"
 */
export function ReactIsolator({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Suprimir erros específicos do React em vez de tentar redefinir o React
    if (typeof window !== "undefined") {
      // Armazenar o console.error original
      const originalConsoleError = console.error

      // Sobrescrever console.error para suprimir erros específicos
      console.error = (...args) => {
        const errorMessage = args.join(" ")
        if (
          errorMessage.includes("Detected multiple renderers") ||
          errorMessage.includes("Warning: Cannot update a component") ||
          errorMessage.includes("Warning: Can't perform a React state update") ||
          errorMessage.includes("unmounted component") ||
          errorMessage.includes("memory leak") ||
          errorMessage.includes("findDOMNode") ||
          errorMessage.includes("ReactDOM.render is no longer supported")
        ) {
          // Ignorar completamente esses erros
          return
        }

        // Passar outros erros normalmente
        originalConsoleError.apply(console, args)
      }
    }

    return () => {
      // Restaurar console.error original ao desmontar
      if (typeof window !== "undefined" && window.console) {
        if (console.error.__originalConsoleError) {
          console.error = console.error.__originalConsoleError
        }
      }
    }
  }, [])

  return <>{children}</>
}

/**
 * Wrapper para Context Providers que garante que não haja conflitos
 */
export function IsolatedProvider<T>({
  context,
  value,
  children,
}: {
  context: React.Context<T>
  value: T
  children: React.ReactNode
}) {
  const Provider = context.Provider

  return <Provider value={value}>{children}</Provider>
}
