// src/components/x-signin-modal.tsx
'use client'

import { useRouter } from 'next/navigation'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function XSignInModal() {
  const router = useRouter()

  const handleConfirm = () => {
    router.push('/api/auth/x/redirect')
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Sign in with X</DialogTitle>
        <DialogDescription>
          You will be redirected to x.com to authenticate your account. Do you
          want to continue?
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button type='button' variant='secondary'>
            Cancel
          </Button>
        </DialogClose>
        <Button type='button' onClick={handleConfirm}>
          Confirm
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
