// src/hooks/useXSession.ts
'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth.store'

export function useXSession() {
  const {
    session,
    isLoading,
    fetchSession,
    signOutX: storeSignOutX
  } = useAuthStore()

  // The fetchSession is already called in useSIWE, but we can keep it here
  // for hook independence. Zustand will prevent duplicate fetches if called closely.
  useEffect(() => {
    // Only fetch if the session hasn't been loaded yet.
    if (isLoading) {
      fetchSession()
    }
    window.addEventListener('focus', fetchSession)
    return () => window.removeEventListener('focus', fetchSession)
  }, [fetchSession, isLoading])

  const signOutX = async () => {
    return storeSignOutX()
  }

  return {
    session: session?.x ?? null,
    isLoading,
    signOutX,
    isXAuthenticated: !!session?.x?.accessToken
  }
}
