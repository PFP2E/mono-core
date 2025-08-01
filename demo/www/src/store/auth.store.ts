// src/store/auth.store.ts
import { create } from 'zustand'
import { SiweMessage } from 'siwe'
import { SessionData } from '@/lib/session'
import logger from '@/lib/logger'

interface AuthState {
  session: SessionData | null
  isLoading: boolean
  error: Error | null
  fetchSession: () => Promise<void>
  signIn: (
    signMessageAsync: (args: { message: string }) => Promise<`0x${string}`>,
    address: `0x${string}`,
    chainId: number
  ) => Promise<boolean>
  signOut: () => Promise<void>
  signOutX: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  isLoading: true,
  error: null,

  fetchSession: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch('/api/auth/me')
      if (!res.ok) throw new Error('Failed to fetch session')
      const json = await res.json()
      set({ session: json, isLoading: false })
    } catch (error) {
      set({ session: null, isLoading: false, error: error as Error })
      logger.error('Failed to fetch user session:', error)
    }
  },

  signIn: async (signMessageAsync, address, chainId) => {
    set({ isLoading: true, error: null })
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

      await get().fetchSession() // Re-fetch session to get latest data
      return true
    } catch (error) {
      set({ isLoading: false, error: error as Error })
      logger.error('SIWE sign-in failed:', error)
      return false
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null })
    try {
      await fetch('/api/auth/logout')
      // Optimistically update the session to null
      set({ session: null, isLoading: false })
    } catch (error) {
      set({ isLoading: false, error: error as Error })
      logger.error('SIWE sign-out failed:', error)
    }
  },

  signOutX: async () => {
    set({ isLoading: true, error: null })
    try {
      await fetch('/api/auth/logout?method=x')
      // Optimistically update the session by removing the 'x' part
      set(state => ({
        session: { ...state.session, x: undefined } as SessionData,
        isLoading: false
      }))
    } catch (error) {
      set({ isLoading: false, error: error as Error })
      logger.error('X sign-out failed:', error)
    }
  }
}))
