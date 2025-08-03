'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useXSession } from '@/hooks/useXSession'
import { DefaultService } from '@pfp2e/sdk/client'
import { useWriteContract } from 'wagmi'
import { abi as MERKLE_DISTRIBUTOR_ABI } from '@pfp2e/contracts/artifacts/contracts/MerkleDistributor.sol/MerkleDistributor.json'
import { Loader2, CheckCircle } from 'lucide-react'
import { ethers } from 'ethers'

interface ProofData {
  epoch: number;
  amount: string;
  proof: string[];
}

export const Rewards = () => {
  const searchParams = useSearchParams()
  const campaignId = searchParams.get('campaignId')
  const { session } = useXSession()
  const { writeContract, isPending, isSuccess, error } = useWriteContract()

  const [proofData, setProofData] = useState<ProofData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const pfpUrl = session?.pfpUrl || '/images/BAYCNFT/0.png'

  useEffect(() => {
    async function fetchProof() {
      if (!campaignId || !session?.username) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setFetchError(null)

      try {
        const data = await DefaultService.getV1Proof(campaignId, session.username);
        setProofData(data);
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : 'Failed to fetch proof');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProof();
  }, [campaignId, session?.username]);

  const handleClaim = () => {
    if (!proofData || !process.env.NEXT_PUBLIC_MERKLE_DISTRIBUTOR_ADDRESS) return;

    writeContract({
      abi: MERKLE_DISTRIBUTOR_ABI,
      address: process.env.NEXT_PUBLIC_MERKLE_DISTRIBUTOR_ADDRESS as `0x${string}`,
      functionName: 'claim',
      args: [
        proofData.epoch,
        session!.username!,
        proofData.amount,
        proofData.proof,
      ],
    });
  };

  return (
    <div className='space-y-6 pt-8'>
      <div className='mb-6'>
        <Button variant='outline' asChild>
          <Link href='/'>← Back to Dashboard</Link>
        </Button>
      </div>
      <h2 className='text-2xl font-bold'>Claim Your Rewards</h2>

      <Card className='mx-auto w-full max-w-md'>
        <CardHeader>
          <CardTitle>Campaign: {campaignId}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className='flex items-center justify-center p-8'>
              <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
              <p className='ml-2'>Fetching your reward details...</p>
            </div>
          )}
          {fetchError && <p className='text-destructive'>Error: {fetchError}</p>}
          {!isLoading && !fetchError && !proofData && (
            <p className='text-muted-foreground'>
              You have no rewards to claim for this campaign.
            </p>
          )}

          {proofData && (
            <div className='space-y-4'>
              <div className='flex items-center gap-4'>
                <Image
                  src={pfpUrl}
                  alt={session?.username || 'User PFP'}
                  width={64}
                  height={64}
                  className='rounded-lg'
                />
                <div>
                  <p className='text-muted-foreground'>Claiming for</p>
                  <p className='font-semibold'>@{session?.username}</p>
                </div>
              </div>

              <div className='rounded-lg border bg-muted/50 p-4'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Epoch</span>
                  <span className='font-medium'>{proofData.epoch}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Amount</span>
                  <span className='font-medium'>
                    {ethers.formatEther(proofData.amount)} RWT
                  </span>
                </div>
              </div>

              <Button
                className='w-full'
                onClick={handleClaim}
                disabled={isPending || isSuccess}
              >
                {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                {isSuccess && <CheckCircle className='mr-2 h-4 w-4' />}
                {isPending ? 'Claiming...' : isSuccess ? 'Claimed!' : 'Claim Now'}
              </Button>
              {error && (
                <p className='text-destructive text-sm'>
                  Transaction Error: {error.message}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
