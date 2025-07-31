// src/hooks/useSIWE.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAccount, useSignMessage, useChainId } from 'wagmi'
import { SiweMessage } from 'siwe'
import { SessionData } from '@/lib/session'

export function useSIWE() {
  const { address } = useAccount()
  const chainId = useChainId()
  const { signMessageAsync } = useSignMessage()

  const [session, setSession] = useState<SessionData['siwe'] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSession = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/auth/me')
      const json = await res.json()
      setSession(json.siwe || null)
    } catch {
      setSession(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSession()
    window.addEventListener('focus', fetchSession)
    return () => window.removeEventListener('focus', fetchSession)
  }, [fetchSession])

  const signIn = useCallback(async () => {
    if (!address || !chainId) return false
    setIsLoading(true)
    setError(null)
    try {
      const nonceRes = await fetch('/api/auth/nonce')
      const nonce = await nonceRes.text()

      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce
      })

      const signature = await signMessageAsync({
        message: message.prepareMessage()
      })

      const verifyRes = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, signature })
      })

      if (!verifyRes.ok) throw new Error('Error verifying signature.')

      await fetchSession()
      return true
    } catch (e: unknown) {
      setError(e as Error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [address, chainId, signMessageAsync, fetchSession])

  const signOut = useCallback(async () => {
    setIsLoading(true)
    try {
      await fetch('/api/auth/logout')
      setSession(null)
    } catch (e: unknown) {
      setError(e as Error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    session,
    isLoading,
    error,
    signIn,
    signOut,
    isAuthenticated: !!session
  }
}
