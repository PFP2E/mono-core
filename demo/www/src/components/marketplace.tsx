'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DepositModal } from './deposit-modal'
import { useStakingStore } from '@/store/staking.store'
import type { Campaign } from '@pfp2e/sdk'
import { Skeleton } from './ui/skeleton'

// Helper function to add mock UI fields to the API data
const mapCampaignData = (campaign: Campaign): any => {
  const MOCK_DATA_MAP: { [key: string]: any } = {
    'bayc-social-staking-mvp': {
      imageUrl: '/images/BAYC.jpg',
      stakers: 1234,
      dailyReward: '9.72 APE',
      apy: 12.5,
      apyColor: 'green',
      fundable: true,
      claimable: true,
      token: 'BAYC'
    },
    'default-x-campaign': {
      imageUrl: '/images/SPROTO.jpg',
      stakers: 5678,
      dailyReward: '5,000 $DEFAULT',
      apy: 'N/A',
      apyColor: 'orange',
      fundable: true,
      claimable: true,
      token: 'DEFAULT'
    },
    'judges-campaign': {
      imageUrl: '/images/ETHGLOBAL.jpg',
      stakers: 3,
      dailyReward: '10,000 $JUDGE',
      apy: 'N/A',
      apyColor: 'green',
      fundable: true,
      claimable: true,
      token: 'JUDGE'
    }
  }
  return {
    ...campaign,
    ...MOCK_DATA_MAP[campaign.id]
  }
}

