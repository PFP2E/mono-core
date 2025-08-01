import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { campaigns } from '@/lib/mock-data'

const ApyIndicator = ({ color }: { color: 'green' | 'orange' }) => (
  <div className='flex h-3 w-3 items-center justify-center'>
    <div
      className={`h-[5px] w-1.5 ${color === 'green' ? 'bg-green-500' : 'bg-orange-700'}`}
    />
  </div>
)

export const Marketplace = () => {
  return (
    <div className='py-16'>
      <h2 className='text-foreground mb-8 text-center text-3xl font-bold sm:text-4xl'>
        Marketplace
      </h2>
      <div className='mx-auto w-full max-w-6xl overflow-x-auto'>
        <Card className='border-border bg-card/50 min-w-[1024px] overflow-hidden rounded-3xl'>
          <CardHeader className='bg-muted/50 border-border grid grid-cols-12 gap-4 border-b px-4 py-3'>
            <div className='text-muted-foreground col-span-4 text-sm font-medium'>
              Campaign
            </div>
            <div className='text-muted-foreground col-span-2 text-sm font-medium'>
              Participants
            </div>
            <div className='text-muted-foreground col-span-2 text-sm font-medium'>
              Reward Pool
            </div>
            <div className='text-muted-foreground col-span-2 text-sm font-medium'>
              Daily Reward
            </div>
            <div className='text-muted-foreground col-span-2 text-sm font-medium'>
              NFT floor APY
            </div>
          </CardHeader>

          <CardContent className='p-0'>
            {campaigns.map(campaign => (
              <div
                key={campaign.id}
                className='border-border grid grid-cols-12 items-center gap-4 border-b px-4 py-4 last:border-b-0'
              >
                <div className='col-span-4 flex items-center gap-4'>
                  <Image
                    className='h-16 w-16 rounded-xl'
                    src={campaign.imageUrl}
                    alt={campaign.name.replace('<br/>', ' ')}
                    width={64}
                    height={64}
                  />
                  <div
                    className='text-card-foreground text-base leading-snug font-medium'
                    dangerouslySetInnerHTML={{ __html: campaign.name }}
                  />
                </div>
                <div className='text-card-foreground col-span-2 text-base leading-snug font-medium'>
                  {campaign.participants.toLocaleString()}
                </div>
                <div className='text-card-foreground col-span-2 text-base leading-snug font-medium'>
                  {campaign.rewardPool}
                </div>
                <div className='text-card-foreground col-span-2 text-base leading-snug font-medium'>
                  {campaign.dailyReward}
                </div>
                <div className='col-span-2 flex items-center justify-end gap-4'>
                  <div className='flex items-center gap-1'>
                    <ApyIndicator color={campaign.apyColor} />
                    <div className='text-card-foreground text-base leading-snug font-medium'>
                      {campaign.apy}%
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button
                      disabled={!campaign.fundable}
                      variant='secondary'
                      size='sm'
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
    </div>
  )
}
