// src/components/dashboard.tsx
'use client'

import { useSIWE } from '@/hooks/useSIWE'
import { useXSession } from '@/hooks/useXSession'
import { useWallet } from '@/hooks/use-wallet'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle
} from './ui/card'
import Image from 'next/image'
import { Button } from './ui/button'
import Link from 'next/link'
import { Icons } from './icons'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from './ui/tooltip'
import { AlertTriangle } from 'lucide-react'

export function UserDashboard() {
  const { isAuthenticated } = useSIWE()
  const { isXAuthenticated, session: xSession } = useXSession()
  const { formattedAddress } = useWallet()

  if (!isAuthenticated && !isXAuthenticated) {
    return null
  }

  const pfpUrl = xSession?.pfpUrl
  const hasProfileData = pfpUrl && xSession?.username !== 'X User'

  return (
    <div className='my-8'>
      <Card>
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardAction>
            <Button asChild>
              <Link href='/create-campaign'>Create Campaign</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className='flex items-center gap-4'>
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
            <div className='flex flex-col items-start gap-1'>
              <span className='text-muted-foreground text-sm'>
                Wallet Connected
              </span>
              <span className='font-mono text-sm'>{formattedAddress}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
