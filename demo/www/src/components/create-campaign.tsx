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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Upload, Info } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { Stepper } from '@/components/ui/stepper'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

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
    name: 'Sproto Gremlins',
    address: '0x1234567890123456789012345678901234567890'
  },
  {
    name: 'Pudgy Penguins',
    address: '0xBd3531dA5CF5857e7CfAA92426877b022e612cf8'
  },
  {
    name: 'Milady Maker',
    address: '0x5af0d9827e0c53e4799bb226655a1de152a425a5'
  }
]

type CampaignType = 'nft' | 'overlay'
const steps = [
  'Basic Details',
  'Campaign Type',
  'Select NFT Collection',
  'Define Rewards',
  'Review & Launch'
]

const campaignTypeInfo = {
  nft: {
    title: 'NFT-Based Campaigns',
    description:
      'This is the most direct use case for web3 projects. The campaign rules require a user to set their PFP to an NFT from a specific collection. The protocol can verify that the user PFP is an exact match to an NFT in the target collection.'
  },
  overlay: {
    title: 'Overlay & Filter Campaigns',
    description:
      "These campaigns are ideal for brands and creators. Instead of requiring a specific image, the campaign only requires that a user's PFP contains a specific graphical element, such as a branded overlay or a promotional filter. This allows users to maintain their own identity while still showing support."
  }
}

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

  const handleNext = () => setStep(prev => Math.min(prev + 1, steps.length))
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1))

  const handleLaunch = () => {
    toast({
      title: 'Campaign Launched! (Simulation)',
      description: 'Your new campaign is now notionally active.'
    })
  }

  const getCollectionName = (address: string) => {
    return mockCollections.find(c => c.address === address)?.name || 'Custom'
  }

  const InfoPanel = ({ step }: { step: number }) => {
    const content: { [key: number]: { title: string; description: string } } = {
      1: {
        title: 'Welcome, Producer!',
        description:
          'You are the "Producer" in the Triadic Loop. Your goal is to define the rules of a campaign to spread your visual identity and mindshare.'
      },
      2: {
        title: campaignTypeInfo[campaignType].title,
        description: campaignTypeInfo[campaignType].description
      },
      3: {
        title: 'Define Your Rules',
        description:
          'Specify the exact requirements for your campaign. For NFT campaigns, this is the collection address. For overlays, it is the visual asset itself.'
      },
      4: {
        title: 'Fund the Campaign',
        description:
          'You are also the "Rewarder". Pre-load or stream incentives (money, tokens, perks) into the campaign\'s reward pool to attract "Consumers".'
      },
      5: {
        title: 'Ready to Launch?',
        description:
          'Review all the details of your campaign below. Once launched, the campaign will become active and users can begin participating.'
      }
    }
    const info = content[step]

    return (
      <Alert>
        <Info className='h-4 w-4' />
        <AlertTitle>{info.title}</AlertTitle>
        <AlertDescription>{info.description}</AlertDescription>
      </Alert>
    )
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='campaignName'>Campaign Name</Label>
                <Input
                  id='campaignName'
                  value={campaignName}
                  onChange={e => setCampaignName(e.target.value)}
                  placeholder='e.g. BAYC Social Staking'
                  autoComplete="off"
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
            <InfoPanel step={1} />
          </>
        )
      case 2:
        return (
          <>
            <RadioGroup
              value={campaignType}
              onValueChange={(value: CampaignType) => setCampaignType(value)}
              className='space-y-2'
            >
              <Label className='text-base font-semibold'>Campaign Type</Label>
              <div className='flex items-center space-x-2 rounded-md border p-4'>
                <RadioGroupItem value='nft' id='nft' />
                <Label htmlFor='nft' className='font-medium'>
                  NFT-Based Campaign
                </Label>
              </div>
              <div className='flex items-center space-x-2 rounded-md border p-4'>
                <RadioGroupItem value='overlay' id='overlay' />
                <Label htmlFor='overlay' className='font-medium'>
                  Overlay Campaign
                </Label>
              </div>
            </RadioGroup>
            <InfoPanel step={2} />
          </>
        )
      case 3:
        return (
          <>
            <div className='space-y-4'>
              {campaignType === 'nft' ? (
                <>
                  <div>
                    <Label>Choose NFT Collection</Label>
                    <Select
                      onValueChange={setNftCollection}
                      defaultValue={nftCollection}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select a known collection' />
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
                    <Label htmlFor='nftAddress'>
                      Or Enter NFT Contract Address
                    </Label>
                    <Input
                      id='nftAddress'
                      value={nftCollection}
                      onChange={e => setNftCollection(e.target.value)}
                      placeholder='0x...'
                    />
                  </div>

                </>
              ) : (
                <>
                  <Label>Upload Overlay Image</Label>
                  <div className='flex h-32 w-full items-center justify-center rounded-md border-2 border-dashed'>
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
                </>
              )}
            </div>
            <InfoPanel step={3} />
          </>
        )
      case 4:
        return (
          <>
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
            <InfoPanel step={4} />
          </>
        )
      case 5:
        return (
          <>
            <div className='space-y-4'>
              <div className='text-muted-foreground space-y-3 rounded-lg border bg-zinc-50 p-6 dark:bg-zinc-900'>
                <h3 className='text-foreground font-semibold'>
                  {campaignName}
                </h3>
                <p className='text-sm'>{campaignDescription}</p>
                <hr className='border-border' />
                <dl className='grid grid-cols-2 gap-x-4 gap-y-2 text-sm'>
                  <dt className='text-foreground font-medium'>Type</dt>
                  <dd>{campaignType === 'nft' ? 'NFT-Based' : 'Overlay'}</dd>

                  {campaignType === 'nft' && (
                    <>
                      <dt className='text-foreground font-medium'>
                        Collection
                      </dt>
                      <dd>{getCollectionName(nftCollection)}</dd>
                      <dt className='text-foreground font-medium'>Address</dt>
                      <dd className='truncate font-mono text-xs'>
                        {nftCollection}
                      </dd>
                      <dt className='text-foreground font-medium'>Ownership</dt>
                      <dd>{requireOwnership ? 'Required' : 'Not Required'}</dd>
                    </>
                  )}

                  {campaignType === 'overlay' && (
                    <>
                      <dt className='text-foreground font-medium'>Asset</dt>
                      <dd>{overlayFile?.name || 'N/A'}</dd>
                    </>
                  )}

                  <dt className='text-foreground font-medium'>Total Pool</dt>
                  <dd>{rewardPool || 'N/A'}</dd>
                  <dt className='text-foreground font-medium'>Daily Rate</dt>
                  <dd>{dailyReward || 'N/A'}</dd>
                </dl>
              </div>
            </div>
            <InfoPanel step={5} />
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className='my-8 space-y-8'>
      <Toaster />
      <Stepper steps={steps} currentStep={step} />
      <Card>
        <CardHeader>
          <CardTitle>Campaign Constructor</CardTitle>
          <CardDescription>
            A guided process for creating a new visual identity campaign.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
            {renderStepContent()}
          </div>
        </CardContent>
        <CardFooter className='flex justify-between'>
          <Button variant='outline' onClick={handleBack} disabled={step === 1}>
            Back
          </Button>
          {step < steps.length ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleLaunch}>Launch Campaign</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
