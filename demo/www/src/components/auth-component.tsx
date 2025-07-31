// src/components/auth-component.tsx
'use client'

import { Button } from '@/components/ui/button'
import { useWallet } from '@/hooks/use-wallet'
import { useSIWE } from '@/hooks/useSIWE'
import { useXSession } from '@/hooks/useXSession'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { WalletConnectionDialog } from './wallet/wallet-connection-dialog'
import { XSignInModal } from './x-signin-modal'
import { Icons } from './icons'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export function AuthComponent() {
  const {
    account,
    disconnect,
    isClient,
    isModalOpen,
    setModalOpen,
    formattedAddress
  } = useWallet()
  const {
    isAuthenticated,
    signIn,
    signOut: signOutSIWE,
    isLoading: isSiweLoading
  } = useSIWE()
  const {
    isXAuthenticated,
    signOutX,
    session: xSession,
    isLoading: isXLoading
  } = useXSession()

  if (!isClient) {
    return (
      <Button disabled variant='outline' size='sm'>
        Loading...
      </Button>
    )
  }

  const isLoading = isSiweLoading || isXLoading

  // Wallet is connected, and user is fully authenticated with SIWE
  if (account.status === 'connected' && isAuthenticated) {
    return (
      <div className='flex items-center gap-2'>
        {isXAuthenticated && xSession && (
          <Avatar>
            <AvatarImage src={xSession.pfpUrl} alt={xSession.username} />
            <AvatarFallback>{xSession.username.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
        <Button variant='outline' size='sm'>
          {formattedAddress}
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={signOutSIWE}
          disabled={isLoading}
        >
          Sign Out
        </Button>
      </div>
    )
  }

  // Wallet is connected, but not signed in with SIWE
  if (account.status === 'connected') {
    return (
      <div className='flex items-center gap-2'>
        <Button variant='outline' size='sm'>
          {formattedAddress}
        </Button>
        <Button onClick={signIn} disabled={isLoading} size='sm'>
          {isLoading ? 'Signing...' : 'Sign-In with Ethereum'}
        </Button>
        <Button variant='ghost' size='icon' onClick={() => disconnect()}>
          <Icons.Wallet className='h-4 w-4' />
        </Button>
      </div>
    )
  }

  // Only authenticated with X
  if (isXAuthenticated && xSession) {
    return (
      <div className='flex items-center gap-2'>
        <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button>Connect Wallet</Button>
          </DialogTrigger>
          <WalletConnectionDialog />
        </Dialog>
        <Button
          variant='outline'
          size='sm'
          onClick={signOutX}
          disabled={isLoading}
        >
          Sign Out from X
        </Button>
      </div>
    )
  }

  // Unauthenticated
  return (
    <div className='flex items-center gap-2'>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='outline'>
            Sign in with <Icons.X className='ml-2 h-3.5 w-3.5' />
          </Button>
        </DialogTrigger>
        <XSignInModal />
      </Dialog>
      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogTrigger asChild>
          <Button>Connect Wallet</Button>
        </DialogTrigger>
        <WalletConnectionDialog />
      </Dialog>
    </div>
  )
}
