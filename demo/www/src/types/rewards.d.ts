import { StakedPFP, TokenReward, SwapTransaction } from '@/store/rewards.store'

declare module '@/store/rewards.store' {
  interface RewardsState {
    stakedPFPs: StakedPFP[]
    tokenRewards: TokenReward[]
    swapTransactions: SwapTransaction[]
    stakePFP: (stake: Omit<StakedPFP, 'id' | 'stakedAt'>) => void
    removeStake: (id: string) => void
    addReward: (reward: Omit<TokenReward, 'id' | 'earnedAt' | 'claimed'>) => void
    claimReward: (id: string) => void
    simulateEarnings: () => void
    getTotalEarned: (poolName?: string) => number
    getTotalClaimed: (poolName?: string) => number
    getPendingRewards: (poolName?: string) => TokenReward[]
    resetPoolRewards: (poolName: string) => void
    clearAll: () => void
  }
}