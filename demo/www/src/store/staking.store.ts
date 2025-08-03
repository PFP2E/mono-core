import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface StakingDetails {
  nftTokenId: string
  walletAddress: string
  stakedDate: string
}

interface ActiveCampaign {
  id: string
  name: string
  campaignName: string
  imageUrl: string
  campaignType: string
}

interface StakingStore {
  // Global staking state
  isStakingEnabled: boolean
  setIsStakingEnabled: (enabled: boolean) => void
  
  // Active campaign data
  activeCampaign: ActiveCampaign | null
  setActiveCampaign: (campaign: ActiveCampaign | null) => void
  
  // Staking details
  stakingDetails: StakingDetails | null
  setStakingDetails: (details: StakingDetails | null) => void
  
  // Helper to initialize staking with a campaign
  initializeStaking: (campaign: ActiveCampaign, details: StakingDetails) => void
  
  // Helper to disable staking
  disableStaking: () => void
}

export const useStakingStore = create<StakingStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isStakingEnabled: false,
      activeCampaign: null,
      stakingDetails: null,
      
      // Actions
      setIsStakingEnabled: (enabled) => {
        set({ isStakingEnabled: enabled })
        
        // If disabling staking, clear active campaign
        if (!enabled) {
          set({ activeCampaign: null, stakingDetails: null })
        }
      },
      
      setActiveCampaign: (campaign) => {
        set({ activeCampaign: campaign })
      },
      
      setStakingDetails: (details) => {
        set({ stakingDetails: details })
      },
      
      initializeStaking: (campaign, details) => {
        set({
          isStakingEnabled: true,
          activeCampaign: campaign,
          stakingDetails: details
        })
      },
      
      disableStaking: () => {
        set({
          isStakingEnabled: false,
          activeCampaign: null,
          stakingDetails: null
        })
      }
    }),
    {
      name: 'staking-store',
      // Only persist these fields
      partialize: (state) => ({
        isStakingEnabled: state.isStakingEnabled,
        activeCampaign: state.activeCampaign,
        stakingDetails: state.stakingDetails
      })
    }
  )
) 