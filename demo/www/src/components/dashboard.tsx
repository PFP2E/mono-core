// src/components/dashboard.tsx
'use client'

import React from 'react'
import { useSIWE } from '@/hooks/useSIWE'
import { useXSession } from '@/hooks/useXSession'
import { useWallet } from '@/hooks/use-wallet'
import { useUserCampaigns } from '@/hooks/useUserCampaigns'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import Image from 'next/image'
import { Button } from './ui/button'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export function UserDashboard() {
  const { isAuthenticated, ens } = useSIWE()
  const { isXAuthenticated, session: xSession } = useXSession()
  const { formattedAddress } = useWallet()
  const { campaigns, isLoading, error } = useUserCampaigns()

  if (!isAuthenticated && !isXAuthenticated) {
    return null
  }

  const pfpUrl = xSession?.pfpUrl

  return (
    <div className='my-8 space-y-6'>
      <Card className='mx-auto max-w-2xl'>
        <CardHeader>
          <CardTitle>
            Welcome, @{xSession?.username || ens?.name || formattedAddress}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center gap-4'>
            {pfpUrl && (
              <Image
                src={pfpUrl}
                alt={'pfp'}
                width={80}
                height={80}
                className='rounded-full border-4 border-gray-600'
              />
            )}
            <div className='flex flex-col gap-1'>
              {isXAuthenticated && xSession && (
                <div>
                  <p className='text-muted-foreground text-sm'>Signed in as</p>
                  <p className='text-lg font-medium'>@{xSession.username}</p>
                </div>
              )}
              {isAuthenticated && (
                <div>
                  <p className='text-muted-foreground text-sm'>
                    Wallet Connected
                  </p>
                  <p className='text-lg font-medium'>
                    {ens?.name || formattedAddress}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='mx-auto max-w-2xl'>
        <CardHeader>
          <CardTitle>My Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className='flex items-center justify-center p-8'>
              <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
            </div>
          )}
          {error && <p className='text-destructive'>Error: {error}</p>}
          {!isLoading && !error && campaigns.length === 0 && (
            <p className='text-muted-foreground'>
              You are not yet eligible for any campaigns.
            </p>
          )}
          <div className='space-y-3'>
            {campaigns.map(campaign => (
              <Link
                key={campaign.campaignId}
                href={`/rewards?campaignId=${campaign.campaignId}`}
                passHref
              >
                <div className='rounded-lg border p-4 transition-colors hover:bg-muted/50'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='font-semibold'>{campaign.campaignId}</h3>
                      <p className='text-sm text-muted-foreground'>
                        Ready to claim for Epoch #{campaign.latestEpoch}
                      </p>
                    </div>
                    <Button variant='secondary' size='sm'>
                      Claim
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
