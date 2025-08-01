import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ActivityType = 'deposit' | 'claim' | 'pfp_update'

export interface ActivityRecord {
  id: string
  type: ActivityType
  campaignName: string
  tokenName: string
  amount?: number
  timestamp: number
  username?: string
}

interface ActivityState {
  activities: ActivityRecord[]
  addDeposit: (campaignName: string, tokenName: string, amount: number) => void
  addClaim: (campaignName: string, tokenName: string, amount: number) => void
  addPfpUpdate: (campaignName: string, tokenName: string, username: string) => void
  clearHistory: () => void
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set, get) => ({
      activities: [],
      
      addDeposit: (campaignName: string, tokenName: string, amount: number) => {
        const newActivity: ActivityRecord = {
          id: `${Date.now()}-${Math.random()}`,
          type: 'deposit',
          campaignName,
          tokenName,
          amount,
          timestamp: Date.now()
        }
        
        set((state) => ({
          activities: [newActivity, ...state.activities]
        }))
      },
      
      addClaim: (campaignName: string, tokenName: string, amount: number) => {
        const newActivity: ActivityRecord = {
          id: `${Date.now()}-${Math.random()}`,
          type: 'claim',
          campaignName,
          tokenName,
          amount,
          timestamp: Date.now()
        }
        
        set((state) => ({
          activities: [newActivity, ...state.activities]
        }))
      },

      addPfpUpdate: (campaignName: string, tokenName: string, username: string) => {
        const newActivity: ActivityRecord = {
          id: `${Date.now()}-${Math.random()}`,
          type: 'pfp_update',
          campaignName,
          tokenName,
          username,
          timestamp: Date.now()
        }
        
        set((state) => ({
          activities: [newActivity, ...state.activities]
        }))
      },
      
      clearHistory: () => {
        set({ activities: [] })
      }
    }),
    {
      name: 'deposit-history', // Using same name as old store for consistency
      storage: {
        getItem: (name) => {
          if (typeof window === 'undefined') return null
          const value = localStorage.getItem(name)
          return value ? JSON.parse(value) : null
        },
        setItem: (name, value) => {
          if (typeof window === 'undefined') return
          localStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => {
          if (typeof window === 'undefined') return
          localStorage.removeItem(name)
        }
      }
    }
  )
)