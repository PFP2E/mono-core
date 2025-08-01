'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp, CheckCircle, Clock } from 'lucide-react'
import { campaigns } from '@/lib/mock-data'
import { DepositModal } from '@/components/deposit-modal'

interface EligibilityCriteria {
  id: string
  text: string
  completed: boolean
  verified: boolean
}

interface CampaignDetail {
  id: number
  slug: string
  name: string
  imageUrl: string
  creator: string
  totalSupply: number
  stakers: number
  rewardPool: string
  dailyReward: string
  apy: number
  apyColor: 'green' | 'orange'
  description: string
  eligibilityCriteria: EligibilityCriteria[]
  rewardTimer: string
  fundable: boolean
  claimable: boolean
  token: string
}

// Mock detailed campaign data - using the same data as marketplace but with additional fields
const campaignDetails: CampaignDetail[] = campaigns.map((campaign, index) => {
  // Additional data for campaign pages
  const additionalData = {
    creator: ['Yuga Labs', 'ETHGlobal', '1inch Network', 'Larva Labs', 'Sproto Labs', 'Mog Labs'][index],
    totalSupply: [10000, 5000, 1500000000, 10000, 10000, 1000000][index],
    description: [
      'The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs— unique digital collectibles living on the Ethereum blockchain. Your Bored Ape doubles as your Yacht Club membership card and grants access to members-only benefits.',
      'ETHGlobal is the premier Ethereum hackathon series, bringing together developers, designers, and creators to build the future of Web3. Join the global community of Ethereum builders.',
      '1INCH is a decentralized exchange aggregator that sources liquidity from various DEXs to provide users with the best trading rates and lowest fees.',
      'CryptoPunks is one of the first NFT projects on Ethereum, featuring 10,000 unique collectible characters with proof of ownership stored on the Ethereum blockchain.',
      'Sproto Gremlins are 3,333 exclusive unique manifestations of harrypotterobamasonic10inu\'s egregore. Imbued with high speed presidential wizardry and lifelong loyalty, Sproto Gremlins are vibrant, mischievous, quirky NFTs with chaotic energy. Blending humor and creativity, it appeals to collectors who love playful, haywire aesthetics.',
      'MOG is a community-driven meme token that has evolved into a comprehensive DeFi ecosystem, offering staking, farming, and governance opportunities.'
    ][index],
    eligibilityCriteria: [
      [
        { id: '1', text: 'Hold BAYC NFT for more than 5 days', completed: true, verified: true },
        { id: '2', text: 'Set BAYC as profile picture', completed: true, verified: true },
        { id: '3', text: 'Participate in community events', completed: false, verified: false }
      ],
      [
        { id: '1', text: 'Attend ETHGlobal hackathon', completed: true, verified: true },
        { id: '2', text: 'Build and submit a project', completed: true, verified: true },
        { id: '3', text: 'Win a prize or recognition', completed: false, verified: false }
      ],
      [
        { id: '1', text: 'Use 1inch hoodie on your X PFP', completed: true, verified: true },
        { id: '2', text: 'Stake for minimum 30 days', completed: true, verified: true },
        { id: '3', text: 'Participate in governance voting', completed: false, verified: false }
      ],
      [
        { id: '1', text: 'Own a CryptoPunk NFT', completed: true, verified: true },
        { id: '2', text: 'Hold for more than 30 days', completed: true, verified: true },
        { id: '3', text: 'Participate in community', completed: false, verified: false }
      ],
      [
        { id: '1', text: 'Stake SPROTO tokens', completed: true, verified: true },
        { id: '2', text: 'Provide liquidity to pools', completed: false, verified: false },
        { id: '3', text: 'Participate in governance', completed: false, verified: false }
      ],
      [
        { id: '1', text: 'Hold MOG tokens', completed: true, verified: true },
        { id: '2', text: 'Stake for minimum 7 days', completed: true, verified: true },
        { id: '3', text: 'Participate in community events', completed: false, verified: false }
      ]
    ][index],
    rewardTimer: ['12:34:56:78', '08:15:42:33', '12:45:30:22', '03:45:12:22', '19:33:07:14', '07:18:55:42'][index]
  }

  return {
    id: campaign.id,
    slug: campaign.slug,
    name: campaign.name.split('<br/>')[0],
    imageUrl: campaign.imageUrl,
    creator: additionalData.creator,
    totalSupply: additionalData.totalSupply,
    stakers: campaign.stakers,
    rewardPool: campaign.rewardPool.replace('RWT', campaign.token),
    dailyReward: campaign.dailyReward,
    apy: campaign.apy,
    apyColor: campaign.apyColor,
    description: additionalData.description,
    eligibilityCriteria: additionalData.eligibilityCriteria,
    rewardTimer: additionalData.rewardTimer,
    fundable: campaign.fundable,
    claimable: campaign.claimable,
    token: campaign.token
  }
})

