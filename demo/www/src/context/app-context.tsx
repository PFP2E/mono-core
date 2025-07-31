'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

// Mock user data for the demo
const mockUser = {
  name: 'Hackathon Judge',
  handle: '@ethglobal',
  avatarUrl: 'https://github.com/ethglobal.png'
}

interface AppContextType {
  isConnected: boolean
  user: typeof mockUser | null
  connect: () => void
  disconnect: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [user, setUser] = useState<typeof mockUser | null>(null)

  const connect = () => {
    setIsConnected(true)
    setUser(mockUser)
  }

  const disconnect = () => {
    setIsConnected(false)
    setUser(null)
  }

  return (
    <AppContext.Provider value={{ isConnected, user, connect, disconnect }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