export const Marketplace = () => {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [selectedCampaign, setSelectedCampaign] = React.useState<any | null>(
    null
  )
  const { isStakingEnabled, activeCampaign } = useStakingStore()

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true)
        const res = await fetch('/api/records/campaigns')
        if (!res.ok) {
          throw new Error('Failed to fetch campaigns')
        }
        const data: Campaign[] = await res.json()
        setCampaigns(data.map(mapCampaignData))
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        )
      } finally {
        setIsLoading(false)
      }
    }
    fetchCampaigns()
  }, [])

  const handleFundClick = (campaign: any) => {
    setSelectedCampaign(campaign)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCampaign(null)
  }

  if (isLoading) {
    return (
      <div className='py-16'>
        <h2 className='text-foreground mb-2 text-center text-3xl font-bold sm:text-4xl'>
          PFP2E Campaigns
        </h2>
        <p className='text-muted-foreground mb-8 text-center text-sm'>
          Loading active campaigns...
        </p>
        <div className='mx-auto hidden w-full max-w-6xl md:block'>
          <Card className='border-border bg-card/50 min-w-[1024px] overflow-hidden rounded-3xl'>
            <CardHeader className='bg-muted/50 border-border grid grid-cols-12 gap-6 border-b px-6 py-4'>
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className='h-5 w-full' />
              ))}
            </CardHeader>
            <CardContent className='p-0'>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className='grid grid-cols-12 items-center gap-6 border-b px-6 py-5'
                >
                  <div className='col-span-4 flex items-center gap-4'>
                    <Skeleton className='h-12 w-12 rounded-lg' />
                    <div className='flex flex-col gap-2'>
                      <Skeleton className='h-5 w-32' />
                      <Skeleton className='h-4 w-24' />
                    </div>
                  </div>
                  <div className='col-span-2'>
                    <Skeleton className='h-5 w-full' />
                  </div>
                  <div className='col-span-2'>
                    <Skeleton className='h-5 w-full' />
                  </div>
                  <div className='col-span-2'>
                    <Skeleton className='h-5 w-full' />
                  </div>
                  <div className='col-span-2'>
                    <Skeleton className='h-5 w-full' />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='py-16 text-center'>
        <h2 className='text-destructive mb-4 text-2xl font-bold'>Error</h2>
        <p className='text-muted-foreground'>{error}</p>
      </div>
    )
  }

  return (
    <div className='py-16'>
      <h2 className='text-foreground mb-2 text-center text-3xl font-bold sm:text-4xl'>
        PFP2E Campaigns
      </h2>
      <p className='text-muted-foreground mb-8 text-center text-sm'>
        Browse and interact with active staking campaigns. Click on each
        campaign for specific campaign details.
      </p>

      {/* Desktop Layout */}
      <div className='mx-auto hidden w-full max-w-6xl overflow-x-auto md:block'>
        <Card className='border-border bg-card/50 min-w-[1024px] overflow-hidden rounded-3xl'>
          <CardHeader className='bg-muted/50 border-border grid grid-cols-12 gap-6 border-b px-6 py-4'>
            <div className='text-muted-foreground col-span-4 text-sm font-medium'>
              Campaign
            </div>
            <div className='text-muted-foreground col-span-2 text-center text-sm font-medium'>
              Stakers
            </div>
            <div className='text-muted-foreground col-span-2 text-center text-sm font-medium'>
              Reward Pool
            </div>
            <div className='text-muted-foreground col-span-2 text-center text-sm font-medium'>
              Daily Reward
            </div>
            <div className='text-muted-foreground col-span-2 text-center text-sm font-medium'>
              NFT floor APY
            </div>
          </CardHeader>

          <CardContent className='p-0'>
            {campaigns.map(campaign => (
              <div
                key={campaign.id}
                className={`border-border hover:bg-muted/20 grid grid-cols-12 items-center gap-6 border-b px-6 py-5 transition-colors last:border-b-0 ${
                  isStakingEnabled &&
                  activeCampaign &&
                  activeCampaign.campaignName === campaign.name
                    ? 'border-green-500 bg-green-500/5'
                    : ''
                }`}
              >
                <div className='col-span-4 flex items-center gap-4'>
                  <Link
                    href={`/campaign/${campaign.id}`}
                    className='transition-opacity hover:opacity-80'
                  >
                    <Image
                      className='h-12 w-12 cursor-pointer rounded-lg'
                      src={campaign.imageUrl}
                      alt={campaign.name}
                      width={48}
                      height={48}
                    />
                  </Link>
                  <div className='flex flex-col gap-1'>
                    <Link
                      href={`/campaign/${campaign.id}`}
                      className='hover:underline'
                    >
                      <div className='text-card-foreground flex cursor-pointer items-center gap-2 text-base font-medium'>
                        {campaign.name}
                        {isStakingEnabled &&
                          activeCampaign &&
                          activeCampaign.campaignName === campaign.name && (
                            <div className='flex items-center gap-1 rounded-full bg-gradient-to-r from-green-400 to-green-500 px-2 py-0.5'>
                              <span className='text-xs font-semibold text-black'>
                                STAKING
                              </span>
                            </div>
                          )}
                      </div>
                    </Link>
                    <div className='text-muted-foreground text-sm'>
                      {campaign.type}
                    </div>
                  </div>
                </div>
                <div className='text-card-foreground col-span-2 text-right text-base font-medium'>
                  {campaign.stakers.toLocaleString()}
                </div>
                <div className='text-card-foreground col-span-2 text-right text-base font-medium'>
                  {campaign.reward_info.totalPool}
                </div>
                <div className='text-card-foreground col-span-2 text-right text-base font-medium'>
                  {campaign.reward_info.dailyRate}
                </div>
                <div className='col-span-2 flex items-center justify-end'>
                  <div className='flex items-center gap-2'>
                    <div className='flex items-center gap-1'>
                      <div
                        className={`h-2 w-2 rounded-full ${
                          campaign.apyColor === 'green'
                            ? 'bg-green-500'
                            : 'bg-orange-500'
                        }`}
                      />
                      <div className='text-card-foreground text-base font-medium'>
                        {typeof campaign.apy === 'number'
                          ? `${campaign.apy}%`
                          : campaign.apy}
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button
                      disabled={!campaign.fundable}
                      variant='secondary'
                      size='sm'
                      onClick={() => handleFundClick(campaign)}
                    >
                      Fund
                    </Button>
                    <Button disabled={!campaign.claimable} size='sm'>
                      Claim
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Mobile Layout */}
      <div className='space-y-4 px-4 md:hidden'>
        {campaigns.map(campaign => (
          <Card
            key={campaign.id}
            className={`w-full ${
              isStakingEnabled &&
              activeCampaign &&
              activeCampaign.campaignName === campaign.name
                ? 'border-green-500 bg-green-500/5'
                : ''
            }`}
          >
            <CardContent className='p-4'>
              <div className='mb-4 flex items-center gap-3'>
                <Link
                  href={`/campaign/${campaign.id}`}
                  className='transition-opacity hover:opacity-80'
                >
                  <Image
                    className='h-12 w-12 cursor-pointer rounded-lg'
                    src={campaign.imageUrl}
                    alt={campaign.name}
                    width={48}
                    height={48}
                  />
                </Link>
                <div className='flex flex-col'>
                  <Link
                    href={`/campaign/${campaign.id}`}
                    className='hover:underline'
                  >
                    <div className='text-card-foreground flex cursor-pointer items-center gap-2 text-lg font-medium'>
                      {campaign.name}
                      {isStakingEnabled &&
                        activeCampaign &&
                        activeCampaign.campaignName === campaign.name && (
                          <div className='flex items-center gap-1 rounded-full bg-gradient-to-r from-green-400 to-green-500 px-2 py-0.5'>
                            <span className='text-xs font-semibold text-black'>
                              STAKING
                            </span>
                          </div>
                        )}
                    </div>
                  </Link>
                  <div className='text-muted-foreground text-sm'>
                    {campaign.type}
                  </div>
                </div>
              </div>

              <div className='mb-4 space-y-2'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground text-sm'>Stakers</span>
                  <span className='text-card-foreground font-medium'>
                    {campaign.stakers.toLocaleString()}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground text-sm'>
                    Reward Pool
                  </span>
                  <span className='text-card-foreground font-medium'>
                    {campaign.reward_info.totalPool}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground text-sm'>
                    Daily Reward
                  </span>
                  <span className='text-card-foreground font-medium'>
                    {campaign.reward_info.dailyRate}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground text-sm'>
                    NFT floor APY
                  </span>
                  <div className='flex items-center gap-1'>
                    <div
                      className={`h-2 w-2 rounded-full ${
                        campaign.apyColor === 'green'
                          ? 'bg-green-500'
                          : 'bg-orange-500'
                      }`}
                    />
                    <span className='text-card-foreground font-medium'>
                      {typeof campaign.apy === 'number'
                        ? `${campaign.apy}%`
                        : campaign.apy}
                    </span>
                  </div>
                </div>
              </div>

              <div className='flex gap-2'>
                <Button
                  disabled={!campaign.fundable}
                  variant='secondary'
                  className='flex-1'
                  onClick={() => handleFundClick(campaign)}
                >
                  Fund
                </Button>
                <Button disabled={!campaign.claimable} className='flex-1'>
                  Claim
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <DepositModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        campaign={selectedCampaign}
      />
    </div>
  )
}
