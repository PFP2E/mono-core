// src/components/wallet/wallet-connection-dialog.tsx
'use client'

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { WalletOption } from './wallet-option'
import { useWallet } from '@/hooks/use-wallet'

export function WalletConnectionDialog() {
  const { connectors, connect, status, getWalletConfig } = useWallet()

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Connect Wallet</DialogTitle>
        <DialogDescription>
          Choose your wallet from the list below to get started.
        </DialogDescription>
      </DialogHeader>
      <div className='grid grid-cols-1 gap-4'>
        {connectors.map(connector => (
          <WalletOption
            key={connector.uid}
            connector={connector}
            config={getWalletConfig(connector.id)}
            isLoading={status === 'pending'}
            onClick={() => connect(connector)}
          />
        ))}
      </div>
    </DialogContent>
  )
}
