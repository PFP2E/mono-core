// src/components/wallet/wallet-option.tsx
'use client'

import Image from 'next/image'
import type { Connector } from 'wagmi'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { WalletConfig } from '@/config/wallet'

type WalletOptionProps = {
  connector: Connector
  config: WalletConfig
  isLoading: boolean
  onClick: () => void
}

export function WalletOption({
  connector,
  config,
  isLoading,
  onClick
}: WalletOptionProps) {
  return (
    <Button
      variant='outline'
      onClick={onClick}
      disabled={isLoading}
      className='flex h-16 w-full items-center justify-start gap-4 px-4'
    >
      <Image src={config.iconSrc} alt={connector.name} width={32} height={32} />
      <div className='flex flex-col items-start'>
        <span className='font-medium'>{connector.name}</span>
        <span className='text-muted-foreground text-xs'>
          {config.description}
        </span>
      </div>
      {isLoading && <Loader2 className='ml-auto h-5 w-5 animate-spin' />}
    </Button>
  )
}