export default function CampaignPage() {
  const params = useParams()
  const slug = params.slug as string
  const [expandedCriteria, setExpandedCriteria] = React.useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [selectedCampaign, setSelectedCampaign] = React.useState<any>(null)

  const campaign = campaignDetails.find(c => c.slug === slug)
  const marketplaceCampaign = campaigns.find(c => c.name.includes(campaign?.name || ''))

  const handleFundClick = () => {
    if (campaign) {
      setSelectedCampaign(campaign)
      setIsModalOpen(true)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCampaign(null)
  }

  if (!campaign) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Campaign not found</h1>
          <Button asChild>
            <Link href="/">Back to Marketplace</Link>
          </Button>
        </div>
      </div>
    )
  }

  const toggleCriteria = (id: string) => {
    setExpandedCriteria(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/">← Back Home</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Campaign Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Campaign Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Image
                  src={campaign.imageUrl}
                  alt={campaign.name}
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-2">{campaign.name}</h1>
                  <p className="text-muted-foreground mb-2">by {campaign.creator}</p>
                  <p className="text-sm text-muted-foreground">
                    Total Supply: {campaign.totalSupply.toLocaleString()}
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
              <p className="text-muted-foreground leading-relaxed">
                {campaign.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Action Buttons & Statistics & Eligibility */}
        <div className="space-y-6">
          {/* Action Buttons - Moved to top */}
          <div className="flex gap-3">
            <Button 
              disabled={!campaign.fundable} 
              className="flex-1"
              onClick={handleFundClick}
            >
              Fund Campaign
            </Button>
            <Button 
              disabled={!campaign.claimable} 
              variant="outline" 
              className="flex-1"
            >
              Claim Rewards
            </Button>
          </div>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stakers</span>
                <span className="font-medium">{campaign.stakers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reward Pool</span>
                <span className="font-medium">{marketplaceCampaign?.rewardPool || campaign.rewardPool}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Daily Reward</span>
                <span className="font-medium">{marketplaceCampaign?.dailyReward || campaign.dailyReward}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">NFT floor APY</span>
                <span className="font-medium">{campaign.apy}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reward Timer</span>
                <span className="font-medium">{campaign.rewardTimer}</span>
              </div>
            </CardContent>
          </Card>

          {/* Eligibility Criteria */}
          <Card>
            <CardHeader>
              <CardTitle>Eligibility Criteria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {campaign.eligibilityCriteria.map((criteria) => (
                  <div key={criteria.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleCriteria(criteria.id)}
                          className="p-1 hover:bg-muted rounded"
                        >
                          {expandedCriteria.includes(criteria.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                        <span className="text-sm">{criteria.text}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {criteria.completed ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                        {!criteria.verified && (
                          <Button size="sm" variant="outline">
                            Verify
                          </Button>
                        )}
                      </div>
                    </div>
                    {expandedCriteria.includes(criteria.id) && (
                      <div className="mt-3 pl-6 text-sm text-muted-foreground">
                        <p>Additional details about this criteria will be shown here when expanded.</p>
                      </div>
                    )}
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
        campaign={selectedCampaign}
      />
    </div>
  )
} 