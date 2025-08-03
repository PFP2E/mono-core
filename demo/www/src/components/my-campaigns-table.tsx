'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Campaign as SdkCampaign } from '@pfp2e/sdk'
import { useUserCampaigns } from '@/hooks/useUserCampaigns'

// Extend SDK Campaign type with mock UI data properties
interface Campaign extends SdkCampaign {
  imageUrl: string
  stakers: number
  apy: number | 'N/A'
  fundable: boolean
  claimable: boolean
  token: string
}

interface MyCampaignsTableProps {
  campaigns: Campaign[]
}

export const MyCampaignsTable: React.FC<MyCampaignsTableProps> = ({ campaigns }) => {
  const router = useRouter()
  const { campaigns: userCampaigns, isLoading } = useUserCampaigns()

  if (isLoading || userCampaigns.length === 0) {
    return null // Don't render anything if loading or no eligible campaigns
  }

  const eligibleCampaignIds = userCampaigns.map(c => c.campaignId)
  const myCampaigns = campaigns.filter(c => eligibleCampaignIds.includes(c.id))

  if (myCampaigns.length === 0) {
    return null
  }

  const handleClaimClick = (campaignId: string) => {
    router.push(`/rewards?campaignId=${campaignId}`)
  }

  return (
    <div className='my-8'>
      <h2 className='text-foreground mb-4 text-center text-3xl font-bold sm:text-4xl'>
        My Campaigns
      </h2>
      <Card className='overflow-hidden rounded-2xl border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myCampaigns.map(campaign => (
              <TableRow key={campaign.id}>
                <TableCell>
                  <div className='flex items-center gap-3'>
                    <Image
                      src={campaign.imageUrl}
                      alt={campaign.name}
                      width={40}
                      height={40}
                      className='rounded-lg'
                    />
                    <div>
                      <Link href={`/campaign/${campaign.id}`} className='font-semibold hover:underline'>
                        {campaign.name}
                      </Link>
                      <p className='text-sm text-muted-foreground'>
                        {campaign.token}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{campaign.type}</TableCell>
                <TableCell className='text-right'>
                  <Button
                    size='sm'
                    onClick={() => handleClaimClick(campaign.id)}
                    disabled={!userCampaigns.find(c => c.campaignId === campaign.id)?.isClaimable}
                  >
                    Claim
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
