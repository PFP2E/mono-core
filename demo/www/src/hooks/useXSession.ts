// src/hooks/useXSession.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { SessionData } from '@/lib/session'

export function useXSession() {
  const [session, setSession] = useState<SessionData['x'] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchSession = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/me')
      const json = await res.json()
      setSession(json.x || null)
    } catch (e) {
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

  const signOutX = useCallback(async () => {
    setIsLoading(true)
    try {
      await fetch('/api/logout?method=x')
      setSession(null)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    session,
    isLoading,
    signOutX,
    isXAuthenticated: !!session
  }
}
