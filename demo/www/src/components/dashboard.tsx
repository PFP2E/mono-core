// src/components/dashboard.tsx
'use client'

import { useSIWE } from '@/hooks/useSIWE'
import { useXSession } from '@/hooks/useXSession'
import { useWallet } from '@/hooks/use-wallet'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from './ui/card'
import Image from 'next/image'
import { Button } from './ui/button'
import Link from 'next/link'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from './ui/tooltip'
import { AlertTriangle } from 'lucide-react'
import { useActivityStore } from '@/store/activity.store'
import { Trash2 } from 'lucide-react'

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
  const hasProfileData = pfpUrl && xSession?.username !== 'X User'

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
      <Card>
        <CardHeader className='flex flex-col md:flex-row md:items-center md:justify-between'>
          <CardTitle>Welcome Back</CardTitle>
          {/* Desktop Button */}
          <div className='hidden md:block'>
            <Button asChild>
              <Link href='/create-campaign'>Create Campaign</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Profile Section */}
          <div className='flex items-center gap-4'>
            {isXAuthenticated && xSession && pfpUrl && (
              <Image src={pfpUrl} alt={'pfp'} width={80} height={80} className='rounded-full' />
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
                  <p className='text-muted-foreground text-sm'>Wallet Connected</p>
                  <p className='text-lg font-medium'>{ens?.name || formattedAddress}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile Button */}
          <div className='flex justify-center md:hidden'>
            <Button asChild size='lg'>
              <Link href='/create-campaign'>Create Campaign</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Deposit History */}
      {activities.length > 0 && (
        <Card>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <CardTitle>Recent Activity</CardTitle>
              <Button
                variant='outline'
                size='sm'
                onClick={clearHistory}
                className='h-6 px-2 text-xs'
              >
                <Trash2 className='h-3 w-3 mr-1' />
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className='flex items-center justify-between py-2 border-b border-border last:border-b-0'>
                  <div className='flex items-center justify-between w-full'>
                    <span className='text-sm font-medium'>
                      {activity.type === 'pfp_update' ? (
                        <>
                          @{activity.username} Staking {activity.campaignName} PFP to earn {activity.tokenName}
                        </>
                      ) : (
                        <>
                          {activity.type === 'deposit' ? 'Deposit' : 'Claim'}: {activity.tokenName} ({activity.amount}) {activity.tokenName} tokens into {activity.campaignName}
                        </>
                      )}
                    </span>
                    <span className='text-xs text-muted-foreground'>
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
