'use client'

import * as React from 'react'
import { useSIWE } from '@/hooks/useSIWE'
import { useXSession } from '@/hooks/useXSession'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Upload } from 'lucide-react'
import Image from 'next/image'

const AiGeneratorPage = () => {
  const { isAuthenticated } = useSIWE()
  const { isXAuthenticated, session } = useXSession()
  const isAuthed = isAuthenticated || isXAuthenticated

  // State for overlay selection and image upload
  const [selectedOverlay, setSelectedOverlay] = React.useState<string>('')
  const [uploadedImage, setUploadedImage] = React.useState<File | null>(null)

  // Get profile picture URL if available
  const pfpUrl = session?.pfpUrl

  if (!isAuthed) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <p>Please sign in to use the AI Generator.</p>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4'>
      <Card>
        <CardHeader>
          <CardTitle>AI Generator</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Overlay Selection */}
          <div className='space-y-2'>
            <Label>Pick your overlay</Label>
            <Select value={selectedOverlay} onValueChange={setSelectedOverlay}>
              <SelectTrigger>
                <SelectValue placeholder='Select an overlay type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='1inch'>1 INCH</SelectItem>
                <SelectItem value='mog-acc'>MOG/ACC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Image Display Area */}
          <div className='mx-auto w-[400px] h-[400px] relative bg-zinc-100 dark:bg-zinc-900 rounded-lg overflow-hidden'>
            {pfpUrl ? (
              <Image
                src={pfpUrl}
                alt='Profile'
                fill
                className='object-cover'
                priority
              />
            ) : uploadedImage ? (
              <Image
                src={URL.createObjectURL(uploadedImage)}
                alt='Uploaded'
                fill
                className='object-cover'
                priority
              />
            ) : (
              <div className='flex items-center justify-center h-full'>
                <p className='text-muted-foreground'>No image selected</p>
              </div>
            )}
          </div>

          {/* Upload Button */}
          <div className='flex justify-center'>
            <Button variant='outline' asChild>
              <label htmlFor='image-upload' className='flex cursor-pointer items-center gap-2'>
                <Upload className='h-4 w-4' />
                <span>{uploadedImage ? uploadedImage.name : 'Upload Image'}</span>
                <input
                  id='image-upload'
                  type='file'
                  className='sr-only'
                  accept='image/*'
                  onChange={e => setUploadedImage(e.target.files?.[0] ?? null)}
                />
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AiGeneratorPage