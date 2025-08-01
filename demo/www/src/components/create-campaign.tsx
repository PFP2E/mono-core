// src/components/create-campaign.tsx
'use client'

import * as React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  RadioGroup,
  RadioGroupItem
} from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Upload } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'

const mockCollections = [
  {
    name: 'Bored Ape Yacht Club',
    address: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D'
  },
  {
    name: 'CryptoPunks',
    address: '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB'
  },
  {
    name: 'Pudgy Penguins',
    address: '0xBd3531dA5CF5857e7CfAA92426877b022e612cf8'
  }
]

type CampaignType = 'nft' | 'overlay'

export function CreateCampaign() {
  const [step, setStep] = React.useState(1)
  const [campaignName, setCampaignName] = React.useState('')
  const [campaignDescription, setCampaignDescription] = React.useState('')
  const [campaignType, setCampaignType] = React.useState<CampaignType>('nft')
  const [nftCollection, setNftCollection] = React.useState('')
  const [requireOwnership, setRequireOwnership] = React.useState(false)
  const [overlayFile, setOverlayFile] = React.useState<File | null>(null)
  const [rewardPool, setRewardPool] = React.useState('')
  const [dailyReward, setDailyReward] = React.useState('')
  const { toast } = useToast()

  const handleNext = () => setStep(prev => prev + 1)
  const handleBack = () => setStep(prev => prev - 1)

  const handleCollectionChange = (value: string) => {
    const selected = mockCollections.find(c => c.address === value)
    if (selected) {
      setNftCollection(selected.address)
    }
  }

  const handleLaunch = () => {
    // This is a mock launch, so we just show a toast notification.
    toast({
      title: 'Campaign Launched!',
      description: 'Your new campaign is now active (simulation).'
    })
    // Optionally, reset state and go back to step 1
    // setStep(1);
    // ... reset all other states
  }

  const getCollectionName = (address: string) => {
    return mockCollections.find(c => c.address === address)?.name || 'Custom'
  }

  const renderStep = () => {
    switch (step) {
      case 1: // Basic Details
        return (
          <div className='space-y-4'>
            <div>
              <Label htmlFor='campaignName'>Campaign Name</Label>
              <Input
                id='campaignName'
                value={campaignName}
                onChange={e => setCampaignName(e.target.value)}
                placeholder='e.g. BAYC Social Staking'
              />
            </div>
            <div>
              <Label htmlFor='campaignDescription'>Description</Label>
              <Input
                id='campaignDescription'
                value={campaignDescription}
                onChange={e => setCampaignDescription(e.target.value)}
                placeholder='Reward your holders for showing support'
              />
            </div>
          </div>
        )
      case 2: // Campaign Type
        return (
          <RadioGroup
            value={campaignType}
            onValueChange={(value: CampaignType) => setCampaignType(value)}
            className='space-y-2'
          >
            <Label>Campaign Type</Label>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='nft' id='nft' />
              <Label htmlFor='nft'>NFT-Based Campaign</Label>
            </div>
            <p className='text-muted-foreground ml-6 text-sm'>
              Reward users for using an NFT from a specific collection as their
              PFP.
            </p>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='overlay' id='overlay' />
              <Label htmlFor='overlay'>Overlay Campaign</Label>
            </div>
            <p className='text-muted-foreground ml-6 text-sm'>
              Reward users for applying a specific overlay to their PFP.
            </p>
          </RadioGroup>
        )
      case 3: // Configure Rules
        if (campaignType === 'nft') {
          return (
            <div className='space-y-4'>
              <div>
                <Label>Choose Collection</Label>
                <Select
                  onValueChange={handleCollectionChange}
                  defaultValue={nftCollection}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select a collection' />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCollections.map(col => (
                      <SelectItem key={col.address} value={col.address}>
                        {col.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor='nftAddress'>Contract Address</Label>
                <Input
                  id='nftAddress'
                  value={nftCollection}
                  onChange={e => setNftCollection(e.target.value)}
                  placeholder='0x...'
                />
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='requireOwnership'
                  checked={requireOwnership}
                  onCheckedChange={checked =>
                    setRequireOwnership(Boolean(checked))
                  }
                />
                <Label htmlFor='requireOwnership'>
                  Require wallet to own the NFT
                </Label>
              </div>
            </div>
          )
        }
        if (campaignType === 'overlay') {
          return (
            <div className='space-y-4'>
              <Label>Upload Overlay</Label>
              <div className='border-dashed border-border flex h-32 w-full items-center justify-center rounded-md border-2'>
                <Button variant='outline' asChild>
                  <label
                    htmlFor='overlay-upload'
                    className='flex cursor-pointer items-center gap-2'
                  >
                    <Upload className='h-4 w-4' />
                    <span>
                      {overlayFile ? overlayFile.name : 'Upload Image'}
                    </span>
                    <input
                      id='overlay-upload'
                      type='file'
                      className='sr-only'
                      onChange={e =>
                        setOverlayFile(e.target.files?.[0] ?? null)
                      }
                    />
                  </label>
                </Button>
              </div>
              <p className='text-muted-foreground text-sm'>
                This is a mock component. File upload is not functional.
              </p>
            </div>
          )
        }
        return null
      case 4: // Define Rewards
        return (
          <div className='space-y-4'>
            <div>
              <Label htmlFor='rewardPool'>Total Reward Pool</Label>
              <Input
                id='rewardPool'
                value={rewardPool}
                onChange={e => setRewardPool(e.target.value)}
                placeholder='e.g. 1,000,000 RWT'
              />
            </div>
            <div>
              <Label htmlFor='dailyReward'>Daily Reward</Label>
              <Input
                id='dailyReward'
                value={dailyReward}
                onChange={e => setDailyReward(e.target.value)}
                placeholder='e.g. 10,000 RWT'
              />
            </div>
          </div>
        )
      case 5: // Review & Launch
        return (
          <div className='space-y-4'>
            <h3 className='font-medium'>Review Campaign Details</h3>
            <div className='text-muted-foreground space-y-2 rounded-md border p-4'>
              <p>
                <strong>Name:</strong> {campaignName}
              </p>
              <p>
                <strong>Description:</strong> {campaignDescription}
              </p>
              <p>
                <strong>Type:</strong>{' '}
                {campaignType === 'nft' ? 'NFT-Based' : 'Overlay'}
              </p>
              {campaignType === 'nft' && (
                <>
                  <p>
                    <strong>Collection:</strong> {getCollectionName(nftCollection)}
                  </p>
                  <p>
                    <strong>Address:</strong> {nftCollection}
                  </p>
                  <p>
                    <strong>Ownership Required:</strong>{' '}
                    {requireOwnership ? 'Yes' : 'No'}
                  </p>
                </>
              )}
              {campaignType === 'overlay' && (
                <p>
                  <strong>Overlay File:</strong>{' '}
                  {overlayFile?.name || 'Not selected'}
                </p>
              )}
              <p>
                <strong>Total Rewards:</strong> {rewardPool}
              </p>
              <p>
                <strong>Daily Rewards:</strong> {dailyReward}
              </p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className='my-8'>
      <Toaster />
      <Card>
        <CardHeader>
          <CardTitle>Create a New Campaign</CardTitle>
          <CardDescription>
            Step {step} of 5: {['Basic Details', 'Campaign Type', 'Configure Rules', 'Define Rewards', 'Review & Launch'][step - 1]}
          </CardDescription>
        </CardHeader>
        <CardContent>{renderStep()}</CardContent>
        <CardFooter className='flex justify-between'>
          {step > 1 ? (
            <Button variant='outline' onClick={handleBack}>
              Back
            </Button>
          ) : <div />}
          {step < 5 && (
            <Button onClick={handleNext}>
              Next
            </Button>
          )}
          {step === 5 && (
            <Button onClick={handleLaunch}>
              Launch Campaign
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
