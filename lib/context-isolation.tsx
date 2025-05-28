"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useRef } from "react"

// Create a registry to track context instances
const contextRegistry = new Map()

// This is a higher-order function that creates isolated context providers
export function createIsolatedContext<T>(defaultValue: T, displayName: string) {
  // Check if this context already exists in our registry
  if (contextRegistry.has(displayName)) {
    return contextRegistry.get(displayName)
  }

  // Create a new context
  const Context = createContext<T>(defaultValue)
  Context.displayName = displayName

  // Create a provider component that ensures isolation
  const IsolatedProvider: React.FC<{
    value: T
    children: React.ReactNode
  }> = ({ value, children }) => {
    const mountedRef = useRef(true)

    // Clean up on unmount
    useEffect(() => {
      return () => {
        mountedRef.current = false
      }
    }, [])

    return <Context.Provider value={value}>{children}</Context.Provider>
  }

  // Create a custom hook to use this context
  const useIsolatedContext = () => {
    const context = useContext(Context)
    if (context === undefined) {
      throw new Error(`use${displayName} must be used within a ${displayName}Provider`)
    }
    return context
  }

  // Store in registry
  const contextPackage = {
    Context,
    Provider: IsolatedProvider,
    useContext: useIsolatedContext,
  }

  contextRegistry.set(displayName, contextPackage)

  return contextPackage
}

// Helper to create a simple state context with provider
export function createStateContext<T>(initialState: T, displayName: string) {
  const { Context, Provider } = createIsolatedContext<{
    state: T
    setState: React.Dispatch<React.SetStateAction<T>>
  }>(
    {
      state: initialState,
      setState: () => initialState,
    },
    displayName,
  )

  const StateProvider: React.FC<{
    initialState?: T
    children: React.ReactNode
  }> = ({ initialState: propInitialState, children }) => {
    const initialStateValue = propInitialState !== undefined ? propInitialState : initialState
    const [state, setState] = useState<T>(initialStateValue)

    return <Provider value={{ state, setState }}>{children}</Provider>
  }

  const useStateContext = () => useContext(Context)

  return {
    Provider: StateProvider,
    useContext: useStateContext,
  }
}
