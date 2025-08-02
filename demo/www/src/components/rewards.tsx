'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRewardsStore } from '@/store/rewards.store'
import { useXSession } from '@/hooks/useXSession'
import { useSIWE } from '@/hooks/useSIWE'
import { processPFPAndFindMatches } from '@/lib/utils/pfp-hash'
import { isValidSuiAddress } from '@/lib/utils'
import { 
  Wallet, 
  Coins, 
  ArrowRight, 
  CheckCircle,
  Trash2, 
  RefreshCw,
  Zap,
  AlertCircle
} from 'lucide-react'
import Image from 'next/image'

// Utility function for formatting amounts
const formatAmount = (amount: number) => {
  return amount.toFixed(2)
}

// Helper function to get token symbol
const getTokenSymbol = (poolName: string): string => {
  switch (poolName) {
    case 'BAYC': return 'APE'
    case 'ETHGLOBAL': return 'ETHG'
    case 'MOGACC': return 'MOG'
    case 'PUNKS': return 'PUNK'
    case 'SPROTO': return 'BITCOIN'
    case '1INCH': return '1INCH'
    default: return 'TOKEN'
  }
}

export function Rewards() {
  const { session: xSession, isXAuthenticated } = useXSession()
  const { isAuthenticated } = useSIWE()
  const {
    stakedPFPs,
    stakePFP,
    removeStake,
    addReward,
    claimReward,
    simulateEarnings,
    getTotalEarned,
    getTotalClaimed,
    getPendingRewards,
    resetPoolRewards
  } = useRewardsStore()

  const [isProcessing, setIsProcessing] = useState(false)
  const [showSwapModal, setShowSwapModal] = useState(false)
  const [selectedStake, setSelectedStake] = useState<any>(null)

  // Simulate earnings every 30 seconds for demo
  useEffect(() => {
    if (stakedPFPs.length > 0) {
      const interval = setInterval(() => {
        simulateEarnings()
      }, 30000) // 30 seconds

      return () => clearInterval(interval)
    }
  }, [stakedPFPs.length, simulateEarnings])

  // Auto-stake PFP when user connects Twitter
  useEffect(() => {
    if (isXAuthenticated && xSession?.pfpUrl && stakedPFPs.length === 0) {
      handleAutoStake()
    }
  }, [isXAuthenticated, xSession?.pfpUrl])

  const handleAutoStake = async () => {
    if (!xSession?.pfpUrl) return

    setIsProcessing(true)
    try {
      const { matches } = await processPFPAndFindMatches(
        xSession.pfpUrl,
        {} // Mock dataset
      )

      // Stake in all matching pools with >85% similarity
      for (const match of matches) {
        if (match.similarity > 0.85) {
          stakePFP({
            poolName: match.poolName,
            tokenId: match.tokenId,
            pfpUrl: xSession.pfpUrl,
            aHash: 'mock-hash',
            colorHist: { r: [], g: [], b: [] },
            similarity: match.similarity,
            isSpecial: match.isSpecial
          })
        }
      }
    } catch (error) {
      console.error('Failed to stake PFP:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClaimReward = (stake: any) => {
    const pendingRewards = getPendingRewards(stake.poolName)
    pendingRewards.forEach(reward => {
      claimReward(reward.id)
    })
  }

  const handleSwapTokens = (stake: any) => {
    setSelectedStake(stake)
    setShowSwapModal(true)
  }

  if (!isXAuthenticated && !isAuthenticated) {
    return (
      <div className="py-16 text-center">
        <Card className="mx-auto max-w-md">
          <CardContent className="p-6">
            <Wallet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Connect to View Rewards</h3>
            <p className="text-muted-foreground text-sm">
              Connect your Twitter account to start earning rewards for your PFP.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="py-16 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">PFP Rewards</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Earn tokens by staking your PFP. Your profile picture is automatically verified 
          and staked when you connect your Twitter account.
        </p>
      </div>

      {/* Active Staking Campaigns */}
      {stakedPFPs.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Active Staking Campaigns</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stakedPFPs.map((stake) => {
              const pendingAmount = getPendingRewards(stake.poolName)
                .reduce((sum, reward) => sum + reward.amount, 0)
              const claimedAmount = getTotalClaimed(stake.poolName)
              const hasUnclaimedRewards = pendingAmount > 0
              const hasClaimedTokens = claimedAmount > 0

              return (
                <Card key={stake.id} className="relative overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={stake.pfpUrl}
                        alt="Staked PFP"
                        width={48}
                        height={48}
                        className="rounded-lg"
                      />
                      <div className="flex-1">
                        <CardTitle className="text-lg">{stake.poolName}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Token #{stake.tokenId}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => resetPoolRewards(stake.poolName)}
                          className="h-6 text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground"
                        >
                          <Trash2 className="h-3 w-3" />
                          Reset
                        </Button>
                        <Badge variant="secondary">
                          {(stake.similarity * 100).toFixed(1)}% match
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Stats */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Staked Date</span>
                          <span>{new Date(stake.stakedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total Earned</span>
                          <span className="font-medium">
                            {formatAmount(getTotalEarned(stake.poolName))} {getTokenSymbol(stake.poolName)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Unclaimed</span>
                          <span className={`font-medium ${hasUnclaimedRewards ? 'text-green-500' : ''}`}>
                            {formatAmount(pendingAmount)} {getTokenSymbol(stake.poolName)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Claimed / Ready to Swap</span>
                          <span className="font-medium">
                            {formatAmount(claimedAmount)} {getTokenSymbol(stake.poolName)}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button 
                          className="flex-1"
                          onClick={() => handleClaimReward(stake)}
                          disabled={!hasUnclaimedRewards}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Claim
                        </Button>
                        <Button 
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleSwapTokens(stake)}
                          disabled={!hasClaimedTokens}
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Swap
                        </Button>
                      </div>

                      {stake.isSpecial && (
                        <Badge variant="destructive" className="w-full justify-center">
                          Manual Verification Required
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Processing State */}
      {isProcessing && (
        <Card className="mx-auto max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">
              Processing your PFP and finding matches...
            </p>
          </CardContent>
        </Card>
      )}

      {/* Swap Modal */}
      {showSwapModal && selectedStake && (
        <SwapModal
          stake={selectedStake}
          onClose={() => {
            setShowSwapModal(false)
            setSelectedStake(null)
          }}
        />
      )}
    </div>
  )
}

// Swap Modal Component
const SwapModal = ({ stake, onClose }: { stake: any; onClose: () => void }) => {
  const [swapType, setSwapType] = useState<'normal' | 'cross-chain'>('normal')
  const [destinationAddress, setDestinationAddress] = useState('')
  const [addressError, setAddressError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const { getTotalClaimed } = useRewardsStore()

  const claimedAmount = getTotalClaimed(stake.poolName)
  const tokenSymbol = getTokenSymbol(stake.poolName)

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value
    setDestinationAddress(address)
    
    if (address && !isValidSuiAddress(address)) {
      setAddressError('Please enter a valid 32-byte Sui address (e.g., 0x906b5fc264539be8b1a5faa84441cf65e13e99ee555c0025d282770797cf99d1)')
    } else {
      setAddressError('')
    }
  }

  const handleSwap = async () => {
    if (swapType === 'cross-chain' && !isValidSuiAddress(destinationAddress)) {
      setAddressError('Please enter a valid Sui address')
      return
    }

    setIsProcessing(true)
    // Simulate swap processing
    setTimeout(() => {
      setIsProcessing(false)
      onClose()
    }, 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Swap {tokenSymbol}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Swap Type</label>
            <div className="flex gap-2">
              <Button
                variant={swapType === 'normal' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setSwapType('normal')
                  setDestinationAddress('')
                  setAddressError('')
                }}
              >
                Normal Swap
              </Button>
              <Button
                variant={swapType === 'cross-chain' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSwapType('cross-chain')}
              >
                Cross-Chain (Sui)
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Available to Swap</label>
            <div className="text-lg font-semibold">
              {formatAmount(claimedAmount)} {tokenSymbol}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">To Token</label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">USDT</Button>
              <Button variant="outline" size="sm">ETH</Button>
              {swapType === 'cross-chain' && (
                <Button variant="outline" size="sm">SUI</Button>
              )}
            </div>
          </div>

          {swapType === 'cross-chain' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Sui Address</label>
              <input
                type="text"
                placeholder="0x906b5fc264539be8b1a5faa84441cf65e13e99ee555c0025d282770797cf99d1"
                value={destinationAddress}
                onChange={handleAddressChange}
                className={`w-full p-2 border rounded ${addressError ? 'border-red-500' : ''}`}
              />
              {addressError && (
                <div className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="h-3 w-3" />
                  {addressError}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Enter a valid 32-byte Sui address starting with 0x
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSwap}
              disabled={
                isProcessing || 
                (swapType === 'cross-chain' && (!destinationAddress || !isValidSuiAddress(destinationAddress)))
              }
              className="flex-1"
            >
              {isProcessing ? 'Processing...' : 'Swap'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}