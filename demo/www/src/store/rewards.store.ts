import { create } from 'zustand'

interface Reward {
  amount: number
  timestamp: number
}

interface Stake {
  id: string
  poolName: string
  pendingRewards: Reward[]
  claimedRewards: Reward[]
}

interface RewardsStore {
  stakes: Stake[]
  getTotalClaimed: (poolName: string) => number
  getPendingRewards: (poolName: string) => Reward[]
}

// Mock data for demo
const mockStakes: Stake[] = [
  {
    id: '1',
    poolName: 'APE Staking Pool',
    pendingRewards: [
      { amount: 100, timestamp: Date.now() - 86400000 }, // 1 day ago
      { amount: 50, timestamp: Date.now() - 43200000 } // 12 hours ago
    ],
    claimedRewards: [
      { amount: 200, timestamp: Date.now() - 172800000 } // 2 days ago
    ]
  },
  {
    id: '2',
    poolName: 'APE-ETH LP Pool',
    pendingRewards: [
      { amount: 75, timestamp: Date.now() - 86400000 } // 1 day ago
    ],
    claimedRewards: [
      { amount: 150, timestamp: Date.now() - 259200000 } // 3 days ago
    ]
  }
]

export const useRewardsStore = create<RewardsStore>((set, get) => ({
  stakes: mockStakes,
  getTotalClaimed: (poolName: string) => {
    const stake = get().stakes.find(s => s.poolName === poolName)
    if (!stake) return 0
    return stake.claimedRewards.reduce((sum, reward) => sum + reward.amount, 0)
  },
  getPendingRewards: (poolName: string) => {
    const stake = get().stakes.find(s => s.poolName === poolName)
    if (!stake) return []
    return stake.pendingRewards
  }
}))
