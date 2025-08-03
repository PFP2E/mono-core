// src/components/dashboard.tsx
'use client'

import React from 'react'
import { useSIWE } from '@/hooks/useSIWE'
import { useXSession } from '@/hooks/useXSession'
import { useWallet } from '@/hooks/use-wallet'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import Image from 'next/image'
import { Button } from './ui/button'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import { useActivityStore } from '@/store/activity.store'
import { useStakingStore } from '@/store/staking.store'
import { campaigns } from '@/lib/mock-data'

export function UserDashboard() {
  const { isAuthenticated, ens } = useSIWE()
  const { isXAuthenticated, session: xSession } = useXSession()
  const { formattedAddress } = useWallet()
  // Use the hook to get reactive updates
  const { activities, clearHistory } = useActivityStore()
  const {
    isStakingEnabled,
    setIsStakingEnabled,
    activeCampaign,
    stakingDetails,
    initializeStaking,
    disableStaking
  } = useStakingStore()

  // Handle staking toggle
  const handleStakingToggle = () => {
    if (!isStakingEnabled) {
      // Turn staking ON - initialize with BAYC campaign
      const baycCampaign = campaigns.find(c => c.campaignName.includes('BAYC'))
      if (baycCampaign) {
        initializeStaking(
          {
            id: baycCampaign.id,
            name: 'BAYC',
            campaignName: baycCampaign.campaignName,
            imageUrl: baycCampaign.imageUrl,
            campaignType: baycCampaign.campaignType
          },
          {
            nftTokenId: '1234',
            walletAddress: '0x23a45678901234567890123456789012345639d3',
            stakedDate: '8/3/2025'
          }
        )
      }
    } else {
      // Turn staking OFF
      disableStaking()
    }
  }

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
      {/* Staking Toggle - Desktop */}
      <div className='mb-4 hidden justify-center md:flex'>
        <div className='flex items-center gap-2 rounded-lg bg-gray-800 p-2'>
          <span className='text-sm text-gray-300'>Staking:</span>
          <button
            onClick={handleStakingToggle}
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

      {/* Staking Toggle - Mobile */}
      <div className='mb-4 flex justify-center md:hidden'>
        <div className='flex items-center gap-2 rounded-lg bg-gray-800 p-1.5'>
          <span className='text-xs text-gray-300'>Staking:</span>
          <button
            onClick={handleStakingToggle}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              isStakingEnabled ? 'bg-green-500' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                isStakingEnabled ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
          <span className='text-xs text-gray-300'>
            {isStakingEnabled ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>

      <Card className='mx-auto max-w-2xl'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle>
            Welcome{' '}
            {xSession?.username
              ? `${xSession.username.charAt(0).toUpperCase() + xSession.username.slice(1)} (😈,😇,💸,📼)`
              : ''}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Profile Section - Fixed Container */}
          <div className='flex items-center gap-4'>
            {/* Profile Picture with Staking Indicator */}
            <div className='relative'>
              {isXAuthenticated && xSession && pfpUrl && (
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
              )}
              {isAuthenticated && ens?.avatar && (
                <Image
                  src={ens.avatar}
                  alt={ens.name || 'ENS Avatar'}
                  width={80}
                  height={80}
                  className={`rounded-full border-4 ${
                    isStakingEnabled
                      ? 'border-black shadow-[0_0_0_3px_#11FF74]'
                      : 'border-gray-600'
                  }`}
                />
              )}

              {/* Staked Badge - Only show when staking is ON */}
              {isStakingEnabled && (
                <div className='absolute -bottom-2 left-1/2 -translate-x-1/2 transform'>
                  <div className='flex items-center gap-1 rounded-full bg-gradient-to-r from-green-400 to-green-500 px-3 py-1'>
                    <span className='text-xs font-semibold text-black'>
                      Staked
                    </span>
                    <svg
                      className='h-3 w-3 text-black'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Username and Wallet Info - Fixed Container */}
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

          {/* Staking Status - Separate section below profile, above buttons */}
          {isStakingEnabled && activeCampaign && stakingDetails && (
            <div className='mt-2 flex items-center gap-2'>
              <svg
                className='h-4 w-4 text-green-500'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                  clipRule='evenodd'
                />
              </svg>
              <span className='text-sm text-green-500'>
                Staked: {activeCampaign.name} #{stakingDetails.nftTokenId}{' '}
                staked with wallet {stakingDetails.walletAddress.slice(0, 6)}...
                {stakingDetails.walletAddress.slice(-4)}
              </span>
            </div>
          )}

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
            <Button
              asChild
              size='lg'
              className='bg-green-600 hover:bg-green-700'
            >
              <Link href='/rewards'>Rewards</Link>
            </Button>
            <Button asChild size='lg' className='bg-blue-600 hover:bg-blue-700'>
              <Link href='/mogacc-generator'>MOG/ACC Generator</Link>
            </Button>
            <Button
              asChild
              size='lg'
              className='bg-orange-700 hover:bg-orange-800'
            >
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
