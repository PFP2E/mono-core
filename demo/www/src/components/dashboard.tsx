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
import { Loader2, Trash2 } from 'lucide-react'
import { useActivityStore } from '@/store/activity.store'
import { useStakingStore } from '@/store/staking.store'

export function UserDashboard() {
  const { isAuthenticated, ens } = useSIWE()
  const { isXAuthenticated, session: xSession } = useXSession()
  const { formattedAddress } = useWallet()
  const { campaigns, isLoading, error } = useUserCampaigns()
  const { activities, clearHistory } = useActivityStore()
  const { isStakingEnabled, setIsStakingEnabled } = useStakingStore()

  if (!isAuthenticated && !isXAuthenticated) {
    return null
  }

  const pfpUrl = xSession?.pfpUrl

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className='my-8 space-y-6'>
       <div className='mb-4 flex justify-center'>
        <div className='flex items-center gap-2 rounded-lg bg-gray-800 p-2'>
          <span className='text-sm text-gray-300'>Mock Staking:</span>
          <button
            onClick={() => setIsStakingEnabled(!isStakingEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isStakingEnabled ? 'bg-green-500' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isStakingEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className='text-sm text-gray-300'>
            {isStakingEnabled ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>

      <Card className='mx-auto max-w-2xl'>
        <CardHeader>
          <CardTitle>
            Welcome, @{xSession?.username || ens?.name || formattedAddress}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center gap-4'>
            {pfpUrl && (
               <div className='relative'>
                <Image
                  src={pfpUrl}
                  alt={'pfp'}
                  width={80}
                  height={80}
                  className={`rounded-full border-4 ${
                    isStakingEnabled
                      ? 'border-black shadow-[0_0_0_3px_#11FF74]'
                      : 'border-gray-600'
                  }`}
                />
                 {isStakingEnabled && (
                <div className='absolute -bottom-2 left-1/2 -translate-x-1/2 transform'>
                  <div className='flex items-center gap-1 rounded-full bg-gradient-to-r from-green-400 to-green-500 px-3 py-1'>
                    <span className='text-xs font-semibold text-black'>
                      Staked
                    </span>
                  </div>
                </div>
              )}
              </div>
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
           <div className='flex flex-col gap-2 pt-4'>
            <Button
              asChild
              className='bg-blue-600 text-white hover:bg-blue-700'
            >
              <Link href='/mogacc-generator'>MOG/ACC Generator</Link>
            </Button>
            <Button
              asChild
              className='bg-orange-700 text-white hover:bg-orange-800'
            >
              <Link href='/create-campaign'>Campaign Constructor</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

       {activities.length > 0 && (
        <Card className='mx-auto max-w-2xl'>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <CardTitle>Recent Activity (Mock)</CardTitle>
              <Button
                variant='outline'
                size='sm'
                onClick={clearHistory}
                className='h-6 px-2 text-xs'
              >
                <Trash2 className='mr-1 h-3 w-3' />
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {activities.slice(0, 5).map(activity => (
                <div
                  key={activity.id}
                  className='border-border flex items-center justify-between border-b py-2 last:border-b-0'
                >
                  <div className='flex w-full items-center justify-between'>
                    <span className='text-sm font-medium'>
                      {activity.type === 'pfp_update' ? (
                        <>
                          @{activity.username} Staking {activity.campaignName}{' '}
                          PFP to earn {activity.tokenName}
                        </>
                      ) : (
                        <>
                          {activity.type === 'deposit' ? 'Deposit' : 'Claim'}:{' '}
                          {activity.tokenName} ({activity.amount}){' '}
                          {activity.tokenName} tokens into{' '}
                          {activity.campaignName}
                        </>
                      )}
                    </span>
                    <span className='text-muted-foreground text-xs'>
                      {formatTimestamp(activity.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
