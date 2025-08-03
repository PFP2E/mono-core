'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock } from 'lucide-react'
import { DepositModal } from '@/components/deposit-modal'
import { useStakingStore } from '@/store/staking.store'
import type { Campaign } from '@pfp2e/sdk'
import { Skeleton } from '@/components/ui/skeleton'

// NOTE: In a real app, this detailed info would also come from the API.
// For the hackathon, we merge API data with this static UI data.
const MOCK_CAMPAIGN_DETAILS: { [key: string]: any } = {
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
    },
    eligibilityCriteria: [
      { id: '1', text: 'Set BAYC as profile picture', completed: true, verified: true },
      { id: '2', text: 'Hold BAYC NFT for > 30 days', completed: false, verified: false }
    ]
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
    },
    eligibilityCriteria: [
        { id: '1', text: 'Be an ETHGlobal participant', completed: true, verified: true }
    ]
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
    },
    eligibilityCriteria: [
        { id: '1', text: 'Use 1inch branded overlay', completed: true, verified: true }
    ]
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
    },
    eligibilityCriteria: [
        { id: '1', text: 'Set CryptoPunk as PFP', completed: true, verified: true }
    ]
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
    },
    eligibilityCriteria: [
        { id: '1', text: 'Set Sproto Gremlin as PFP', completed: true, verified: true }
    ]
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
    },
    eligibilityCriteria: [
        { id: '1', text: 'Use MOG/ACC overlay', completed: true, verified: true }
    ]
  },
  'default-x-campaign': {
    imageUrl: '/images/SPROTO.jpg',
    stakers: 5678,
    apy: 'N/A',
    apyColor: 'orange',
    fundable: true,
    claimable: true,
    token: 'DEFAULT',
    reward_info: {
      totalPool: '5,000,000',
      dailyRate: '5,000'
    },
    eligibilityCriteria: [
      { id: '1', text: 'Sign in with X', completed: true, verified: true }
    ]
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
    },
    eligibilityCriteria: [
      { id: '1', text: 'Be a hackathon judge', completed: true, verified: true }
    ]
  }
};

export default function CampaignPage() {
  const params = useParams()
  const router = useRouter()
  const { activeCampaign } = useStakingStore()
  const slug = decodeURIComponent(params.slug as string)

  const [campaign, setCampaign] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isModalOpen, setIsModalOpen] = React.useState(false)

  useEffect(() => {
    if (!slug) return

    const fetchCampaign = async () => {
      setIsLoading(true)
      setError(null)
      setCampaign(null)

      try {
        const res = await fetch(`/api/records/campaigns/${slug}`)
        if (res.ok) {
          const data: Campaign = await res.json()
          // Merge API data with mock UI data
          setCampaign({ ...data, ...MOCK_CAMPAIGN_DETAILS[data.id] })
        } else {
          // The API call was made but returned an error (e.g., 404)
          // We'll fall through to the catch block's logic
          throw new Error('API request failed')
        }
      } catch (err) {
        // This block will be hit on network error or if we threw from the try block
        const mockData = MOCK_CAMPAIGN_DETAILS[slug]
        if (mockData) {
          // If we have mock data, use it as a fallback
          setCampaign({
            id: slug,
            name: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            description: 'A decentralized visual identity campaign.',
            type: slug.includes('derivative') ? 'Derivative' : 'PFP Staking',
            ...mockData
          })
        } else {
          // No API data and no mock data, so it's truly not found
          setError('Campaign not found')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampaign()
  }, [slug])

  const handleFundClick = () => {
    if (campaign) {
      setIsModalOpen(true)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleClaimClick = () => {
    if (activeCampaign && activeCampaign.id === campaign?.id) {
      router.push('/rewards')
    }
  }

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <Skeleton className='mb-6 h-10 w-32' />
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          <div className='space-y-6 lg:col-span-2'>
            <Card>
              <CardContent className='p-6'>
                <Skeleton className='h-24 w-full' />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className='h-8 w-48' />
              </CardHeader>
              <CardContent>
                <Skeleton className='h-32 w-full' />
              </CardContent>
            </Card>
          </div>
          <div className='space-y-6'>
            <div className='flex gap-3'>
              <Skeleton className='h-10 w-full' />
              <Skeleton className='h-10 w-full' />
            </div>
            <Card>
              <CardHeader>
                <Skeleton className='h-8 w-32' />
              </CardHeader>
              <CardContent className='space-y-4'>
                <Skeleton className='h-5 w-full' />
                <Skeleton className='h-5 w-full' />
                <Skeleton className='h-5 w-full' />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className='h-8 w-40' />
              </CardHeader>
              <CardContent className='space-y-3'>
                <Skeleton className='h-12 w-full' />
                <Skeleton className='h-12 w-full' />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>
          <h1 className='mb-4 text-2xl font-bold'>
            {error || 'Campaign not found'}
          </h1>
          <Button asChild>
            <Link href='/'>Back Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-6'>
        <Button variant='outline' asChild>
          <Link href='/'>← Back Home</Link>
        </Button>
      </div>

      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
        {/* Left Column - Campaign Info */}
        <div className='space-y-6 lg:col-span-2'>
          {/* Campaign Header */}
          <Card>
            <CardContent className='p-6'>
              <div className='flex items-start gap-4'>
                <Image
                  src={campaign.imageUrl}
                  alt={campaign.name}
                  width={80}
                  height={80}
                  className='rounded-lg'
                />
                <div className='flex-1'>
                  <h1 className='mb-2 text-2xl font-bold'>{campaign.name}</h1>
                  <p className='text-muted-foreground mb-2'>{campaign.type}</p>
                  <p className='text-muted-foreground text-sm'>
                    Stakers: {campaign.stakers.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About Campaign */}
          <Card>
            <CardHeader>
              <CardTitle>About Campaign</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground leading-relaxed'>
                {campaign.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Action Buttons & Statistics & Eligibility */}
        <div className='space-y-6'>
          {/* Action Buttons - Moved to top */}
          <div className='flex gap-3'>
            <Button
              disabled={!campaign.fundable}
              className='flex-1'
              onClick={handleFundClick}
            >
              Fund Campaign
            </Button>
            <Button
              disabled={!campaign.claimable}
              variant='outline'
              className='flex-1'
              onClick={handleClaimClick}
            >
              Claim Rewards
            </Button>
          </div>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Stakers</span>
                <span className='font-medium'>
                  {campaign.stakers.toLocaleString()}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Reward Pool</span>
                <span className='font-medium'>
                  {campaign.reward_info.totalPool}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Daily Reward</span>
                <span className='font-medium'>
                  {campaign.reward_info.dailyRate}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>NFT floor APY</span>
                <span className='font-medium'>
                  {typeof campaign.apy === 'number'
                    ? `${campaign.apy}%`
                    : campaign.apy}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Eligibility Criteria */}
          <Card>
            <CardHeader>
              <CardTitle>Eligibility Criteria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {campaign.eligibilityCriteria.map((criteria: any) => (
                  <div key={criteria.id} className='rounded-lg border p-3'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm'>{criteria.text}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Badge
                          variant={criteria.completed ? 'secondary' : 'outline'}
                          className={
                            criteria.completed
                              ? 'bg-green-100 text-green-800'
                              : ''
                          }
                        >
                          {criteria.completed ? (
                            <CheckCircle className='mr-1 h-3 w-3' />
                          ) : (
                            <Clock className='mr-1 h-3 w-3' />
                          )}
                          {criteria.completed ? 'Completed' : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Deposit Modal */}
      <DepositModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        campaign={campaign}
      />
    </div>
  )
}
