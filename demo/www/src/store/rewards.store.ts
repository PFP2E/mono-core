import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Define reward rates per pool (tokens per 30 seconds)
const POOL_REWARD_RATES: Record<string, number> = {
  'BAYC': 5,      // 5 APE tokens per 30 seconds
  'ETHGLOBAL': 8, // 8 ETHG tokens per 30 seconds
  'MOGACC': 10,   // 10 MOG tokens per 30 seconds
  'PUNKS': 3,     // 3 PUNK tokens per 30 seconds
  'SPROTO': 2,    // 2 BITCOIN tokens per 30 seconds
  '1INCH': 15     // 15 1INCH tokens per 30 seconds
}

export interface StakedPFP {
  id: string
  poolName: string
  tokenId: string
  pfpUrl: string
  aHash: string
  colorHist: {
    r: number[]
    g: number[]
    b: number[]
  }
  stakedAt: number
  lastRewardAt: number
  similarity: number
  isSpecial: boolean
}

export interface TokenReward {
  id: string
  poolName: string
  tokenSymbol: string
  amount: number
  earnedAt: number
  claimed: boolean
  claimedAt?: number
}

export interface SwapTransaction {
  id: string
  fromToken: string
  toToken: string
  fromAmount: number
  toAmount: number
  timestamp: number
  status: 'pending' | 'completed' | 'failed'
  isCrossChain: boolean
  destinationAddress?: string
}

interface RewardsState {
  // PFP Staking
  stakedPFPs: StakedPFP[]
  stakePFP: (stake: Omit<StakedPFP, 'id' | 'stakedAt' | 'lastRewardAt'>) => void
  removeStake: (id: string) => void
  
  // Token Rewards
  tokenRewards: TokenReward[]
  addReward: (reward: Omit<TokenReward, 'id' | 'earnedAt' | 'claimed'>) => void
  claimReward: (id: string) => void
  simulateEarnings: () => void
  
  // Swap Transactions
  swapTransactions: SwapTransaction[]
  addSwapTransaction: (swap: Omit<SwapTransaction, 'id' | 'timestamp'>) => void
  updateSwapStatus: (id: string, status: SwapTransaction['status']) => void
  
  // Utilities
  getTotalEarned: (poolName?: string) => number
  getTotalClaimed: (poolName?: string) => number
  getPendingRewards: (poolName?: string) => TokenReward[]
  resetPoolRewards: (poolName: string) => void
  clearAll: () => void
}

export const useRewardsStore = create<RewardsState>()(
  persist(
    (set, get) => ({
      stakedPFPs: [],
      tokenRewards: [],
      swapTransactions: [],

      stakePFP: (stake) => {
        const now = Date.now()
        const newStake: StakedPFP = {
          ...stake,
          id: `${now}-${Math.random()}`,
          stakedAt: now,
          lastRewardAt: now
        }
        
        set(state => ({
          stakedPFPs: [...state.stakedPFPs, newStake]
        }))

        // Add initial reward
        get().addReward({
          poolName: stake.poolName,
          tokenSymbol: getTokenSymbol(stake.poolName),
          amount: POOL_REWARD_RATES[stake.poolName] || 1
        })
      },

      removeStake: (id) => {
        set(state => ({
          stakedPFPs: state.stakedPFPs.filter(stake => stake.id !== id)
        }))
      },

      addReward: (reward) => {
        const newReward: TokenReward = {
          ...reward,
          id: `${Date.now()}-${Math.random()}`,
          earnedAt: Date.now(),
          claimed: false
        }
        
        set(state => ({
          tokenRewards: [...state.tokenRewards, newReward]
        }))
      },

      claimReward: (id) => {
        set(state => ({
          tokenRewards: state.tokenRewards.map(reward => 
            reward.id === id 
              ? { ...reward, claimed: true, claimedAt: Date.now() }
              : reward
          )
        }))
      },

      simulateEarnings: () => {
        const { stakedPFPs } = get()
        const now = Date.now()
        
        // Update each stake's rewards
        const updatedStakes = stakedPFPs.map(stake => {
          const timeSinceLastReward = now - stake.lastRewardAt
          const epochs = Math.floor(timeSinceLastReward / 30000) // 30 seconds

          if (epochs > 0) {
            // Add rewards for each epoch
            const rewardRate = POOL_REWARD_RATES[stake.poolName] || 1
            get().addReward({
              poolName: stake.poolName,
              tokenSymbol: getTokenSymbol(stake.poolName),
              amount: rewardRate * epochs
            })

            // Update last reward time
            return {
              ...stake,
              lastRewardAt: now
            }
          }

          return stake
        })

        // Update stakes with new lastRewardAt times
        set({ stakedPFPs: updatedStakes })
      },

      addSwapTransaction: (swap) => {
        const newSwap: SwapTransaction = {
          ...swap,
          id: `${Date.now()}-${Math.random()}`,
          timestamp: Date.now()
        }
        
        set(state => ({
          swapTransactions: [...state.swapTransactions, newSwap]
        }))
      },

      updateSwapStatus: (id, status) => {
        set(state => ({
          swapTransactions: state.swapTransactions.map(swap => 
            swap.id === id ? { ...swap, status } : swap
          )
        }))
      },

      getTotalEarned: (poolName) => {
        const { tokenRewards } = get()
        return tokenRewards
          .filter(reward => !poolName || reward.poolName === poolName)
          .reduce((total, reward) => total + reward.amount, 0)
      },

      getTotalClaimed: (poolName) => {
        const { tokenRewards } = get()
        return tokenRewards
          .filter(reward => reward.claimed && (!poolName || reward.poolName === poolName))
          .reduce((total, reward) => total + reward.amount, 0)
      },

      getPendingRewards: (poolName) => {
        const { tokenRewards } = get()
        return tokenRewards.filter(reward => 
          !reward.claimed && (!poolName || reward.poolName === poolName)
        )
      },

      resetPoolRewards: (poolName) => {
        const now = Date.now()
        set(state => ({
          tokenRewards: state.tokenRewards.filter(reward => reward.poolName !== poolName),
          stakedPFPs: state.stakedPFPs.map(stake => 
            stake.poolName === poolName 
              ? { ...stake, lastRewardAt: now }
              : stake
          )
        }))
      },

      clearAll: () => {
        set({
          stakedPFPs: [],
          tokenRewards: [],
          swapTransactions: []
        })
      }
    }),
    {
      name: 'rewards-store',
      storage: {
        getItem: name => {
          if (typeof window === 'undefined') return null
          const value = localStorage.getItem(name)
          return value ? JSON.parse(value) : null
        },
        setItem: (name, value) => {
          if (typeof window === 'undefined') return
          localStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: name => {
          if (typeof window === 'undefined') return
          localStorage.removeItem(name)
        }
      }
    }
  )
)

// Helper function to get token symbol based on pool name
function getTokenSymbol(poolName: string): string {
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