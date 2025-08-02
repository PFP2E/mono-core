import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { campaigns } from '@/lib/mock-data'
import { DepositModal } from './deposit-modal'

export const Marketplace = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [selectedCampaign, setSelectedCampaign] = React.useState<
    (typeof campaigns)[0] | null
  >(null)

  const handleFundClick = (campaign: (typeof campaigns)[0]) => {
    setSelectedCampaign(campaign)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCampaign(null)
  }

  return (
    <div className='py-16'>
      <h2 className='text-foreground mb-8 text-center text-3xl font-bold sm:text-4xl'>
        PFP2E Reward Pools
      </h2>
      <div className='mx-auto w-full max-w-6xl overflow-x-auto'>
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
                className='border-border hover:bg-muted/20 grid grid-cols-12 items-center gap-6 border-b px-6 py-5 transition-colors last:border-b-0'
              >
                <div className='col-span-4 flex items-center gap-4'>
                  <Image
                    className='h-12 w-12 rounded-lg'
                    src={campaign.imageUrl}
                    alt={campaign.campaignName}
                    width={48}
                    height={48}
                  />
                  <div className='flex flex-col gap-1'>
                    <Link
                      href={`/campaign/${campaign.campaignName}`}
                      className='hover:underline'
                    >
                      <div className='text-card-foreground cursor-pointer text-base font-medium'>
                        {campaign.campaignName}
                      </div>
                    </Link>
                    <div className='text-muted-foreground text-sm'>
                      {campaign.campaignType}
                    </div>
                  </div>
                </div>
                <div className='text-card-foreground col-span-2 text-right text-base font-medium'>
                  {campaign.stakers.toLocaleString()}
                </div>
                <div className='text-card-foreground col-span-2 text-right text-base font-medium'>
                  {campaign.rewardPool}
                </div>
                <div className='text-card-foreground col-span-2 text-right text-base font-medium'>
                  {campaign.dailyReward}
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

      <DepositModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        campaign={selectedCampaign}
      />
    </div>
  )
}
