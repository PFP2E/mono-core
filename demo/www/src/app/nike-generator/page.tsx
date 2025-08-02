'use client'

import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { XSignInModal } from '@/components/x-signin-modal'
import { Icons } from '@/components/icons'
import { useXSession } from '@/hooks/useXSession'
import { useSIWE } from '@/hooks/useSIWE'
import { Upload, CheckCircle, Loader2 } from 'lucide-react'
import { campaigns } from '@/lib/mock-data'
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

  // Simulate loading for 4.0 seconds
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
            <p className='text-muted-foreground text-lg'>
              Create custom PFP overlays and earn rewards
            </p>
          </div>
          <Card className='shadow-lg'>
            <CardContent className='p-8'>
              <div className='mb-6'>
                <Upload className='text-muted-foreground mx-auto mb-4 h-16 w-16 opacity-50' />
                <h2 className='mb-2 text-xl font-semibold'>
                  Sign in to Continue
                </h2>
                <p className='text-muted-foreground'>
                  Connect with X to access the AI Generator and create your
                  custom PFP overlays.
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size='lg'
                    className='w-full bg-[#1D9BF0] text-white hover:bg-[#1a8cd8]'
                  >
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
  const mogaccImagePath = `/images/Users/${username}/${username}_nike.jpg`

  // Get MOG campaign data from mock data
  const mogCampaign = campaigns.find(c => c.campaignName === 'NIKE')

  // Debug logging
  console.log('Username:', username)
  console.log('X PFP Path:', xpfpImagePath)
  console.log('MOGACC Path:', mogaccImagePath)

  return (
    <div className='container mx-auto px-4 py-4'>
      <div className='mx-auto max-w-4xl'>
        <div className='mb-4 text-center'>
          <h1 className='mb-2 text-4xl font-bold'>Nike AI Generator</h1>
          <p className='text-muted-foreground text-lg'>
            Use this Nike filter on your PFP to be entered into the raffle
          </p>
        </div>

        <div className='grid grid-cols-1 gap-2 lg:grid-cols-3'>
          {/* Left Column - User Images (Larger) */}
          <div className='lg:col-span-2'>
            <Card className='h-full'>
              <CardHeader className='pb-2'>
                <CardTitle>Your Images</CardTitle>
              </CardHeader>
              <CardContent className='flex h-full flex-col p-3'>
                <div className='flex h-full gap-3'>
                  {/* X PFP */}
                  <div className='flex flex-1 flex-col'>
                    <div className='text-muted-foreground mb-2 text-sm font-medium'>
                      X PFP
                    </div>
                    <div className='relative w-full flex-1 overflow-hidden rounded-lg border'>
                      <Image
                        src={xpfpImagePath}
                        alt={`${username} X PFP`}
                        fill
                        className='object-cover'
                      />
                    </div>
                  </div>

                  {/* MOGACC */}
                  <div className='flex flex-1 flex-col'>
                    <div className='text-muted-foreground mb-2 text-sm font-medium'>
                      MOG/ACC
                    </div>
                    <div className='relative w-full flex-1 overflow-hidden rounded-lg border'>
                      {isLoadingMogacc ? (
                        <div className='bg-muted/20 flex h-full w-full items-center justify-center'>
                          <div className='flex flex-col items-center gap-2'>
                            <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
                            <p className='text-muted-foreground text-sm'>
                              Processing...
                            </p>
                          </div>
                        </div>
                      ) : (
                        <Image
                          src={mogaccImagePath}
                          alt={`${username} MOGACC`}
                          fill
                          className='object-cover'
                        />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Campaign Stats (Smaller) */}
          <div className='flex h-full flex-col space-y-2'>
            <Card className='flex-1'>
              <CardHeader className='pb-2'>
                <CardTitle className='text-lg'>Nike Campaign</CardTitle>
              </CardHeader>
              <CardContent className='space-y-2 p-3'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Participants</span>
                  <span className='font-medium'>
                    {mogCampaign?.stakers.toLocaleString() || '1,456'}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Reward Pool</span>
                  <span className='font-medium'>
                    {mogCampaign?.rewardPool || 'Raffle'}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Daily Reward</span>
                  <span className='font-medium'>
                    {mogCampaign?.dailyReward || 'N/A'}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>NFT floor APY</span>
                  <span className='font-medium'>
                    {typeof mogCampaign?.apy === 'number'
                      ? `${mogCampaign.apy}%`
                      : mogCampaign?.apy || 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className='flex-1'>
              <CardContent className='flex h-full flex-col justify-center p-3'>
                <div className='text-center'>
                  <h3 className='mb-2 text-base font-semibold'>
                    Make Your X PFP
                  </h3>
                  <p className='text-muted-foreground mb-3 text-sm'>
                    Apply the Nike overlay to your X profile picture and start
                    earning rewards
                  </p>
                  <Button
                    size='sm'
                    className='w-full'
                    onClick={() => setShowConfirmDialog(true)}
                  >
                    Make Nike my X PFP
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
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
                  Set Nike as X Profile Picture
                </DialogTitle>
                <DialogDescription className='text-base text-gray-400'>
                  Do you want to set this Nike image as your X profile picture?
                </DialogDescription>
              </DialogHeader>

              {/* User Info */}
              <div className='flex items-center gap-3 py-2'>
                <div className='flex items-center gap-3'>
                  {session?.pfpUrl && (
                    <Image
                      src={session.pfpUrl}
                      alt='Profile'
                      width={40}
                      height={40}
                      className='rounded-full'
                    />
                  )}
                  <div>
                    <p className='text-[15px] font-bold'>
                      @{session?.username}
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
                        .addPfpUpdate('MOG/ACC', 'MOG', session.username)
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
