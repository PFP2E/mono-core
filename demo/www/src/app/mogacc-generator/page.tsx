'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { XSignInModal } from '@/components/x-signin-modal'
import { Icons } from '@/components/icons'
import { useXSession } from '@/hooks/useXSession'
import { useSIWE } from '@/hooks/useSIWE'
import { Upload, CheckCircle, Loader2 } from 'lucide-react'
import { campaigns, type Campaign } from '@/lib/mock-data'
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import { useActivityStore } from '@/store/activity.store'

export default function AIGeneratorPage() {
  const { isAuthenticated } = useSIWE()
  const { isXAuthenticated, session } = useXSession()

  const isAuthed = isAuthenticated || isXAuthenticated

  // Dialog states
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  
  // Loading state for MOG/ACC image
  const [isLoadingMogacc, setIsLoadingMogacc] = React.useState(true)

  // Get MOG campaign data from mock data with fallback values
  const mogCampaign = campaigns.find((c: Campaign) => c.campaignName === 'MOG') || {
    stakers: 2456,
    rewardPool: '118M MOG',
    dailyReward: '480 MOG',
    apy: 'N/A'
  }

  // Simulate loading for 4 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingMogacc(false)
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  if (!isAuthed) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='mx-auto max-w-md text-center'>
          <div className='mb-8'>
            <h1 className='mb-4 text-4xl font-bold'>AI Generator</h1>
            <p className='text-lg text-muted-foreground'>
              Create custom PFP overlays and earn rewards
            </p>
          </div>
          <Card className='shadow-lg'>
            <CardContent className='p-8'>
              <div className='mb-6'>
                <Upload className='mx-auto mb-4 h-16 w-16 text-muted-foreground opacity-50' />
                <h2 className='mb-2 text-xl font-semibold'>Sign in to Continue</h2>
                <p className='text-muted-foreground'>
                  Connect with X to access the AI Generator and create your custom PFP overlays.
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size='lg' className='w-full bg-[#1D9BF0] hover:bg-[#1a8cd8] text-white'>
                    <Icons.X className='mr-2 h-5 w-5' />
                    Sign in with X
                  </Button>
                </DialogTrigger>
                <XSignInModal />
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Get username from X session (convert to lowercase like PresetPicker)
  const username = session?.username?.toLowerCase() || 'bhodl2'
  
  // Construct image paths
  const xpfpImagePath = `/images/Users/${username}/${username}_xpfp.jpg`
  const mogaccImagePath = `/images/Users/${username}/${username}_mogacc.jpg`

  return (
    <div className='container mx-auto px-4 py-4'>
      <div className='mx-auto max-w-4xl'>
        <div className='mb-6'>
          <Button variant='outline' asChild>
            <Link href='/'>← Back Home</Link>
          </Button>
        </div>
        
        <div className='mb-3 text-center'>
          <h1 className='mb-1 text-4xl font-bold'>MOG/ACC AI Generator</h1>
          <p className='text-lg text-muted-foreground'>
            Use this MOG/ACC filter on your PFP to earn rewards
          </p>
        </div>

        <div className='grid grid-cols-1 gap-2 lg:grid-cols-3 lg:grid-flow-col'>
          {/* Left Column - User Images (spans 2 columns) */}
          <div className='lg:col-span-2 h-full'>
            <Card className='h-full flex flex-col'>
              <CardHeader className='pb-1'>
                <CardTitle>Your Images</CardTitle>
              </CardHeader>
              <CardContent className='p-2 flex-1'>
                <div className='flex flex-row gap-2 h-full'>
                  {/* X PFP */}
                  <div className='flex-1'>
                    <div className='text-center mb-0.5'>
                      <div className='text-sm font-medium text-muted-foreground'>X PFP</div>
                    </div>
                    <div className='relative w-full overflow-hidden rounded-lg border' style={{ aspectRatio: '1/1' }}>
                      <Image
                        src={xpfpImagePath}
                        alt={`${username} X PFP`}
                        fill
                        className='object-contain'
                      />
                    </div>
                  </div>
                  
                  {/* MOGACC */}
                  <div className='flex-1'>
                    <div className='text-center mb-0.5'>
                      <div className='text-sm font-medium text-muted-foreground'>MOG/ACC</div>
                    </div>
                    <div className='relative w-full overflow-hidden rounded-lg border' style={{ aspectRatio: '1/1' }}>
                      {isLoadingMogacc ? (
                        <div className='flex h-full w-full items-center justify-center bg-muted/20'>
                          <div className='flex flex-col items-center gap-2'>
                            <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
                            <p className='text-sm text-muted-foreground'>Processing...</p>
                          </div>
                        </div>
                      ) : (
                        <Image
                          src={mogaccImagePath}
                          alt={`${username} MOGACC`}
                          fill
                          className='object-contain'
                        />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats and Button */}
          <div className='flex flex-col gap-2 h-full'>
            {/* Stats Card */}
            <Card className='flex-1'>
              <CardHeader className='pb-1'>
                <CardTitle>MOGACC Campaign</CardTitle>
              </CardHeader>
              <CardContent className='p-2'>
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Participants</span>
                    <span className='font-medium'>{mogCampaign.stakers.toLocaleString()}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Reward Pool</span>
                    <span className='font-medium'>{mogCampaign.rewardPool}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Daily Reward</span>
                    <span className='font-medium'>{mogCampaign.dailyReward}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>NFT floor APY</span>
                    <span className='font-medium'>
                      {typeof mogCampaign.apy === 'number' ? `${mogCampaign.apy}%` : mogCampaign.apy}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Button Card - Desktop Only */}
            <Card className='hidden lg:block'>
              <CardContent className='p-2 text-center'>
                <h3 className='mb-1 text-base font-semibold'>Make Your X PFP</h3>
                <p className='mb-2 text-sm text-muted-foreground'>
                  Apply the MOGACC overlay to your X profile picture and start earning rewards
                </p>
                <Button 
                  size='lg' 
                  className='w-full'
                  onClick={() => setShowConfirmDialog(true)}
                >
                  Make MOG/ACC my X PFP
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Button Card - Mobile Only */}
        <Card className='mt-2 lg:hidden'>
          <CardContent className='p-2 text-center'>
            <h3 className='mb-1 text-base font-semibold'>Make Your X PFP</h3>
            <p className='mb-2 text-sm text-muted-foreground'>
              Apply the MOGACC overlay to your X profile picture and start earning rewards
            </p>
            <Button 
              size='lg' 
              className='w-full'
              onClick={() => setShowConfirmDialog(true)}
            >
              Make MOG/ACC my X PFP
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* X PFP Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className='border border-gray-700 bg-black text-white sm:max-w-[480px]'>
          {isSuccess ? (
            <div className='space-y-3 py-6 text-center'>
              <DialogTitle className='text-center text-xl font-bold'>
                X PFP Updated
              </DialogTitle>
              <div className='flex justify-center'>
                <div className='rounded-full bg-green-500/10 p-3 text-green-500'>
                  <CheckCircle className='h-6 w-6' />
                </div>
              </div>
            </div>
          ) : (
            <>
              <DialogHeader className='space-y-3'>
                <DialogTitle className='text-xl font-bold'>
                  Set MOG/ACC as X Profile Picture
                </DialogTitle>
                <DialogDescription className='text-base text-gray-400'>
                  Do you want to set this MOG/ACC image as your X profile picture?
                </DialogDescription>
              </DialogHeader>

              {/* User Info */}
              <div className='flex items-center gap-3 py-2'>
                <div className='flex items-center gap-3'>
                  <Image
                    src={mogaccImagePath}
                    alt='MOG/ACC Preview'
                    width={40}
                    height={40}
                    className='rounded-full'
                  />
                  <div>
                    <p className='text-[15px] font-bold'>
                      @{session?.username}
                    </p>
                    <p className='text-xs text-gray-400'>
                      MOG/ACC PFP Preview
                    </p>
                  </div>
                </div>
              </div>

              <div className='flex gap-3 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  className='h-9 flex-1 rounded-full border-gray-600 bg-transparent font-bold text-white hover:bg-gray-900'
                  onClick={() => {
                    setShowConfirmDialog(false)
                    setIsSuccess(false)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type='button'
                  className='h-9 flex-1 rounded-full bg-[#1D9BF0] font-bold text-white hover:bg-[#1a8cd8]'
                  onClick={() => {
                    setIsSuccess(true)
                    
                    // Add to activity history
                    if (session?.username) {
                      useActivityStore
                        .getState()
                        .addPfpUpdate(
                          'MOG/ACC',
                          'MOG',
                          session.username
                        )
                    }

                    // Close dialog after 2 seconds
                    setTimeout(() => {
                      setShowConfirmDialog(false)
                      setIsSuccess(false)
                    }, 2000)
                  }}
                >
                  Confirm
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}