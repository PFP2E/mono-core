'use client'

import { Hero } from '@/components/hero'
import { Marketplace } from '@/components/marketplace'
import { UseCases } from '@/components/use-cases'
import { useSIWE } from '@/hooks/useSIWE'
import { useXSession } from '@/hooks/useXSession'
import dynamic from 'next/dynamic'
import * as React from 'react'

const UserDashboard = dynamic(
  () => import('@/components/dashboard').then(mod => mod.UserDashboard),
  { ssr: false }
)

const Home = () => {
  const { isAuthenticated } = useSIWE()
  const { isXAuthenticated } = useXSession()
  const isAuthed = isAuthenticated || isXAuthenticated

  return (
    <div className='container mx-auto px-4'>
      <Hero />
      {isAuthed && (
        <>
          <UserDashboard />
        </>
      )}
      <Marketplace />
      <UseCases />
    </div>
  )
}

export default Home
