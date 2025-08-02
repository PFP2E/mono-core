'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2 } from 'lucide-react'
import { useXSession } from '@/hooks/useXSession'
import { useAuthStore } from '@/store/auth.store'

// Token conversion rates for testing
const CONVERSION_RATES = {
  APE_USD: 4.00,      // 1 APE = $4.00
  ETH_USD: 3500.00,   // 1 ETH = $3,500
  SUI_USD: 3.50       // 1 SUI = $3.50
}

// Conversion calculation functions
const parseApeAmount = (apeString: string): number => {
  return parseFloat(apeString.replace(' APE', ''))
}

const calculateSwaps = (apeAmount: number) => {
  const usdValue = apeAmount * CONVERSION_RATES.APE_USD
  return {
    usdt: usdValue.toFixed(2),                                    // 1 USDT = $1
    eth: (usdValue / CONVERSION_RATES.ETH_USD).toFixed(8),       // Convert USD to ETH
    sui: (usdValue / CONVERSION_RATES.SUI_USD).toFixed(2)        // Convert USD to SUI
  }
}

// Initial stake data template
const initialStake = {
  id: '1',
  name: 'BAYC',
  tokenId: 'Token #1234',
  stakedDate: '8/3/2025',
  totalEarned: '0.00 APE',
  unclaimed: '0.00 APE',
  claimedOrReady: '0.00 APE',
  matchPercent: '95.0% match'
}

