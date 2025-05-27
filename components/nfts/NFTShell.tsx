"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { NFTProvider } from "@/contexts/nft-context"
import AppWrapper from "@/components/AppWrapper"

// Componente de carregamento
const LoadingFallback = () => (
  <div className="min-h-screen bg-[#0a1525] text-white pt-16 flex flex-col items-center justify-center">
    <div className="container mx-auto px-4 py-24 flex flex-col items-center">
      <div className="relative w-16 h-16 mb-8">
        <div className="absolute inset-0 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 border-4 border-blue-400/30 rounded-full"></div>
      </div>
      <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Loading NFTs...
      </h2>
    </div>
  </div>
)

// Importar dinamicamente o componente da página NFT sem SSR
const NFTClientPage = dynamic(() => import("./NFTClientPage"), {
  ssr: false,
  loading: LoadingFallback,
})

export default function NFTShell() {
  const [hydrated, setHydrated] = useState(false)
  const instanceIdRef = useRef(`nft-shell-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`)
  const mountedRef = useRef(true)

  // Esperar pela hidratação para completar
  useEffect(() => {
    // Definir estado hidratado para acionar a renderização
    setHydrated(true)

    // Definir flag de montado
    mountedRef.current = true

    // Resetar posição de scroll
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0)

      // Limpar qualquer estado obsoleto
      try {
        // Criar um ID de instância novo para evitar colisões
        const freshId = `nft-shell-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        instanceIdRef.current = freshId
      } catch (e) {
        console.error("Falha ao criar ID de instância:", e)
      }
    }

    return () => {
      // Marcar componente como desmontado imediatamente para evitar atualizações de estado
      mountedRef.current = false

      // Realizar limpeza de emergência
      if (typeof window !== "undefined") {
        // Limpar todos os timeouts e intervals possíveis
        const highestId = setTimeout(() => {}, 0)
        for (let i = 0; i < highestId; i++) {
          clearTimeout(i)
          clearInterval(i)
        }

        // Limpar quaisquer flags de armazenamento de sessão
        try {
          sessionStorage.removeItem("nft-internal-navigation")
          sessionStorage.removeItem("is-refresh")
        } catch (e) {
          console.error("Erro ao limpar:", e)
        }
      }
    }
  }, [])

  // Renderizar apenas o componente cliente após hidratação
  if (!hydrated) {
    return <LoadingFallback />
  }

  // Criar um novo NFTProvider para cada instância
  return (
    <AppWrapper>
      <NFTProvider key={instanceIdRef.current}>
        <NFTClientPage key={instanceIdRef.current} instanceId={instanceIdRef.current} />
      </NFTProvider>
    </AppWrapper>
  )
}
