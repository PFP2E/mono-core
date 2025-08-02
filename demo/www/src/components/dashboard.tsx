// src/components/dashboard.tsx
'use client'

import { useSIWE } from '@/hooks/useSIWE'
import { useXSession } from '@/hooks/useXSession'
import { useWallet } from '@/hooks/use-wallet'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import Image from 'next/image'
import { Button } from './ui/button'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import { useActivityStore } from '@/store/activity.store'

export function UserDashboard() {
  const { isAuthenticated, ens } = useSIWE()
  const { isXAuthenticated, session: xSession } = useXSession()
  const { formattedAddress } = useWallet()
  // Use the hook to get reactive updates
  const { activities, clearHistory } = useActivityStore()

  // Debug log to see activities
  console.log('Current activities:', activities)

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
      <Card className='mx-auto max-w-2xl'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle>Welcome Back</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Profile Section */}
          <div className='flex items-center gap-4'>
            {isXAuthenticated && xSession && pfpUrl && (
              <Image
                src={pfpUrl}
                alt={'pfp'}
                width={80}
                height={80}
                className='rounded-full'
              />
            )}
            {isAuthenticated && ens?.avatar && (
              <Image
                src={ens.avatar}
                alt={ens.name || 'ENS Avatar'}
                width={80}
                height={80}
                className='rounded-full'
              />
            )}
            <div className='flex flex-col gap-1'>
              {isXAuthenticated && xSession && (
                <div>
                  <p className='text-muted-foreground text-sm'>Signed in as</p>
                  <p className='text-lg font-medium'>{xSession.username}</p>
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

          {/* Desktop Buttons */}
          <div className='hidden flex-col gap-2 md:flex'>
            <Button
              asChild
              className='bg-green-600 text-white hover:bg-green-700'
            >
              <Link href='/rewards'>Rewards</Link>
            </Button>
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

          {/* Mobile Buttons */}
          <div className='flex flex-col gap-3 md:hidden'>
            <Button asChild size='lg' className='bg-green-600 hover:bg-green-700'>
              <Link href='/rewards'>Rewards</Link>
            </Button>
            <Button asChild size='lg' className='bg-blue-600 hover:bg-blue-700'>
              <Link href='/mogacc-generator'>MOG/ACC Generator</Link>
            </Button>
            <Button asChild size='lg' className='bg-orange-700 hover:bg-orange-800'>
              <Link href='/create-campaign'>Campaign Constructor</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Deposit History */}
      {activities.length > 0 && (
        <Card className='mx-auto max-w-2xl'>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <CardTitle>Recent Activity</CardTitle>
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
