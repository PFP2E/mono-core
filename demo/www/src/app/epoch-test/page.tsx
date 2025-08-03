// src/app/epoch-test/page.tsx
'use client'

import { useReadContract } from 'wagmi'
import { abi as MERKLE_DISTRIBUTOR_ABI } from '@pfp2e/contracts/artifacts/contracts/MerkleDistributor.sol/MerkleDistributor.json'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const MERKLE_DISTRIBUTOR_ADDRESS = process.env.NEXT_PUBLIC_MERKLE_DISTRIBUTOR_ADDRESS as `0x${string}`

function EpochTestPage() {
  const { data: epoch, error, isLoading, refetch } = useReadContract({
    abi: MERKLE_DISTRIBUTOR_ABI,
    address: MERKLE_DISTRIBUTOR_ADDRESS,
    functionName: 'currentEpoch',
  })

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-6'>
        <Button variant='outline' asChild>
          <Link href='/'>← Back Home</Link>
        </Button>
      </div>
      <Card className='mx-auto max-w-md'>
        <CardHeader>
          <CardTitle>On-Chain Epoch Test</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p>
            This page reads the <code>currentEpoch</code> directly from the deployed{' '}
            <code>MerkleDistributor</code> contract to verify the frontend is
            connected to your local Hardhat node.
          </p>
          <div className='rounded-lg border bg-muted/50 p-4'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Contract Address:</span>
              <code className='text-sm'>{MERKLE_DISTRIBUTOR_ADDRESS}</code>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Current Epoch:</span>
              {isLoading && <span className='text-sm'>Loading...</span>}
              {error && <span className='text-destructive text-sm'>Error: {error.message}</span>}
              {epoch !== undefined && <span className='text-lg font-bold'>{epoch.toString()}</span>}
            </div>
          </div>
          <Button onClick={() => refetch()} className='w-full'>
            Refresh
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default EpochTestPage
