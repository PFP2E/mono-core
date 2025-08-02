'use client'

import * as React from 'react'
import { useSIWE } from '@/hooks/useSIWE'
import { useXSession } from '@/hooks/useXSession'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

const AiGeneratorPage = () => {
  const { isAuthenticated } = useSIWE()
  const { isXAuthenticated, session } = useXSession()
  const isAuthed = isAuthenticated || isXAuthenticated
  const username = session?.username?.toLowerCase()
  
  // State for overlay selection
  const [selectedOverlay, setSelectedOverlay] = React.useState('')
  
  // Get profile picture URL if available
  const pfpUrl = session?.pfpUrl

  // Dialog states
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)

  // Simple overlay options with earning text
  const overlayOptions = username ? [
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
  ] : []

  const handleMakeXPfp = () => {
    setShowConfirmDialog(true)
  }

  console.log('Profile URL:', pfpUrl)
  console.log('Username:', username)
  console.log('Overlay options:', overlayOptions)

  if (!isAuthed) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Please sign in to use the AI Generator.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">AI Generator</h1>
        
        <Card className="shadow-lg">
          <CardContent className="p-4 space-y-4">
            {/* Overlay Selection */}
            <div className="max-w-sm mx-auto">
              <Label className="text-center block mb-2">Pick your overlay</Label>
              <Select value={selectedOverlay} onValueChange={setSelectedOverlay}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your overlay" />
                </SelectTrigger>
                <SelectContent>
                  {overlayOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Image Display Area */}
            <div className="mx-auto w-[400px] h-[400px] relative bg-muted rounded-xl overflow-hidden border-2 border-border shadow-sm">
              {selectedOverlay ? (
                // Show the selected pre-made image
                <Image
                  src={overlayOptions.find(opt => opt.value === selectedOverlay)?.path || ''}
                  alt="Generated Image"
                  fill
                  sizes="400px"
                  className="object-cover"
                  priority
                />
              ) : pfpUrl ? (
                // Show profile picture if no overlay selected
                <Image
                  src={pfpUrl}
                  alt="Profile"
                  fill
                  sizes="400px"
                  className="object-cover"
                  priority
                />
              ) : (
                // Fallback if no image available
                <div className="flex items-center justify-center h-full flex-col gap-4">
                  <Upload className="h-12 w-12 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground text-lg">Select an overlay</p>
                </div>
              )}
            </div>

            {/* Earning Text and Button */}
            {selectedOverlay && (
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold">
                  {overlayOptions.find(opt => opt.value === selectedOverlay)?.earningText}
                </p>
                <Button 
                  className="bg-green-500 hover:bg-green-600 text-white px-8"
                  onClick={handleMakeXPfp}
                >
                  Make My X PFP
                </Button>
              </div>
            )}

          </CardContent>
        </Card>
      </div>

      {/* X PFP Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-[480px] bg-black text-white border border-gray-700">
          {isSuccess ? (
            <div className="py-6 text-center space-y-3">
              <DialogTitle className="text-xl font-bold text-center">X PFP Updated</DialogTitle>
              <div className="flex justify-center">
                <div className="bg-green-500/10 text-green-500 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
            </div>
          ) : (
            <>
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-xl font-bold">Set as X Profile Picture</DialogTitle>
                <DialogDescription className="text-gray-400 text-base">
                  Do you want to set this image as your X profile picture?
                </DialogDescription>
              </DialogHeader>

              {/* User Info */}
              <div className="flex items-center gap-3 py-2">
                <div className="flex items-center gap-3">
                  {pfpUrl && (
                    <Image
                      src={pfpUrl}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-bold text-[15px]">@{session?.username}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-9 bg-transparent text-white border-gray-600 hover:bg-gray-900 rounded-full font-bold"
                  onClick={() => {
                    setShowConfirmDialog(false)
                    setIsSuccess(false)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="flex-1 h-9 bg-[#1D9BF0] hover:bg-[#1a8cd8] text-white rounded-full font-bold"
                  onClick={() => {
                    setIsSuccess(true)
                    const selectedOption = overlayOptions.find(opt => opt.value === selectedOverlay)
                    const tokenName = selectedOption?.value === 'mogacc' ? 'MOG' : '1INCH'
                    
                    // Add to activity history
                    if (session?.username && selectedOption) {
                      useActivityStore.getState().addPfpUpdate(
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