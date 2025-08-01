// src/app/create-campaign/page.tsx
'use client'

import { CreateCampaign } from '@/components/create-campaign'
import { useSIWE } from '@/hooks/useSIWE'
import { useXSession } from '@/hooks/useXSession'
import * as React from 'react'

const CreateCampaignPage = () => {
  const { isAuthenticated } = useSIWE()
  const { isXAuthenticated } = useXSession()
  const isAuthed = isAuthenticated || isXAuthenticated

  if (!isAuthed) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <p>Please sign in to create a campaign.</p>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4'>
      <CreateCampaign />
    </div>
  )
}

export default CreateCampaignPage
