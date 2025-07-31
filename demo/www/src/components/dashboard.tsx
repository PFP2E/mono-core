// src/components/dashboard.tsx
'use client'

import { useSIWE } from '@/hooks/useSIWE'
import { useXSession } from '@/hooks/useXSession'
import { useWallet } from '@/hooks/use-wallet'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import Image from 'next/image'

export function UserDashboard() {
  const { isAuthenticated } = useSIWE()
  const { isXAuthenticated, session: xSession } = useXSession()
  const { formattedAddress } = useWallet()

  if (!isAuthenticated && !isXAuthenticated) {
    return null
  }
  console.debug(xSession?.pfpUrl)
  const pfpUrl = xSession?.pfpUrl

  return (
    <div className='my-8'>
      <Card>
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
        </CardHeader>
        <CardContent className='flex items-center gap-4'>
          {isXAuthenticated && xSession && (
            <div className='flex items-center gap-4'>
              <Image src={pfpUrl!} alt={'pfp'} width={100} height={100} />
              <div>
                <p className='text-muted-foreground text-sm'>Signed in as</p>
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
