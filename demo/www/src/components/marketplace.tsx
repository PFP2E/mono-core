'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DepositModal } from './deposit-modal'
import type { Campaign } from '@pfp2e/sdk'
import { Skeleton } from './ui/skeleton'
import { DefaultService } from '@pfp2e/sdk/client'
import { MyCampaignsTable } from './my-campaigns-table'
import { MarketplaceTable } from './marketplace-table'

// Helper function to add mock UI fields to the API data
const mapCampaignData = (campaign: Campaign): any => {
  const MOCK_UI_MAP: { [key: string]: any } = {
    'bayc-pfp-staking': {
      imageUrl: '/images/BAYC.jpg',
      stakers: 1234,
      apy: 12.5,
      apyColor: 'green',
      fundable: true,
      claimable: true,
      token: 'BAYC',
      reward_info: {
        totalPool: '1,000,000',
        dailyRate: '1,000'
      }
    },
    'ethglobal-pfp-staking': {
      imageUrl: '/images/ETHGLOBAL.jpg',
      stakers: 16,
      apy: 15.2,
      apyColor: 'green',
      fundable: true,
      claimable: false,
      token: 'ETHG',
      reward_info: {
        totalPool: '500,000',
        dailyRate: '500'
      }
    },
    '1inch-derivative': {
      imageUrl: '/images/1INCH.jpg',
      stakers: 2341,
      apy: 'N/A',
      apyColor: 'green',
      fundable: true,
      claimable: true,
      token: '1INCH',
      reward_info: {
        totalPool: '2,500,000',
        dailyRate: '2,500'
      }
    },
    'punks-pfp-staking': {
      imageUrl: '/images/CRYPTOPUNKS.jpg',
      stakers: 567,
      apy: 8.2,
      apyColor: 'green',
      fundable: true,
      claimable: false,
      token: 'PUNK',
      reward_info: {
        totalPool: '750,000',
        dailyRate: '750'
      }
    },
    'sproto-pfp-staking': {
      imageUrl: '/images/SPROTO.jpg',
      stakers: 890,
      apy: 22.1,
      apyColor: 'orange',
      fundable: false,
      claimable: true,
      token: 'SPROTO',
      reward_info: {
        totalPool: '1,200,000',
        dailyRate: '1,200'
      }
    },
    'mog-acc-derivative': {
      imageUrl: '/images/MOG.jpg',
      stakers: 2456,
      apy: 'N/A',
      apyColor: 'green',
      fundable: true,
      claimable: true,
      token: 'MOG',
      reward_info: {
        totalPool: '3,000,000',
        dailyRate: '3,000'
      }
    },
    'default-x-campaign': {
      imageUrl: '/images/SPROTO.jpg', // Re-using an image for the default
      stakers: 5678,
      apy: 'N/A',
      apyColor: 'orange',
      fundable: true,
      claimable: true,
      token: 'DEFAULT',
      reward_info: {
        totalPool: '5,000,000',
        dailyRate: '5,000'
      }
    },
    'judges-campaign': {
      imageUrl: '/images/ETHGLOBAL.jpg',
      stakers: 3,
      apy: 'N/A',
      apyColor: 'green',
      fundable: true,
      claimable: true,
      token: 'JUDGE',
      reward_info: {
        totalPool: '100,000',
        dailyRate: '100'
      }
    }
  }
  const mockData = MOCK_UI_MAP[campaign.id] || {}
  return {
    ...campaign,
    ...mockData,
    reward_info: campaign.reward_info || mockData.reward_info
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

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true)
        const data: Campaign[] = await DefaultService.getV1Campaigns();
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
        <div className='mx-auto w-full max-w-6xl'>
          <Card className='overflow-hidden rounded-2xl'>
            <CardHeader className='grid grid-cols-5 gap-4 bg-muted/50 p-4'>
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className='h-6 w-full' />
              ))}
            </CardHeader>
            <CardContent className='p-0'>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className='grid grid-cols-5 items-center gap-4 border-t p-4'
                >
                  <div className='flex items-center gap-3'>
                    <Skeleton className='h-12 w-12 rounded-lg' />
                    <div className='flex flex-col gap-2'>
                      <Skeleton className='h-5 w-24' />
                      <Skeleton className='h-4 w-16' />
                    </div>
                  </div>
                  {[...Array(4)].map((_, j) => (
                    <Skeleton key={j} className='h-6 w-3/4 justify-self-center' />
                  ))}
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
      <MyCampaignsTable campaigns={campaigns} />

      <h2 className='text-foreground mb-2 text-center text-3xl font-bold sm:text-4xl'>
        PFP2E Campaigns
      </h2>
      <p className='text-muted-foreground mb-8 text-center text-sm'>
        Browse and interact with active staking campaigns.
      </p>

      <MarketplaceTable campaigns={campaigns} onFundClick={handleFundClick} />

      <DepositModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        campaign={selectedCampaign}
      />
    </div>
  )
}
