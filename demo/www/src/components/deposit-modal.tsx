'use client'

import * as React from 'react'
import { Campaign } from '@/lib/mock-data'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { useActivityStore } from '@/store/activity.store'

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
  campaign: Campaign | null
}

// Token mapping for each campaign
const getTokenName = (campaignName: string): string => {
  if (campaignName.includes('BAYC')) return 'BAYC'
  if (campaignName.includes('ETHGLOBAL')) return 'ETHG'
  if (campaignName.includes('1 INCH')) return '1INCH'
  if (campaignName.includes('PUNKS')) return 'PUNK'
  if (campaignName.includes('SPROTO')) return 'SPROTO'
  if (campaignName.includes('MOG')) return 'MOG'
  return 'TOKEN'
}

export const DepositModal = ({
  isOpen,
  onClose,
  campaign
}: DepositModalProps) => {
  const [depositAmount, setDepositAmount] = React.useState('')
  const [balance] = React.useState(0) // Mock balance
  const [showSuccess, setShowSuccess] = React.useState(false)

  const tokenName = campaign ? getTokenName(campaign.name) : 'TOKEN'
  const campaignName = campaign?.name.replace('<br/>', ' ') || 'Campaign'

  const handleDeposit = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) return

    const amount = parseFloat(depositAmount)

    // Store the deposit in Zustand store using getState() for persistence
    useActivityStore.getState().addDeposit(campaignName, tokenName, amount)

    // Show success message
    setShowSuccess(true)

    // Log the deposit
    console.log(`${amount} ${tokenName} deposited`)

    // Auto close after 1 second
    setTimeout(() => {
      setDepositAmount('')
      setShowSuccess(false)
      onClose()
    }, 1000)
  }

  const handleAmountChange = (value: string) => {
    // Only allow numeric input
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setDepositAmount(value)
    }
  }

  const incrementAmount = () => {
    const current = parseFloat(depositAmount) || 0
    setDepositAmount((current + 1).toString())
  }

  const decrementAmount = () => {
    const current = parseFloat(depositAmount) || 0
    if (current > 0) {
      setDepositAmount((current - 1).toString())
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Deposit to {campaignName}</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='text-muted-foreground text-sm'>
            Your Balance: {balance} {tokenName}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='deposit-amount'>Amount of {tokenName} tokens</Label>
            <div className='relative'>
              <Input
                id='deposit-amount'
                type='text'
                value={depositAmount}
                onChange={e => handleAmountChange(e.target.value)}
                placeholder={`Amount of ${tokenName} tokens`}
                className='pr-12'
              />
              <div className='absolute top-1/2 right-2 flex -translate-y-1/2 flex-col'>
                <button
                  type='button'
                  onClick={incrementAmount}
                  className='hover:text-primary flex h-3 w-3 items-center justify-center'
                >
                  <ChevronUp className='h-3 w-3' />
                </button>
                <button
                  type='button'
                  onClick={decrementAmount}
                  className='hover:text-primary flex h-3 w-3 items-center justify-center'
                >
                  <ChevronDown className='h-3 w-3' />
                </button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleDeposit}
            className='w-full'
            disabled={!depositAmount || parseFloat(depositAmount) <= 0}
          >
            {showSuccess
              ? `${depositAmount} ${tokenName} deposited`
              : `Deposit ${tokenName}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
