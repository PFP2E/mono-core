'use client'

import * as React from 'react'
import { useSIWE } from '@/hooks/useSIWE'
import { useXSession } from '@/hooks/useXSession'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Upload } from 'lucide-react'
import Image from 'next/image'

const AiGeneratorPage = () => {
  const { isAuthenticated } = useSIWE()
  const { isXAuthenticated, session } = useXSession()
  const isAuthed = isAuthenticated || isXAuthenticated
  const username = session?.username?.toLowerCase()

  // State for overlay selection
  const [selectedOverlay, setSelectedOverlay] = React.useState('')
  
  // Get profile picture URL if available
  const pfpUrl = session?.pfpUrl

  // Simple overlay options
  const overlayOptions = username ? [
    { value: 'mogacc', label: 'MOGACC', path: `/images/Users/${username}/${username}_mogacc.jpg` },
    { value: '1inch', label: '1INCH', path: `/images/Users/${username}/${username}_1inch.jpg` }
  ] : []

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
          <CardContent className="p-8 space-y-8">
            {/* Overlay Selection */}
            <div className="max-w-sm mx-auto">
              <Label className="text-center block mb-2 text-lg">Pick your overlay</Label>
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


          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AiGeneratorPage