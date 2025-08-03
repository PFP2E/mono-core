'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useStakingStore } from '@/store/staking.store'
import type { Campaign as SdkCampaign } from '@pfp2e/sdk'
import { useUserCampaigns } from '@/hooks/useUserCampaigns'
import { useRouter } from 'next/navigation'

// Extend SDK Campaign type with mock UI data properties
interface Campaign extends SdkCampaign {
  imageUrl: string
  stakers: number
  apy: number | 'N/A'
  fundable: boolean
  claimable: boolean
  token: string
}

interface MarketplaceTableProps {
  campaigns: Campaign[]
  onFundClick: (campaign: Campaign) => void
}

export const MarketplaceTable: React.FC<MarketplaceTableProps> = ({ campaigns, onFundClick }) => {
  const { isStakingEnabled, activeCampaign } = useStakingStore()
  const { campaigns: userCampaigns } = useUserCampaigns()
  const router = useRouter()

  const handleClaimClick = (campaignId: string) => {
    router.push(`/rewards?campaignId=${campaignId}`)
  }

  return (
    <>
      {/* Desktop Layout */}
      <div className='mx-auto hidden w-full max-w-6xl md:block'>
        <Card className='overflow-hidden rounded-2xl border'>
          <CardHeader className='grid grid-cols-5 gap-4 bg-muted/50 p-4 text-center text-sm font-medium text-muted-foreground'>
            <div>Campaign</div>
            <div>Stakers</div>
            <div>Reward Pool</div>
            <div>Daily Reward</div>
            <div>Actions</div>
          </CardHeader>
          <CardContent className='p-0'>
            {campaigns.map(campaign => {
              const userCampaign = userCampaigns.find(uc => uc.campaignId === campaign.id)
              const isEligible = !!userCampaign

              return (
                <div
                  key={campaign.id}
                  className={`grid grid-cols-5 items-center gap-4 border-t p-4 transition-colors hover:bg-muted/50 ${
                    isEligible ? 'bg-green-500/10' : ''
                  } ${
                    isStakingEnabled &&
                    activeCampaign?.campaignName === campaign.name
                      ? 'border-green-500 bg-green-500/5'
                      : ''
                  }`}
                >
                  {/* Campaign */}
                  <div className='flex items-center gap-3'>
                    <Link href={`/campaign/${campaign.id}`}>
                      <Image
                        className='h-12 w-12 rounded-lg transition-opacity hover:opacity-80'
                        src={campaign.imageUrl}
                        alt={campaign.name}
                        width={48}
                        height={48}
                      />
                    </Link>
                    <div>
                      <Link
                        href={`/campaign/${campaign.id}`}
                        className='flex items-center gap-2 font-semibold hover:underline'
                      >
                        {campaign.name}
                        {isStakingEnabled &&
                          activeCampaign?.campaignName === campaign.name && (
                            <span className='rounded-full bg-green-500 px-2 py-0.5 text-xs font-semibold text-black'>
                              STAKING
                            </span>
                          )}
                      </Link>
                      <p className='text-sm text-muted-foreground'>
                        {campaign.type}
                      </p>
                    </div>
                  </div>

                  {/* Stakers */}
                  <div className='text-center font-medium'>
                    {campaign.stakers.toLocaleString()}
                  </div>

                  {/* Reward Pool */}
                  <div className='text-center font-medium'>
                    {campaign.reward_info?.totalPool}
                  </div>

                  {/* Daily Reward */}
                  <div className='text-center font-medium'>
                    {campaign.reward_info?.dailyRate}
                  </div>

                  {/* Actions */}
                  <div className='flex items-center justify-center gap-2'>
                    <Button
                      disabled={!campaign.fundable}
                      variant='secondary'
                      size='sm'
                      onClick={() => onFundClick(campaign)}
                    >
                      Fund
                    </Button>
                    <Button
                      disabled={!userCampaign?.isClaimable}
                      size='sm'
                      onClick={() => handleClaimClick(campaign.id)}
                    >
                      Claim
                    </Button>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Mobile Layout */}
      <div className='grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 md:hidden'>
        {campaigns.map(campaign => {
          const userCampaign = userCampaigns.find(uc => uc.campaignId === campaign.id)
          const isEligible = !!userCampaign

          return (
            <Card
              key={campaign.id}
              className={`overflow-hidden rounded-2xl border ${
                isEligible ? 'bg-green-500/10' : ''
              } ${
                isStakingEnabled &&
                activeCampaign?.campaignName === campaign.name
                  ? 'border-green-500 bg-green-500/5'
                  : ''
              }`}
            >
              <CardContent className='p-4'>
                <div className='mb-4 flex items-center gap-3'>
                  <Link href={`/campaign/${campaign.id}`}>
                    <Image
                      className='h-14 w-14 rounded-lg'
                      src={campaign.imageUrl}
                      alt={campaign.name}
                      width={56}
                      height={56}
                    />
                  </Link>
                  <div>
                    <Link
                      href={`/campaign/${campaign.id}`}
                      className='text-lg font-semibold hover:underline'
                    >
                      {campaign.name}
                    </Link>
                    {isStakingEnabled &&
                      activeCampaign?.campaignName === campaign.name && (
                        <span className='ml-2 rounded-full bg-green-500 px-2 py-0.5 text-xs font-semibold text-black'>
                          STAKING
                        </span>
                      )}
                    <p className='text-sm text-muted-foreground'>
                      {campaign.type}
                    </p>
                  </div>
                </div>

                <div className='mb-4 space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Stakers</span>
                    <span className='font-medium'>
                      {campaign.stakers.toLocaleString()}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Reward Pool</span>
                    <span className='font-medium'>
                      {campaign.reward_info?.totalPool}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Daily Reward</span>
                    <span className='font-medium'>
                      {campaign.reward_info?.dailyRate}
                    </span>
                  </div>
                </div>

                <div className='flex gap-2'>
                  <Button
                    disabled={!campaign.fundable}
                    variant='secondary'
                    className='w-full'
                    onClick={() => onFundClick(campaign)}
                  >
                    Fund
                  </Button>
                  <Button
                    disabled={!userCampaign?.isClaimable}
                    className='w-full'
                    onClick={() => handleClaimClick(campaign.id)}
                  >
                    Claim
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  )
}
