// src/components/auth-component.tsx
'use client'

import { useEffect } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useWallet } from '@/hooks/use-wallet'
import { useSIWE } from '@/hooks/useSIWE'
import { useXSession } from '@/hooks/useXSession'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { WalletConnectionDialog } from './wallet/wallet-connection-dialog'
import { XSignInModal } from './x-signin-modal'
import { Icons } from './icons'

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

  // Automatically trigger SIWE after wallet connection
  useEffect(() => {
    if (account.status === 'connected' && !isAuthenticated && !isSiweLoading) {
      signIn()
    }
  }, [account.status, isAuthenticated, isSiweLoading, signIn])

  if (!isClient) {
    return (
      <Button disabled variant='outline' size='sm'>
        Loading...
      </Button>
    )
  }

  const isLoading = isSiweLoading || isXLoading
  const isWalletConnected = account.status === 'connected'
  const isSIWEAuthenticated = isWalletConnected && isAuthenticated

  // Render the user menu if authenticated with X or wallet is connected
  if (isXAuthenticated || isWalletConnected) {
    return (
      <div className='flex items-center gap-2'>
        {/* Show X sign-in button if not authenticated with X, but wallet is connected */}
        {!isXAuthenticated && isWalletConnected && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant='outline'>
                Sign in with <Icons.X className='ml-2 h-3.5 w-3.5' />
              </Button>
            </DialogTrigger>
            <XSignInModal />
          </Dialog>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='outline'
              size='sm'
              className='flex items-center gap-2'
            >
              {isWalletConnected && (
                <span>
                  {isSIWEAuthenticated
                    ? formattedAddress
                    : isLoading
                      ? 'Signing...'
                      : 'Sign In'}
                </span>
              )}
              {isXAuthenticated && !isWalletConnected && xSession && (
                <span>{xSession.username}</span>
              )}
              <Icons.ChevronDown className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {!isWalletConnected && (
              <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={e => e.preventDefault()}>
                    Connect Wallet
                  </DropdownMenuItem>
                </DialogTrigger>
                <WalletConnectionDialog />
              </Dialog>
            )}
            {isSIWEAuthenticated && (
              <DropdownMenuItem onClick={signOutSIWE}>
                Sign Out from Wallet
              </DropdownMenuItem>
            )}
            {isXAuthenticated && (
              <DropdownMenuItem onClick={signOutX}>
                Sign Out from X
              </DropdownMenuItem>
            )}
            {isWalletConnected && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => disconnect()}>
                  Disconnect Wallet
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  // Default state: Unauthenticated
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
