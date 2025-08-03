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
import Image from 'next/image'
import { ethers } from 'ethers'
import { cn } from '@/lib/utils/cn'

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

const mockRewardTokens = [
  {
    name: 'ETH',
    address: '0xD76b5c2A23ef78368d8E34288B5b65D616B746aE'
  },
  {
    name: 'APE',
    address: '0x4d224452801ACEd8B2F0aebE155379bb5D594381'
  },
  {
    name: 'BITCOIN',
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
  },
  {
    name: 'MOG',
    address: '0x1234567890123456789012345678901234567890'
  },
  {
    name: 'PUDGY',
    address: '0x4567890123456789012345678901234567890123'
  }
]

type CampaignType = 'nft' | 'overlay'
const steps = [
  'Basic Details',
  'Campaign Type',
  'Select NFT Collection',
  'Define Rewards',
  'Conditions',
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

import Link from 'next/link'

export function CreateCampaign() {
  const [step, setStep] = React.useState(1)
  const [campaignName, setCampaignName] = React.useState('')
  const [campaignDescription, setCampaignDescription] = React.useState('')
  const [campaignType, setCampaignType] = React.useState<CampaignType>('nft')
  const [nftCollection, setNftCollection] = React.useState('')
  const [overlayFile, setOverlayFile] = React.useState<File | null>(null)
  const [overlayImageUrl, setOverlayImageUrl] = React.useState<string>('')
  const [loraFile, setLoraFile] = React.useState<File | null>(null)
  const [aiPrompt, setAiPrompt] = React.useState<string>('')
  const [rewardToken, setRewardToken] = React.useState('')
  const [rewardTokenDropdown, setRewardTokenDropdown] = React.useState('')
  const [dailyRewardPercentage, setDailyRewardPercentage] = React.useState('')
  const [tokenInfo, setTokenInfo] = React.useState({ symbol: '', decimals: 18 })
  const [fetchingToken, setFetchingToken] = React.useState(false)
  const [createNewToken, setCreateNewToken] = React.useState(false)
  const [tokenName, setTokenName] = React.useState('')
  const [tokenSymbol, setTokenSymbol] = React.useState('')
  const [initialSupply, setInitialSupply] = React.useState('')
  const [poolPercentage, setPoolPercentage] = React.useState('')
  const [collectionInfo, setCollectionInfo] = React.useState({
    name: '',
    found: false
  })
  const [nftInfo, setNftInfo] = React.useState({ name: '', symbol: '' })
  const [fetchingNft, setFetchingNft] = React.useState(false)

  // Step 5 state variables
  const [durationEnabled, setDurationEnabled] = React.useState(false)
  const [eligibilityEnabled, setEligibilityEnabled] = React.useState(false)
  const [followerCountEnabled, setFollowerCountEnabled] = React.useState(false)
  const [twitterBlueEnabled, setTwitterBlueEnabled] = React.useState(false)
  const [twitterBlueValue, setTwitterBlueValue] = React.useState('')
  const [impressionsEnabled, setImpressionsEnabled] = React.useState(false)
  const [platformsEnabled, setPlatformsEnabled] = React.useState(false)
  const [platformIG, setPlatformIG] = React.useState(false)
  const [platformFB, setPlatformFB] = React.useState(false)
  const [platformTT, setPlatformTT] = React.useState(false)
  const [platformFarcaster, setPlatformFarcaster] = React.useState(false)
  const [platformDiscord, setPlatformDiscord] = React.useState(false)

  // Input values for conditions
  const [durationDays, setDurationDays] = React.useState('')
  const [followerCount, setFollowerCount] = React.useState('')
  const [impressionsCount, setImpressionsCount] = React.useState('')
  const [impressionsDays, setImpressionsDays] = React.useState('')

  const { toast } = useToast()

  const handleOverlayFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setOverlayFile(file)

    if (file) {
      // Create a URL for the uploaded image
      const imageUrl = URL.createObjectURL(file)
      setOverlayImageUrl(imageUrl)
    } else {
      setOverlayImageUrl('')
    }
  }

  const handleLoraFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setLoraFile(file)
  }

  const handleNext = () => {
    setStep(prev => Math.min(prev + 1, steps.length))

    // Auto-scroll to top on mobile when advancing to next step
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1))

  const handleLaunch = () => {
    toast({
      title: 'Campaign Launched! (Simulation)',
      description: 'Your new campaign is now notionally active.'
    })
  }

  // Validation for step 1
  const isStep1Valid = () => {
    return campaignName && campaignName.trim().length > 0
  }

  // Validation for step 3
  const isStep3Valid = () => {
    if (step !== 3) return true
    if (campaignType !== 'nft') return true

    // Must have either selected from dropdown or entered a valid contract address
    return nftCollection && nftCollection.trim().length > 0
  }

  // Validation for step 4
  const isStep4Valid = () => {
    if (step !== 4) return true

    // Must have selected a daily reward percentage
    if (!dailyRewardPercentage) return false

    if (createNewToken) {
      // For new token, all 4 fields must be filled
      return tokenName && tokenSymbol && initialSupply && poolPercentage
    } else {
      // For existing token, must have either dropdown selected or valid token found
      return (
        rewardTokenDropdown ||
        (tokenInfo.symbol &&
          tokenInfo.symbol !== 'Error' &&
          tokenInfo.symbol !== 'Unknown')
      )
    }
  }

  // Validation for step 5 (Conditions)
  const isStep5Valid = () => {
    if (step !== 5) return true

    // If duration is enabled, must have a value
    if (durationEnabled && !durationDays.trim()) return false

    // If follower count is enabled, must have a value
    if (followerCountEnabled && !followerCount.trim()) return false

    // If impressions is enabled, must have both values
    if (
      impressionsEnabled &&
      (!impressionsCount.trim() || !impressionsDays.trim())
    )
      return false

    // Twitter Blue and Platforms don't need validation as they have dropdowns/checkboxes
    return true
  }

  // Helper functions for input validation styling
  const getDurationInputClass = () => {
    if (!durationEnabled) return ''
    return durationDays.trim()
      ? 'border-green-500 focus:border-green-500'
      : 'border-red-500 focus:border-red-500'
  }

  const getFollowerCountInputClass = () => {
    if (!followerCountEnabled || !eligibilityEnabled) return ''
    return followerCount.trim()
      ? 'border-green-500 focus:border-green-500'
      : 'border-red-500 focus:border-red-500'
  }

  const getImpressionsCountInputClass = () => {
    if (!impressionsEnabled) return ''
    return impressionsCount.trim()
      ? 'border-green-500 focus:border-green-500'
      : 'border-red-500 focus:border-red-500'
  }

  const getImpressionsDaysInputClass = () => {
    if (!impressionsEnabled) return ''
    return impressionsDays.trim()
      ? 'border-green-500 focus:border-green-500'
      : 'border-red-500 focus:border-red-500'
  }

  const getCollectionName = (address: string) => {
    return mockCollections.find(c => c.address === address)?.name || 'Custom'
  }

  const fetchTokenInfo = async (tokenAddress: string) => {
    if (
      !tokenAddress ||
      !tokenAddress.startsWith('0x') ||
      tokenAddress.length !== 42
    ) {
      setTokenInfo({ symbol: '', decimals: 18 })
      return
    }

    setFetchingToken(true)
    try {
      // Use any public RPC endpoint (Ethereum mainnet)
      const provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com')

      // ERC20 ABI for symbol and decimals
      const tokenABI = [
        {
          constant: true,
          inputs: [],
          name: 'symbol',
          outputs: [{ name: '', type: 'string' }],
          payable: false,
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'decimals',
          outputs: [{ name: '', type: 'uint8' }],
          payable: false,
          type: 'function'
        }
      ]

      const token = new ethers.Contract(tokenAddress, tokenABI, provider)
      const [symbol, decimals] = await Promise.all([
        token.symbol(),
        token.decimals()
      ])

      setTokenInfo({
        symbol: symbol || 'Unknown',
        decimals: typeof decimals === 'bigint' ? Number(decimals) : decimals
      })
    } catch (error) {
      console.error('Error fetching token info:', error)
      setTokenInfo({ symbol: 'Error', decimals: 18 })
    } finally {
      setFetchingToken(false)
    }
  }

  const handleTokenAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setRewardToken(value)

    // Clear dropdown selection when manually entering address
    if (value && value.startsWith('0x')) {
      // Check if it matches any known token
      const knownToken = mockRewardTokens.find(
        t => t.address.toLowerCase() === value.toLowerCase()
      )
      if (knownToken) {
        setRewardTokenDropdown(knownToken.address)
        setTokenInfo({ symbol: knownToken.name, decimals: 18 })
      } else {
        setRewardTokenDropdown('') // Clear the dropdown selection
        // Fetch token info from blockchain
        fetchTokenInfo(value)
      }
    } else {
      setRewardTokenDropdown('')
      setTokenInfo({ symbol: '', decimals: 18 })
    }
  }

  const fetchNftInfo = async (collectionAddress: string) => {
    if (
      !collectionAddress ||
      !collectionAddress.startsWith('0x') ||
      collectionAddress.length !== 42
    ) {
      setNftInfo({ name: '', symbol: '' })
      return
    }

    setFetchingNft(true)
    try {
      // Use any public RPC endpoint (Ethereum mainnet)
      const provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com')

      // ERC721 ABI for name and symbol
      const nftABI = [
        {
          constant: true,
          inputs: [],
          name: 'name',
          outputs: [{ name: '', type: 'string' }],
          payable: false,
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'symbol',
          outputs: [{ name: '', type: 'string' }],
          payable: false,
          type: 'function'
        }
      ]

      const nftContract = new ethers.Contract(
        collectionAddress,
        nftABI,
        provider
      )
      const [name, symbol] = await Promise.all([
        nftContract.name(),
        nftContract.symbol()
      ])

      setNftInfo({
        name: name || 'Unknown Collection',
        symbol: symbol || 'Unknown'
      })
    } catch (error) {
      console.error('Error fetching NFT info:', error)
      setNftInfo({ name: 'Error', symbol: 'Error' })
    } finally {
      setFetchingNft(false)
    }
  }

  const handleCollectionAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value
    setNftCollection(value)

    // Clear dropdown selection when manually entering address
    if (value && value.startsWith('0x')) {
      // Check if it matches any known collection
      const knownCollection = mockCollections.find(
        c => c.address.toLowerCase() === value.toLowerCase()
      )
      if (knownCollection) {
        setCollectionInfo({ name: knownCollection.name, found: true })
        setNftInfo({ name: knownCollection.name, symbol: '' })
      } else {
        setCollectionInfo({ name: '', found: false })
        // Fetch NFT info from blockchain
        fetchNftInfo(value)
      }
    } else {
      setCollectionInfo({ name: '', found: false })
      setNftInfo({ name: '', symbol: '' })
    }
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
        title: 'Define Conditions',
        description:
          'Set up PFP2E verification rules to ensure quality participation. Choose from duration, eligibility, performance, and behavior conditions.'
      },
      6: {
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
                  autoComplete='off'
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
                  Derivative Campaign
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
                      onValueChange={value => {
                        setNftCollection(value)

                        // Check if it matches any known collection
                        if (value && value.startsWith('0x')) {
                          const knownCollection = mockCollections.find(
                            c => c.address.toLowerCase() === value.toLowerCase()
                          )
                          if (knownCollection) {
                            setCollectionInfo({
                              name: knownCollection.name,
                              found: true
                            })
                            setNftInfo({
                              name: knownCollection.name,
                              symbol: ''
                            })
                          } else {
                            setCollectionInfo({ name: '', found: false })
                            setNftInfo({ name: '', symbol: '' })
                          }
                        }
                      }}
                      value={
                        nftInfo.name && nftInfo.name !== 'Error'
                          ? ''
                          : nftCollection
                      }
                      disabled={!!(nftInfo.name && nftInfo.name !== 'Error')}
                    >
                      <SelectTrigger
                        className={
                          nftInfo.name && nftInfo.name !== 'Error'
                            ? 'cursor-not-allowed opacity-50'
                            : ''
                        }
                      >
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
                      onChange={handleCollectionAddressChange}
                      placeholder='0x...'
                    />
                    {fetchingNft && (
                      <div className='text-muted-foreground mt-1 text-sm'>
                        Looking up collection...
                      </div>
                    )}
                    {nftCollection &&
                      nftCollection.startsWith('0x') &&
                      !fetchingNft && (
                        <div className='mt-1 text-sm'>
                          {collectionInfo.found ? (
                            <div className='font-medium text-green-600'>
                              Collection Match - {collectionInfo.name}
                            </div>
                          ) : nftInfo.name && nftInfo.name !== 'Error' ? (
                            <div className='font-medium text-blue-600'>
                              Collection: {nftInfo.name} ({nftInfo.symbol})
                            </div>
                          ) : (
                            <div className='font-medium text-red-600'>
                              No Collection Found
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                </>
              ) : (
                <>
                  <Label>Upload Overlay Image</Label>
                  <div className='space-y-3'>
                    {overlayImageUrl ? (
                      <div className='relative'>
                        <Image
                          src={overlayImageUrl}
                          alt='Uploaded overlay'
                          width={192}
                          height={192}
                          className='h-48 w-full rounded-md border object-contain'
                        />
                        <Button
                          variant='outline'
                          size='sm'
                          className='absolute top-2 right-2'
                          onClick={() => {
                            setOverlayFile(null)
                            setOverlayImageUrl('')
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className='flex h-32 w-full items-center justify-center rounded-md border-2 border-dashed'>
                        <Button variant='outline' asChild>
                          <label
                            htmlFor='overlay-upload'
                            className='flex cursor-pointer items-center gap-2'
                          >
                            <Upload className='h-4 w-4' />
                            <span>Upload Image</span>
                            <input
                              id='overlay-upload'
                              type='file'
                              className='sr-only'
                              accept='image/*'
                              onChange={handleOverlayFileChange}
                            />
                          </label>
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* LoRA File Upload Section */}
                  <div>
                    <Label>Upload SafeTensor LoRA File</Label>
                    <p className='text-muted-foreground mb-2 text-xs'>
                      Upload a .safetensors LoRA file for Stable Diffusion
                      derivatives
                    </p>
                    <div className='space-y-3'>
                      {loraFile ? (
                        <div className='bg-muted/50 flex items-center justify-between rounded-lg border p-3'>
                          <div className='flex items-center gap-2'>
                            <div className='flex h-8 w-8 items-center justify-center rounded bg-blue-500'>
                              <span className='text-xs font-bold text-white'>
                                .safetensors
                              </span>
                            </div>
                            <div>
                              <p className='text-sm font-medium'>
                                {loraFile.name}
                              </p>
                              <p className='text-muted-foreground text-xs'>
                                {(loraFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => setLoraFile(null)}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className='flex h-24 w-full items-center justify-center rounded-md border-2 border-dashed'>
                          <Button variant='outline' asChild>
                            <label
                              htmlFor='lora-upload'
                              className='flex cursor-pointer items-center gap-2'
                            >
                              <Upload className='h-4 w-4' />
                              <span>Upload .safetensors File</span>
                              <input
                                id='lora-upload'
                                type='file'
                                className='sr-only'
                                accept='.safetensors'
                                onChange={handleLoraFileChange}
                              />
                            </label>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* AI Prompt Section */}
                  <div>
                    <Label>AI Generation Prompt</Label>
                    <p className='text-muted-foreground mb-2 text-xs'>
                      Describe what you want the AI to generate (e.g.,
                      &quot;1INCH branded hoodie&quot;, &quot;Coke can
                      overlay&quot;)
                    </p>
                    <textarea
                      value={aiPrompt}
                      onChange={e => setAiPrompt(e.target.value)}
                      placeholder='Enter your AI generation prompt here...'
                      className='bg-background focus:ring-primary h-24 w-full resize-none rounded-md border p-3 text-sm focus:border-transparent focus:ring-2 focus:outline-none'
                    />
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
                <Label>Choose Reward Token</Label>
                <Select
                  onValueChange={value => {
                    setRewardTokenDropdown(value)
                    setRewardToken(value)
                    setTokenInfo({ symbol: '', decimals: 18 }) // Clear lookup info when selecting from dropdown
                  }}
                  value={rewardTokenDropdown}
                  disabled={
                    !!(
                      createNewToken ||
                      (tokenInfo.symbol &&
                        tokenInfo.symbol !== 'Error' &&
                        tokenInfo.symbol !== 'Unknown')
                    )
                  }
                >
                  <SelectTrigger
                    className={cn(
                      createNewToken ||
                        (tokenInfo.symbol &&
                          tokenInfo.symbol !== 'Error' &&
                          tokenInfo.symbol !== 'Unknown')
                        ? 'cursor-not-allowed opacity-50'
                        : ''
                    )}
                  >
                    <SelectValue placeholder='Select a reward token' />
                  </SelectTrigger>
                  <SelectContent>
                    {mockRewardTokens.map(token => (
                      <SelectItem key={token.address} value={token.address}>
                        {token.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor='rewardTokenAddress'>
                  Or Enter Reward Token Contract Address
                </Label>
                <Input
                  id='rewardTokenAddress'
                  value={rewardToken}
                  onChange={handleTokenAddressChange}
                  placeholder='0x...'
                  disabled={createNewToken}
                  className={
                    createNewToken ? 'cursor-not-allowed opacity-50' : ''
                  }
                />
                {fetchingToken && (
                  <div className='text-muted-foreground text-sm'>
                    Looking up token...
                  </div>
                )}
                {tokenInfo.symbol && !fetchingToken && (
                  <div className='text-primary text-sm font-medium'>
                    Token: {tokenInfo.symbol} ({tokenInfo.decimals} decimals)
                  </div>
                )}
                <div className='flex items-center space-x-2 pt-2'>
                  <Checkbox
                    id='createNewToken'
                    checked={createNewToken}
                    onCheckedChange={checked =>
                      setCreateNewToken(Boolean(checked))
                    }
                  />
                  <Label htmlFor='createNewToken'>
                    Create New Reward Token
                  </Label>
                </div>

                {createNewToken && (
                  <div className='mt-3 space-y-3'>
                    <h3 className='text-primary text-lg font-semibold'>
                      Create New Reward Token
                    </h3>
                    <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                      <div>
                        <Label htmlFor='tokenName'>Token Name *</Label>
                        <Input
                          id='tokenName'
                          value={tokenName}
                          onChange={e => setTokenName(e.target.value)}
                          placeholder='Bored Ape Yacht Club'
                          className='mt-1'
                        />
                      </div>
                      <div>
                        <Label htmlFor='tokenSymbol'>Token Symbol *</Label>
                        <Input
                          id='tokenSymbol'
                          value={tokenSymbol}
                          onChange={e => setTokenSymbol(e.target.value)}
                          placeholder='APE'
                          className='mt-1'
                        />
                      </div>
                    </div>
                    <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                      <div>
                        <Label htmlFor='initialSupply'>Initial Supply *</Label>
                        <Input
                          id='initialSupply'
                          value={initialSupply}
                          onChange={e => setInitialSupply(e.target.value)}
                          placeholder='1,000,000,000'
                          className='mt-1'
                        />
                      </div>
                      <div>
                        <Label htmlFor='poolPercentage'>
                          % to Reward Pool *
                        </Label>
                        <Input
                          id='poolPercentage'
                          value={poolPercentage}
                          onChange={e => setPoolPercentage(e.target.value)}
                          placeholder='10'
                          className='mt-1'
                        />
                        <div className='text-muted-foreground mt-1 text-xs'>
                          10% to Pool, 90% to Deployer
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <InfoPanel step={4} />

            <div className='mt-3'>
              <Label htmlFor='dailyRewardPercentage'>
                Daily Reward Pool Emit %
              </Label>
              <Select
                onValueChange={setDailyRewardPercentage}
                defaultValue={dailyRewardPercentage}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select daily reward percentage' />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(percentage => (
                    <SelectItem key={percentage} value={percentage.toString()}>
                      {percentage}%
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className='text-muted-foreground mt-1 text-xs'>
                Total % of pool rewarded to stakers
              </div>
            </div>
          </>
        )
      case 5:
        return (
          <>
            <div className='space-y-4'>
              <div>
                <Label className='mb-4 text-base font-semibold'>
                  PFP2E Verification Rules
                </Label>
                <p className='text-muted-foreground mb-6 text-sm'>
                  Choose from the curated core conditions to ensure quality
                  participation in your campaign.
                </p>

                {/* WEAR CAMPAIGN PFP - Always Active */}
                <div className='mb-6 space-y-4'>
                  <div className='flex items-center space-x-2'>
                    <Checkbox checked={true} disabled={true} />
                    <h3 className='text-lg font-semibold'>WEAR CAMPAIGN PFP</h3>
                  </div>
                  <p className='text-muted-foreground text-sm'>
                    Mandatory requirement to wear the campaign PFP.
                  </p>
                  <div className='bg-muted/50 rounded-lg border p-3'>
                    <div>
                      <Label className='font-medium'>Wear Campaign PFP</Label>
                      <p className='text-muted-foreground text-xs'>
                        Must wear campaign PFP (NFT or Derivative) to earn
                        rewards
                      </p>
                    </div>
                  </div>
                </div>

                {/* DURATION Section */}
                <div className='mb-6 space-y-4'>
                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      checked={durationEnabled}
                      onCheckedChange={checked => {
                        setDurationEnabled(checked as boolean)
                        if (!checked) {
                          // Reset duration input when section is disabled
                          setDurationDays('')
                        }
                      }}
                    />
                    <h3 className='text-lg font-semibold'>
                      DURATION (Consistency of Support)
                    </h3>
                  </div>
                  <p className='text-muted-foreground text-sm'>
                    Ensures users maintain the PFP signal over time.
                  </p>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between rounded-lg border p-3'>
                      <div>
                        <Label className='font-medium'>
                          Minimum consecutive days staked
                        </Label>
                        <p className='text-muted-foreground text-xs'>
                          Must keep PFP unchanged for X days in a row
                        </p>
                      </div>
                      <div>
                        <Input
                          className={`w-20 ${getDurationInputClass()}`}
                          placeholder='e.g. 7'
                          disabled={!durationEnabled}
                          value={durationDays}
                          onChange={e => setDurationDays(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ELIGIBILITY Section */}
                <div className='mb-6 space-y-4'>
                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      checked={eligibilityEnabled}
                      onCheckedChange={checked => {
                        setEligibilityEnabled(checked as boolean)
                        if (!checked) {
                          // Reset all eligibility sub-sections when main section is disabled
                          setFollowerCountEnabled(false)
                          setTwitterBlueEnabled(false)
                          setTwitterBlueValue('')
                          setFollowerCount('')
                        }
                        // Note: When checked, sub-sections remain disabled until individually enabled
                      }}
                    />
                    <h3 className='text-lg font-semibold'>
                      ELIGIBILITY (User Qualifiers)
                    </h3>
                  </div>
                  <p className='text-muted-foreground text-sm'>
                    Verifies identity, status, or location of the user.
                  </p>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between rounded-lg border p-3'>
                      <div>
                        <Label className='font-medium'>
                          Minimum follower count
                        </Label>
                        <p className='text-muted-foreground text-xs'>
                          Basic reach filter
                        </p>
                      </div>
                      <div className='flex items-center space-x-3'>
                        <Input
                          className={`w-20 ${getFollowerCountInputClass()}`}
                          placeholder='e.g. 1000'
                          disabled={
                            !followerCountEnabled || !eligibilityEnabled
                          }
                          value={followerCount}
                          onChange={e => setFollowerCount(e.target.value)}
                        />
                        <Checkbox
                          checked={followerCountEnabled}
                          onCheckedChange={checked => {
                            setFollowerCountEnabled(checked as boolean)
                            if (!checked) {
                              // Reset follower count input when section is disabled
                              setFollowerCount('')
                            }
                          }}
                          disabled={!eligibilityEnabled}
                        />
                      </div>
                    </div>
                    <div className='flex items-center justify-between rounded-lg border p-3'>
                      <div>
                        <Label className='font-medium'>
                          Must be Twitter Blue
                        </Label>
                        <p className='text-muted-foreground text-xs'>
                          Filter for paying/serious users
                        </p>
                      </div>
                      <div className='flex items-center space-x-3'>
                        <Select
                          disabled={!twitterBlueEnabled || !eligibilityEnabled}
                          value={twitterBlueValue}
                          onValueChange={setTwitterBlueValue}
                        >
                          <SelectTrigger className='w-24'>
                            <SelectValue placeholder='Yes/No' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='yes'>Yes</SelectItem>
                            <SelectItem value='no'>No</SelectItem>
                          </SelectContent>
                        </Select>
                        <Checkbox
                          checked={twitterBlueEnabled}
                          onCheckedChange={checked => {
                            setTwitterBlueEnabled(checked as boolean)
                            if (!checked) {
                              // Reset Twitter Blue dropdown when section is disabled
                              setTwitterBlueValue('')
                            }
                          }}
                          disabled={!eligibilityEnabled}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* PERFORMANCE Section */}
                <div className='mb-6 space-y-4'>
                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      checked={impressionsEnabled}
                      onCheckedChange={checked => {
                        setImpressionsEnabled(checked as boolean)
                        if (!checked) {
                          // Reset impressions inputs when section is disabled
                          setImpressionsCount('')
                          setImpressionsDays('')
                        }
                      }}
                    />
                    <h3 className='text-lg font-semibold'>
                      PERFORMANCE (Output / Earned Visibility)
                    </h3>
                  </div>
                  <p className='text-muted-foreground text-sm'>
                    Reward users based on what they generate, not just who they
                    are.
                  </p>
                  <div className='space-y-3'>
                    <div className='flex flex-col space-y-3 rounded-lg border p-3 md:flex-row md:items-center md:justify-between md:space-y-0'>
                      <div>
                        <Label className='font-medium'>
                          Impressions in last X days
                        </Label>
                        <p className='text-muted-foreground text-xs'>
                          Great signal of real visibility
                        </p>
                      </div>
                      <div className='flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-2'>
                        <div className='flex items-center space-x-2'>
                          <Input
                            className={`w-full md:w-32 ${getImpressionsCountInputClass()}`}
                            placeholder='e.g. 1,000,000'
                            disabled={!impressionsEnabled}
                            value={impressionsCount}
                            onChange={e => setImpressionsCount(e.target.value)}
                          />
                          <span className='text-muted-foreground text-sm'>
                            impressions
                          </span>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <Input
                            className={`w-full md:w-20 ${getImpressionsDaysInputClass()}`}
                            placeholder='e.g. 30'
                            disabled={!impressionsEnabled}
                            value={impressionsDays}
                            onChange={e => setImpressionsDays(e.target.value)}
                          />
                          <span className='text-muted-foreground text-sm'>
                            days
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CONNECTION Section */}
                <div className='space-y-4'>
                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      checked={platformsEnabled}
                      onCheckedChange={checked => {
                        setPlatformsEnabled(checked as boolean)
                        if (!checked) {
                          // Reset all platform checkboxes when section is disabled
                          setPlatformIG(false)
                          setPlatformFB(false)
                          setPlatformTT(false)
                          setPlatformFarcaster(false)
                          setPlatformDiscord(false)
                        }
                      }}
                    />
                    <h3 className='text-lg font-semibold'>
                      CONNECTION / BEHAVIOR HISTORY
                    </h3>
                  </div>
                  <p className='text-muted-foreground text-sm'>
                    Encourage consistency and non-spam behavior.
                  </p>
                  <div className='space-y-3'>
                    <div className='flex flex-col space-y-3 rounded-lg border p-3 md:flex-row md:items-center md:justify-between md:space-y-0'>
                      <div>
                        <Label className='font-medium'>
                          Must have PFP verified on multiple platforms
                        </Label>
                        <p className='text-muted-foreground text-xs'>
                          Cross-platform loyalty
                        </p>
                      </div>
                      <div className='flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2'>
                        {/* First row: IG, FB, TT */}
                        <div className='flex items-center space-x-2'>
                          <Checkbox
                            checked={platformIG}
                            onCheckedChange={checked =>
                              setPlatformIG(checked as boolean)
                            }
                            disabled={!platformsEnabled}
                          />
                          <Label className='text-xs'>IG</Label>
                          <Checkbox
                            checked={platformFB}
                            onCheckedChange={checked =>
                              setPlatformFB(checked as boolean)
                            }
                            disabled={!platformsEnabled}
                          />
                          <Label className='text-xs'>FB</Label>
                          <Checkbox
                            checked={platformTT}
                            onCheckedChange={checked =>
                              setPlatformTT(checked as boolean)
                            }
                            disabled={!platformsEnabled}
                          />
                          <Label className='text-xs'>TT</Label>
                        </div>
                        {/* Second row: Farcaster, Discord */}
                        <div className='flex items-center space-x-2'>
                          <Checkbox
                            checked={platformFarcaster}
                            onCheckedChange={checked =>
                              setPlatformFarcaster(checked as boolean)
                            }
                            disabled={!platformsEnabled}
                          />
                          <Label className='text-xs'>Farcaster</Label>
                          <Checkbox
                            checked={platformDiscord}
                            onCheckedChange={checked =>
                              setPlatformDiscord(checked as boolean)
                            }
                            disabled={!platformsEnabled}
                          />
                          <Label className='text-xs'>Discord</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <InfoPanel step={5} />
          </>
        )
      case 6:
        return (
          <>
            <div className='space-y-4'>
              <div className='text-muted-foreground space-y-3 rounded-lg border bg-zinc-50 p-6 dark:bg-zinc-900'>
                <dl className='grid grid-cols-2 gap-x-4 gap-y-2 text-sm'>
                  <dt className='text-foreground font-medium'>Campaign Name</dt>
                  <dd>{campaignName || 'N/A'}</dd>

                  <dt className='text-foreground font-medium'>
                    Campaign Description
                  </dt>
                  <dd>{campaignDescription || 'N/A'}</dd>

                  <dt className='text-foreground font-medium'>Type</dt>
                  <dd>{campaignType === 'nft' ? 'NFT-Based' : 'Overlay'}</dd>

                  {campaignType === 'nft' && (
                    <>
                      <dt className='text-foreground font-medium'>
                        NFT Collection Name
                      </dt>
                      <dd>
                        {nftInfo.name && nftInfo.name !== 'Error'
                          ? nftInfo.name
                          : getCollectionName(nftCollection)}
                      </dd>
                      <dt className='text-foreground font-medium'>
                        NFT Contract Address
                      </dt>
                      <dd className='truncate font-mono text-xs'>
                        {nftCollection}
                      </dd>
                    </>
                  )}

                  {campaignType === 'overlay' && (
                    <>
                      <dt className='text-foreground font-medium'>Asset</dt>
                      <dd>{overlayFile?.name || 'N/A'}</dd>
                    </>
                  )}

                  <dt className='text-foreground font-medium'>
                    Reward Token Name
                  </dt>
                  <dd>
                    {createNewToken
                      ? tokenName
                      : rewardTokenDropdown
                        ? mockRewardTokens.find(
                            t => t.address === rewardTokenDropdown
                          )?.name
                        : tokenInfo.symbol}
                  </dd>

                  <dt className='text-foreground font-medium'>
                    Reward Token Address
                  </dt>
                  <dd className='truncate font-mono text-xs'>
                    {createNewToken
                      ? 'Created At Launch'
                      : rewardToken || 'N/A'}
                  </dd>

                  {createNewToken && (
                    <>
                      <dt className='text-foreground font-medium'>
                        New Token Total Supply
                      </dt>
                      <dd>{initialSupply || 'N/A'}</dd>
                      <dt className='text-foreground font-medium'>
                        New Token To Reward Pool
                      </dt>
                      <dd>{poolPercentage ? `${poolPercentage}%` : 'N/A'}</dd>
                    </>
                  )}

                  <dt className='text-foreground font-medium'>
                    Daily Emit Rate %
                  </dt>
                  <dd>
                    {dailyRewardPercentage
                      ? `${dailyRewardPercentage}%`
                      : 'N/A'}
                  </dd>
                </dl>
              </div>

              {/* Conditions Section */}
              <div className='text-muted-foreground space-y-3 rounded-lg border bg-zinc-50 p-6 dark:bg-zinc-900'>
                <h3 className='text-foreground mb-4 font-medium'>Conditions</h3>
                <dl className='grid grid-cols-2 gap-x-4 gap-y-2 text-sm'>
                  {/* Always show Wear Campaign PFP */}
                  <dt className='text-foreground font-medium'>
                    Wear Campaign PFP
                  </dt>
                  <dd>Yes</dd>

                  {/* Show enabled conditions with their values */}
                  {durationEnabled && (
                    <>
                      <dt className='text-foreground font-medium'>
                        Minimum consecutive days
                      </dt>
                      <dd>{durationDays || 'N/A'}</dd>
                    </>
                  )}

                  {followerCountEnabled && (
                    <>
                      <dt className='text-foreground font-medium'>
                        Minimum follower count
                      </dt>
                      <dd>{followerCount || 'N/A'}</dd>
                    </>
                  )}

                  {twitterBlueEnabled && (
                    <>
                      <dt className='text-foreground font-medium'>
                        Must be Twitter Blue
                      </dt>
                      <dd>{twitterBlueValue || 'N/A'}</dd>
                    </>
                  )}

                  {impressionsEnabled && (
                    <>
                      <dt className='text-foreground font-medium'>
                        Impressions in last X days
                      </dt>
                      <dd>
                        {impressionsCount || 'N/A'} impressions in{' '}
                        {impressionsDays || 'N/A'} days
                      </dd>
                    </>
                  )}

                  {platformsEnabled && (
                    <>
                      <dt className='text-foreground font-medium'>
                        PFP verified on platforms
                      </dt>
                      <dd>
                        {[
                          platformIG && 'IG',
                          platformFB && 'FB',
                          platformTT && 'TT',
                          platformFarcaster && 'Farcaster',
                          platformDiscord && 'Discord'
                        ]
                          .filter(Boolean)
                          .join(', ') || 'None selected'}
                      </dd>
                    </>
                  )}
                </dl>
              </div>
            </div>
            <InfoPanel step={6} />
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className='my-8 space-y-6'>
      <div className='mb-6'>
        <Button variant='outline' asChild>
          <Link href='/'>← Back Home</Link>
        </Button>
      </div>
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
            <Button
              onClick={handleNext}
              disabled={
                (step === 1 && !isStep1Valid()) ||
                (step === 3 && !isStep3Valid()) ||
                (step === 4 && !isStep4Valid()) ||
                (step === 5 && !isStep5Valid())
              }
            >
              Next
            </Button>
          ) : (
            <Button onClick={handleLaunch}>Launch Campaign</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
