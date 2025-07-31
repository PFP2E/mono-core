'use client'

import { Hero } from '@/components/hero'
import { Marketplace } from '@/components/marketplace'
import { UseCases } from '@/components/use-cases'
import { useAppContext } from '@/context/app-context'
import * as React from 'react'

const Home = () => {
  const { isConnected } = useAppContext()

  return (
    <div className='container mx-auto px-4'>
      {isConnected ? (
        <Marketplace />
      ) : (
        <>
          <Hero />
          <UseCases />
        </>
      )}
    </div>
  )
}

export default Home
