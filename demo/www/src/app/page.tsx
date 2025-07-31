'use client'

import { Hero } from '@/components/hero'
import { Marketplace } from '@/components/marketplace'
import { UseCases } from '@/components/use-cases'
import { useSIWE } from '@/hooks/useSIWE'
import { useXSession } from '@/hooks/useXSession'
import { UserDashboard } from '@/components/dashboard'
import * as React from 'react'

const Home = () => {
  const { isAuthenticated } = useSIWE()
  const { isXAuthenticated } = useXSession()
  const isAuthed = isAuthenticated || isXAuthenticated

  return (
    <div className='container mx-auto px-4'>
      <Hero />
      {isAuthed && (
        <>
          <Marketplace />
          <UserDashboard />
        </>
      )}
      <UseCases />
    </div>
  )
}

export default Home
