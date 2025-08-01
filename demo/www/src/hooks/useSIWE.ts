// src/hooks/useSIWE.ts
'use client'

import { useEffect } from 'react'
import { useAccount, useSignMessage, useChainId } from 'wagmi'
import { useAuthStore } from '@/store/auth.store'

export function useSIWE() {
  const { address } = useAccount()
  const chainId = useChainId()
  const { signMessageAsync } = useSignMessage()
  const {
    session,
    isLoading,
    error,
    fetchSession,
    signIn: storeSignIn,
    signOut: storeSignOut
  } = useAuthStore()

  // Fetch session on mount and on focus, but only if not already loading.
  // Zustand will prevent re-fetches if data is already present.
  useEffect(() => {
    if (isLoading) {
      fetchSession()
    }
    window.addEventListener('focus', fetchSession)
    return () => window.removeEventListener('focus', fetchSession)
  }, [fetchSession, isLoading])

  const signIn = async () => {
    if (!address || !chainId) return false
    return storeSignIn(signMessageAsync, address, chainId)
  }

  const signOut = async () => {
    return storeSignOut()
  }

  return {
    session: session?.siwe ?? null,
    ens: session?.ens ?? null,
    isLoading,
    error,
    signIn,
    signOut,
    isAuthenticated: !!session?.siwe
  }
}
