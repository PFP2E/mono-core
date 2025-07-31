// src/hooks/use-wallet.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAccount, useConnect, useDisconnect, type Connector } from 'wagmi'
import { wallets } from '@/config/wallet'

export function useWallet() {
  const [isClient, setIsClient] = useState(false)
  const [isModalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const account = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()

  useEffect(() => {
    if (account.status === 'connected' && isModalOpen) {
      setModalOpen(false)
    }
  }, [account.status, isModalOpen])

  const getWalletConfig = useCallback((connectorId: string) => {
    const lowerId = connectorId.toLowerCase()
    return (
      wallets.find(
        wallet =>
          wallet.id.toLowerCase() === lowerId ||
          (lowerId.includes(wallet.id.toLowerCase()) &&
            wallet.id !== 'injected')
      ) || wallets.find(w => w.id === 'injected')!
    )
  }, [])

  const formatAddress = (address: string) => {
    if (!address) return 'Unknown address'
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return {
    isClient,
    account,
    connectors,
    status,
    error,
    connect: (connector: Connector) => connect({ connector }),
    disconnect: () => disconnect(),
    formattedAddress: account.address
      ? formatAddress(account.address)
      : undefined,
    isModalOpen,
    setModalOpen,
    getWalletConfig
  }
}