// Main Rewards Component
export const Rewards = () => {
  const [stakeData, setStakeData] = useState(() => {
    // Load saved data on component mount
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('stakeData')
      if (saved) return JSON.parse(saved)
    }
    return initialStake
  })
  const [selectedStake, setSelectedStake] = useState<any>(null)
  const [selectedOption, setSelectedOption] = useState<'ape' | 'usdt' | 'eth' | 'sui' | null>(null)
  const [suiAddress, setSuiAddress] = useState('')
  const [addressError, setAddressError] = useState('')
  const [rewardUpdate, setRewardUpdate] = useState(0) // Force re-renders
  const [epochTime, setEpochTime] = useState(30) // Countdown from 30 seconds
  const { session } = useXSession()
  const { session: siweSession } = useAuthStore()
  const pfpUrl = session?.pfpUrl || '/images/BAYCNFT/0.png' // Fallback if no PFP

  // Save stake data helper
  const saveStakeData = (data: typeof initialStake) => {
    setStakeData(data)
    localStorage.setItem('stakeData', JSON.stringify(data))
  }

  // Simple countdown and reward timer
  useEffect(() => {
    if (!session) return

        const timer = setInterval(() => {
      if (epochTime === 0) {
        // At zero: add reward and reset timer
        const currentUnclaimed = parseApeAmount(stakeData.unclaimed)
        const currentTotal = parseApeAmount(stakeData.totalEarned)
        const newData = {
          ...stakeData,
          unclaimed: `${(currentUnclaimed + 5).toFixed(2)} APE`,
          totalEarned: `${(currentTotal + 5).toFixed(2)} APE`
        }
        saveStakeData(newData)
        setEpochTime(30)
      } else {
        // Not zero: count down
        setEpochTime(epochTime - 1)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [session, epochTime])

  const handleSuiAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value
    setSuiAddress(address)
    
    // Validate Sui address format (32 bytes / 64 characters hex string starting with 0x)
    const suiAddressRegex = /^0x[a-fA-F0-9]{64}$/
    if (address && !suiAddressRegex.test(address)) {
      setAddressError('Please enter a valid 32-byte Sui address')
    } else {
      setAddressError('')
    }
  }

  const handleClaim = () => {
    // TODO: Replace with actual MetaMask/wallet integration
    console.log('Claiming:', selectedOption, selectedStake?.unclaimed)
    
    // Simulate claim process
    alert(`Claiming ${selectedStake?.unclaimed} in ${selectedOption?.toUpperCase()}...\n\nThis will open MetaMask for transaction confirmation.\n\nFor testing: Transaction would be processed here.`)
    
    // Only zero out unclaimed tokens after successful claim (total earned stays the same)
    saveStakeData({
      ...stakeData,
      unclaimed: '0.00 APE'
    })
    
    // Close modal after "claim"
    setSelectedStake(null)
    setSelectedOption(null)
    setSuiAddress('')
    setAddressError('')
  }

  const handleTrashClick = () => {
    // Special test function to reset the entire card for testing
    saveStakeData({
      ...initialStake
    })
    // Force re-render to show changes
    setSelectedStake(null)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Active Staking Campaigns</h2>
      
      <Card className="bg-[#1a1a1a] border-[#333] w-full max-w-[400px] min-w-[280px]">
        <CardContent className="p-4">
          {/* Reset Button */}
          <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors text-[#888] mb-4" onClick={handleTrashClick}>
            <Trash2 className="h-4 w-4" />
            <span className="text-sm">Reset</span>
          </div>

          {/* Header with PFP and Token Info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Image
                src={pfpUrl}
                alt={stakeData.name}
                width={48}
                height={48}
                className="rounded-lg"
                unoptimized // Required for Twitter image URLs
              />
              <div>
                <div className="text-white text-xl font-semibold">{stakeData.name}</div>
                <div className="text-[#888]">{stakeData.tokenId}</div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-[#888] text-sm">Next Reward: {epochTime}s</div>
              <Badge className="bg-[#333] text-white hover:bg-[#444]">{stakeData.matchPercent}</Badge>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[#888]">Staked Date</span>
              <span className="text-[#ccc]">{stakeData.stakedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#888]">Total Earned</span>
              <span className="text-[#ccc]">{stakeData.totalEarned}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#888]">Unclaimed</span>
              <span className="text-green-400">{stakeData.unclaimed}</span>
            </div>
          </div>

          {/* Single Claim Button */}
          <div className="mt-4 space-y-4">
            <Button 
              className="w-full bg-green-500 hover:bg-green-600 text-white" 
              onClick={() => setSelectedStake(stakeData)}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Claim
              </span>
            </Button>

            {/* 1inch logo */}
            <div className="w-full flex justify-center">
              <Image
                src="/images/poweredby1inch.png"
                alt="Powered by 1inch"
                width={196}
                height={29}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      {selectedStake && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => {
            setSelectedStake(null)
            setSelectedOption(null)
            setSuiAddress('')
            setAddressError('')
          }}
        >
          <Card 
            className="w-[calc(100%-2rem)] max-w-md min-w-[280px] mx-4"
            onClick={e => e.stopPropagation()} // Prevent clicks inside card from closing modal
          >
            <CardContent className="p-6 pb-0">
              <h3 className="text-xl font-bold mb-1">Claim {selectedStake.unclaimed}</h3>
              <p className="text-[#888] text-sm mb-4">
                {selectedOption === 'sui' 
                  ? 'to SUI wallet' 
                  : `to wallet ${siweSession?.siwe?.address?.slice(0, 6)}...${siweSession?.siwe?.address?.slice(-4)}`
                }
              </p>
              
              {/* Claim Options */}
              <div className="space-y-3 mb-4">
                <button 
                  className={`w-full p-3 text-left border rounded bg-transparent text-white hover:bg-gray-800 transition-colors ${selectedOption === 'ape' ? 'border-green-400' : 'border-gray-600'}`}
                  onClick={() => setSelectedOption('ape')}
                >
                  <div className="flex justify-between items-center">
                    <span>Claim in APE</span>
                    <span className="text-gray-400">{selectedStake.unclaimed}</span>
                  </div>
                </button>
                
                <button 
                  className={`w-full p-3 text-left border rounded bg-transparent text-white hover:bg-gray-800 transition-colors ${selectedOption === 'usdt' ? 'border-green-400' : 'border-gray-600'}`}
                  onClick={() => setSelectedOption('usdt')}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span>Claim & Swap</span>
                      <span className="sm:ml-1">to USDT</span>
                    </div>
                    <span className="text-gray-400">≈ {calculateSwaps(parseApeAmount(selectedStake.unclaimed)).usdt} USDT</span>
                  </div>
                </button>
                
                <button 
                  className={`w-full p-3 text-left border rounded bg-transparent text-white hover:bg-gray-800 transition-colors ${selectedOption === 'eth' ? 'border-green-400' : 'border-gray-600'}`}
                  onClick={() => setSelectedOption('eth')}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span>Claim & Swap</span>
                      <span className="sm:ml-1">to ETH</span>
                    </div>
                    <span className="text-gray-400">≈ {calculateSwaps(parseApeAmount(selectedStake.unclaimed)).eth} ETH</span>
                  </div>
                </button>
                
                <button 
                  className={`w-full p-3 text-left border rounded bg-transparent text-white hover:bg-gray-800 transition-colors ${selectedOption === 'sui' ? 'border-green-400' : 'border-gray-600'}`}
                  onClick={() => setSelectedOption('sui')}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span>Claim & Swap</span>
                      <span className="sm:ml-1">to SUI</span>
                    </div>
                    <span className="text-gray-400">≈ {calculateSwaps(parseApeAmount(selectedStake.unclaimed)).sui} SUI</span>
                  </div>
                </button>
              </div>

              {/* SUI Address Input */}
              {selectedOption === 'sui' && (
                <div className="space-y-2 mb-4">
                  <label className="text-sm text-[#888]">Enter SUI wallet address to receive funds</label>
                  <input
                    type="text"
                    placeholder="0x906b5fc264539be8b1a5faa84441cf65e13e99ee555c0025d282770797cf99d1"
                    value={suiAddress}
                    onChange={handleSuiAddressChange}
                    className={`w-full p-2 border rounded ${addressError ? 'border-red-500' : suiAddress && !addressError ? 'border-green-400' : ''}`}
                  />
                  {addressError && (
                    <div className="text-xs text-red-500">{addressError}</div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 mb-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedStake(null)
                    setSelectedOption(null)
                    setSuiAddress('')
                    setAddressError('')
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-green-500 hover:bg-green-600"
                  disabled={!selectedOption || (selectedOption === 'sui' && (!suiAddress || !!addressError))}
                  onClick={handleClaim}
                >
                  Claim
                </Button>
              </div>

              {/* Powered by 1inch */}
              <div className="w-full flex justify-center">
                <Image
                  src="/images/poweredby1inch.png"
                  alt="Powered by 1inch"
                  width={245}
                  height={36}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}