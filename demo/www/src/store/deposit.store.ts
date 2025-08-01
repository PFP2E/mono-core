import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface DepositRecord {
  id: string
  campaignName: string
  tokenName: string
  amount: number
  timestamp: number
  type: 'deposit' | 'claim'
}

interface DepositState {
  deposits: DepositRecord[]
  addDeposit: (campaignName: string, tokenName: string, amount: number) => void
  addClaim: (campaignName: string, tokenName: string, amount: number) => void
  clearHistory: () => void
}

export const useDepositStore = create<DepositState>()(
  persist(
    (set, get) => ({
      deposits: [],
      
      addDeposit: (campaignName: string, tokenName: string, amount: number) => {
        const newDeposit: DepositRecord = {
          id: `${Date.now()}-${Math.random()}`,
          campaignName,
          tokenName,
          amount,
          timestamp: Date.now(),
          type: 'deposit'
        }
        
        set((state) => ({
          deposits: [newDeposit, ...state.deposits]
        }))
      },
      
      addClaim: (campaignName: string, tokenName: string, amount: number) => {
        const newClaim: DepositRecord = {
          id: `${Date.now()}-${Math.random()}`,
          campaignName,
          tokenName,
          amount,
          timestamp: Date.now(),
          type: 'claim'
        }
        
        set((state) => ({
          deposits: [newClaim, ...state.deposits]
        }))
      },
      
      clearHistory: () => {
        set({ deposits: [] })
      }
    }),
    {
      name: 'deposit-history',
      // Store in localStorage for persistence
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