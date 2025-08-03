// src/app/providers.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, useState, useEffect } from 'react'
import { type State, WagmiProvider } from 'wagmi'
import { config } from '@/config/wagmi-config'

export function Providers(props: {
  children: ReactNode
  initialState?: State
}) {
  const [queryClient] = useState(() => new QueryClient())
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <WagmiProvider config={config} initialState={props.initialState}>
      <QueryClientProvider client={queryClient}>
        {mounted && props.children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
