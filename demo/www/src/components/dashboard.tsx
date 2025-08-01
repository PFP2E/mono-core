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
import { useDepositStore } from '@/store/deposit.store'
import { Trash2 } from 'lucide-react'

export function UserDashboard() {
  const { isAuthenticated, ens } = useSIWE()
  const { isXAuthenticated, session: xSession } = useXSession()
  const { formattedAddress } = useWallet()
  const { deposits, clearHistory } = useDepositStore()

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
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardAction>
            <Button asChild>
              <Link href='/create-campaign'>Create Campaign</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className='flex flex-wrap items-center gap-8'>
          {isXAuthenticated && xSession && (
            <div className='flex items-center gap-4'>
              {pfpUrl && (
                <Image src={pfpUrl} alt={'pfp'} width={100} height={100} />
              )}
              <div>
                <div className='flex items-center gap-2'>
                  <p className='text-muted-foreground text-sm'>Signed in as</p>
                  {!hasProfileData && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <AlertTriangle className='h-4 w-4 text-amber-500' />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Could not load profile details from X.
                            <br />
                            This may be due to rate limits.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <p className='text-lg font-medium'>{xSession.username}</p>
              </div>
            </div>
          )}
          {isAuthenticated && (
            <div className='flex items-center gap-4'>
              {ens?.avatar && (
                <Image
                  src={ens.avatar}
                  alt={ens.name || 'ENS Avatar'}
                  width={100}
                  height={100}
                  className='rounded-full'
                />
              )}
              <div className='flex flex-col items-start gap-1'>
                <span className='text-muted-foreground text-sm'>
                  Wallet Connected
                </span>
                <span className='text-lg font-medium'>
                  {ens?.name || formattedAddress}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deposit History */}
      {deposits.length > 0 && (
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle>Recent Activity</CardTitle>
              <Button
                variant='outline'
                size='sm'
                onClick={clearHistory}
                className='h-8 px-2'
              >
                <Trash2 className='h-4 w-4 mr-1' />
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {deposits.slice(0, 5).map((deposit) => (
                <div key={deposit.id} className='flex items-center justify-between py-2 border-b border-border last:border-b-0'>
                  <div className='flex items-center justify-between w-full'>
                    <span className='text-sm font-medium'>
                      {deposit.type === 'deposit' ? 'Deposit' : 'Claim'}: {deposit.tokenName} ({deposit.amount}) {deposit.tokenName} tokens into {deposit.campaignName}
                    </span>
                    <span className='text-xs text-muted-foreground'>
                      {formatTimestamp(deposit.timestamp)}
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
