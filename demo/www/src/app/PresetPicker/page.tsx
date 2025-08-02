'use client'

import * as React from 'react'
import { useSIWE } from '@/hooks/useSIWE'
import { useXSession } from '@/hooks/useXSession'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Upload, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import { useActivityStore } from '@/store/activity.store'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'

const AiGeneratorPage = () => {
  const { isAuthenticated } = useSIWE()
  const { isXAuthenticated, session } = useXSession()
  const isAuthed = isAuthenticated || isXAuthenticated
  const username = session?.username?.toLowerCase()

  // State for overlay selection
  const [selectedOverlay, setSelectedOverlay] = React.useState('')

  // Get profile picture URL if available
  const pfpUrl = session?.pfpUrl

  // Image upload state
  const [uploadedImageUrl, setUploadedImageUrl] = React.useState<string>('')

  // Dialog states
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)

  // Simple overlay options with earning text
  const overlayOptions = username
    ? [
        {
          value: 'mogacc',
          label: 'MOGACC',
          path: `/images/Users/${username}/${username}_mogacc.jpg`,
          earningText: 'Earn 12k MOG / Day'
        },
        {
          value: '1inch',
          label: '1INCH',
          path: `/images/Users/${username}/${username}_1inch.jpg`,
          earningText: 'Earn 15k 1INCH / Day'
        }
      ]
    : []

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null

    if (file) {
      // Create a URL for the uploaded image
      const imageUrl = URL.createObjectURL(file)
      setUploadedImageUrl(imageUrl)
    } else {
      setUploadedImageUrl('')
    }
  }

  console.log('Profile URL:', pfpUrl)
  console.log('Username:', username)
  console.log('Overlay options:', overlayOptions)

  if (!isAuthed) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <p>Please sign in to use the AI Generator.</p>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mx-auto max-w-2xl'>
        <h1 className='mb-8 text-center text-4xl font-bold'>AI Generator</h1>

        <Card className='shadow-lg'>
          <CardContent className='space-y-4 p-4'>
            {/* Overlay Selection */}
            <div className='mx-auto max-w-sm'>
              <Label className='mb-2 block text-center'>
                Pick your overlay
              </Label>
              <Select
                value={selectedOverlay}
                onValueChange={setSelectedOverlay}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select your overlay' />
                </SelectTrigger>
                <SelectContent>
                  {overlayOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Image Display Area */}
            <div className='bg-muted border-border relative mx-auto h-[400px] w-[400px] overflow-hidden rounded-xl border-2 shadow-sm'>
              {uploadedImageUrl ? (
                // Show uploaded image
                <Image
                  src={uploadedImageUrl}
                  alt='Uploaded Image'
                  fill
                  sizes='400px'
                  className='object-cover'
                  priority
                />
              ) : selectedOverlay ? (
                // Show the selected pre-made image
                <Image
                  src={
                    overlayOptions.find(opt => opt.value === selectedOverlay)
                      ?.path || ''
                  }
                  alt='Generated Image'
                  fill
                  sizes='400px'
                  className='object-cover'
                  priority
                />
              ) : pfpUrl ? (
                // Show profile picture if no overlay selected
                <Image
                  src={pfpUrl}
                  alt='Profile'
                  fill
                  sizes='400px'
                  className='object-cover'
                  priority
                />
              ) : (
                // Fallback if no image available
                <div className='flex h-full flex-col items-center justify-center gap-4'>
                  <Upload className='text-muted-foreground h-12 w-12 opacity-50' />
                  <p className='text-muted-foreground text-lg'>
                    Select an overlay or upload image
                  </p>
                </div>
              )}
            </div>

            {/* Upload Image Button */}
            <div className='space-y-2 text-center'>
              <Button
                className='bg-green-500 px-8 text-white hover:bg-green-600'
                asChild
              >
                <label htmlFor='image-upload' className='cursor-pointer'>
                  Upload Image
                  <input
                    id='image-upload'
                    type='file'
                    className='sr-only'
                    accept='image/*'
                    onChange={handleImageUpload}
                  />
                </label>
              </Button>
            </div>
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
                  Set as X Profile Picture
                </DialogTitle>
                <DialogDescription className='text-base text-gray-400'>
                  Do you want to set this image as your X profile picture?
                </DialogDescription>
              </DialogHeader>

              {/* User Info */}
              <div className='flex items-center gap-3 py-2'>
                <div className='flex items-center gap-3'>
                  {pfpUrl && (
                    <Image
                      src={pfpUrl}
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
                    const selectedOption = overlayOptions.find(
                      opt => opt.value === selectedOverlay
                    )
                    const tokenName =
                      selectedOption?.value === 'mogacc' ? 'MOG' : '1INCH'

                    // Add to activity history
                    if (session?.username && selectedOption) {
                      useActivityStore
                        .getState()
                        .addPfpUpdate(
                          selectedOption.label,
                          tokenName,
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

export default AiGeneratorPage
