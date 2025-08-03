import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { campaigns } from '@/lib/mock-data'
import { DepositModal } from './deposit-modal'
import { useStakingStore } from '@/store/staking.store'

export const Marketplace = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [selectedCampaign, setSelectedCampaign] = React.useState<
    (typeof campaigns)[0] | null
  >(null)
  const { isStakingEnabled, activeCampaign } = useStakingStore()

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
      <h2 className='text-foreground mb-2 text-center text-3xl font-bold sm:text-4xl'>
        PFP2E Campaigns
      </h2>
      <p className='text-muted-foreground mb-8 text-center text-sm'>
        Browse and interact with active staking campaigns. Click on each
        campaign for specific campaign details.
      </p>

      {/* Desktop Layout - Keep exactly as is */}
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
                  activeCampaign.campaignName === campaign.campaignName
                    ? 'border-green-500 bg-green-500/5'
                    : ''
                }`}
              >
                <div className='col-span-4 flex items-center gap-4'>
                  <Link
                    href={`/campaign/${campaign.campaignName}`}
                    className='transition-opacity hover:opacity-80'
                  >
                    <Image
                      className='h-12 w-12 cursor-pointer rounded-lg'
                      src={campaign.imageUrl}
                      alt={campaign.campaignName}
                      width={48}
                      height={48}
                    />
                  </Link>
                  <div className='flex flex-col gap-1'>
                    <Link
                      href={`/campaign/${campaign.campaignName}`}
                      className='hover:underline'
                    >
                      <div className='text-card-foreground flex cursor-pointer items-center gap-2 text-base font-medium'>
                        {campaign.campaignName}
                        {isStakingEnabled &&
                          activeCampaign &&
                          activeCampaign.campaignName ===
                            campaign.campaignName && (
                            <div className='flex items-center gap-1 rounded-full bg-gradient-to-r from-green-400 to-green-500 px-2 py-0.5'>
                              <span className='text-xs font-semibold text-black'>
                                STAKING
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
                          )}
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

      {/* Mobile Layout - New card-based design */}
      <div className='space-y-4 px-4 md:hidden'>
        {campaigns.map(campaign => (
          <Card
            key={campaign.id}
            className={`w-full ${
              isStakingEnabled &&
              activeCampaign &&
              activeCampaign.campaignName === campaign.campaignName
                ? 'border-green-500 bg-green-500/5'
                : ''
            }`}
          >
            <CardContent className='p-4'>
              {/* Header with logo and title */}
              <div className='mb-4 flex items-center gap-3'>
                <Link
                  href={`/campaign/${campaign.campaignName}`}
                  className='transition-opacity hover:opacity-80'
                >
                  <Image
                    className='h-12 w-12 cursor-pointer rounded-lg'
                    src={campaign.imageUrl}
                    alt={campaign.campaignName}
                    width={48}
                    height={48}
                  />
                </Link>
                <div className='flex flex-col'>
                  <Link
                    href={`/campaign/${campaign.campaignName}`}
                    className='hover:underline'
                  >
                    <div className='text-card-foreground flex cursor-pointer items-center gap-2 text-lg font-medium'>
                      {campaign.campaignName}
                      {isStakingEnabled &&
                        activeCampaign &&
                        activeCampaign.campaignName ===
                          campaign.campaignName && (
                          <div className='flex items-center gap-1 rounded-full bg-gradient-to-r from-green-400 to-green-500 px-2 py-0.5'>
                            <span className='text-xs font-semibold text-black'>
                              STAKING
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
                        )}
                    </div>
                  </Link>
                  <div className='text-muted-foreground text-sm'>
                    {campaign.campaignType}
                  </div>
                </div>
              </div>

              {/* Stats as line items - same format as campaign page */}
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
                    {campaign.rewardPool}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground text-sm'>
                    Daily Reward
                  </span>
                  <span className='text-card-foreground font-medium'>
                    {campaign.dailyReward}
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

              {/* Action buttons */}
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
