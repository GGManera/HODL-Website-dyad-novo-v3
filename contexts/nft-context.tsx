"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"
import { getCreatedAssets, getAssetDetails } from "@/lib/api"
import { IsolatedProvider } from "@/lib/react-isolation"

interface NFTContextType {
  nfts: any[]
  isLoading: boolean
  hasInitialLoad: boolean
  isRefresh: boolean
  loadingProgress: number
  resetForRefresh: () => void
  setInternalNavigation: (value: boolean) => void
}

// Criar um contexto com valor padrão
const NFTContext = createContext<NFTContextType>({
  nfts: [],
  isLoading: true,
  hasInitialLoad: false,
  isRefresh: false,
  loadingProgress: 0,
  resetForRefresh: () => {},
  setInternalNavigation: () => {},
})

// Definir displayName para ajudar na depuração
NFTContext.displayName = "NFTContext"

export function NFTProvider({ children }: { children: ReactNode }) {
  // Gerenciamento de estado
  const [nfts, setNfts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefresh, setIsRefresh] = useState(false)
  const [hasInitialLoad, setHasInitialLoad] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  // Refs para limpeza
  const timeoutsRef = useRef<NodeJS.Timeout[]>([])
  const mountedRef = useRef(true)

  // Verificar se é um refresh
  useEffect(() => {
    // Garantir que estamos no lado do cliente
    if (typeof window === "undefined") return

    // Definir estado montado imediatamente para evitar flicker
    setIsMounted(true)
    mountedRef.current = true

    // Verificar se é um refresh com try/catch
    try {
      const isRefreshFlag = sessionStorage.getItem("is-refresh") === "true"
      setIsRefresh(isRefreshFlag)

      // Verificar carregamento inicial
      const storedInitialLoad = localStorage.getItem("nft-initial-load")
      setHasInitialLoad(storedInitialLoad === "true")
    } catch (e) {
      console.error("Erro ao acessar storage:", e)
    }

    // Limpar timeouts ao desmontar
    return () => {
      mountedRef.current = false
      setIsMounted(false)

      timeoutsRef.current.forEach(clearTimeout)
      timeoutsRef.current = []

      // Forçar limpeza de animações ou efeitos persistentes
      if (typeof window !== "undefined") {
        const highestId = setTimeout(() => {}, 0)
        for (let i = 0; i < highestId; i++) {
          clearTimeout(i)
          clearInterval(i)
        }
      }
    }
  }, [])

  // Resetar para refresh
  const resetForRefresh = () => {
    if (!mountedRef.current) return
    setIsRefresh(true)
    setIsLoading(false)
  }

  // Definir flag de navegação interna
  const setInternalNavigation = (value: boolean) => {
    if (!isMounted || !mountedRef.current) return

    try {
      if (value) {
        sessionStorage.setItem("nft-internal-navigation", "true")
      } else {
        sessionStorage.removeItem("nft-internal-navigation")
      }
    } catch (e) {
      console.error("Erro ao acessar sessionStorage:", e)
    }
  }

  // Buscar NFTs com melhor limpeza
  useEffect(() => {
    if (!isMounted || !mountedRef.current) return

    let isCancelled = false
    let activeTimeouts: NodeJS.Timeout[] = []

    const fetchNFTs = async () => {
      try {
        // Verificar cache primeiro
        try {
          const cachedData = localStorage.getItem("nft-data")
          const cacheTimestamp = localStorage.getItem("nft-data-timestamp")

          if (cachedData && cacheTimestamp) {
            const parsedData = JSON.parse(cachedData)
            const timestamp = Number.parseInt(cacheTimestamp, 10)
            const fiveMinutesAgo = Date.now() - 5 * 60 * 1000

            if (timestamp > fiveMinutesAgo && parsedData.length > 0) {
              if (!isCancelled && mountedRef.current) {
                setNfts(parsedData)
                setIsLoading(false)
                setHasInitialLoad(true)
                setLoadingProgress(100)
              }
              return
            }
          }
        } catch (e) {
          console.error("Erro ao ler do cache:", e)
        }

        // Buscar dados se o cache for inválido ou estiver faltando
        if (isCancelled || !mountedRef.current) return
        setLoadingProgress(10)

        const assets = await getCreatedAssets()
        if (isCancelled || !mountedRef.current) return

        setLoadingProgress(50)

        const detailPromises = assets.map(async (asset, index) => {
          const detail = await getAssetDetails(asset.index)
          if (!isCancelled && mountedRef.current) {
            setLoadingProgress(50 + Math.floor((index / assets.length) * 50))
          }
          return detail
        })

        const details = await Promise.all(detailPromises)
        if (isCancelled || !mountedRef.current) return

        const validDetails = details.filter(Boolean)

        if (!isCancelled && mountedRef.current) {
          setNfts(validDetails)
          setIsLoading(false)
          setHasInitialLoad(true)
          setIsRefresh(false)
          setLoadingProgress(100)

          // Atualizar cache
          try {
            localStorage.setItem("nft-initial-load", "true")
            localStorage.setItem("nft-data", JSON.stringify(validDetails))
            localStorage.setItem("nft-data-timestamp", Date.now().toString())
          } catch (e) {
            console.error("Erro ao escrever no cache:", e)
          }
        }
      } catch (error) {
        console.error("Erro ao buscar NFTs:", error)
        if (!isCancelled && mountedRef.current) {
          setIsLoading(false)
          setIsRefresh(false)
          setLoadingProgress(100)
        }
      }
    }

    // Definir um pequeno atraso para garantir que a renderização do lado do cliente esteja completa
    const fetchTimeout = setTimeout(() => {
      if (mountedRef.current) {
        fetchNFTs()
      }
    }, 100)
    activeTimeouts.push(fetchTimeout)

    // Timeout de segurança para evitar carregamento infinito
    const safetyTimeout = setTimeout(() => {
      if (!isCancelled && mountedRef.current && isLoading) {
        console.log("Timeout de segurança acionado para carregamento de NFT")
        setIsLoading(false)
        setLoadingProgress(100)
      }
    }, 10000)
    activeTimeouts.push(safetyTimeout)

    return () => {
      isCancelled = true

      // Limpar todos os timeouts ativos
      activeTimeouts.forEach((timeout) => clearTimeout(timeout))
      activeTimeouts = []
    }
  }, [isMounted]) // Remover dependência isLoading para evitar re-renderizações

  // Criar valor do contexto
  const contextValue: NFTContextType = {
    nfts,
    isLoading,
    hasInitialLoad,
    isRefresh,
    loadingProgress,
    resetForRefresh,
    setInternalNavigation,
  }

  return (
    <IsolatedProvider context={NFTContext} value={contextValue}>
      {children}
    </IsolatedProvider>
  )
}

// Exportar o hook
export function useNFTs() {
  return useContext(NFTContext)
}
