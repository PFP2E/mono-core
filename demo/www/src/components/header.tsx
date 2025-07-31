'use client'

import React from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/theme-toggle'
import { Icons } from '@/components/icons'
import { AuthComponent } from '@/components/auth-component'

export const Header = () => {
  return (
    <header className='sticky top-0 left-0 z-10 w-full backdrop-blur-md'>
      <nav className='bg-background/50 border-border sm-px-12 flex w-full flex-wrap items-center justify-between border-b px-4 py-2.5 md:px-28'>
        {/* Logo Section */}
        <div className='flex items-center gap-2'>
          <Image src='/logo.png' alt='PFP2E Logo' width={32} height={32} />
          <span className='text-primary text-2xl font-bold'>PFP2e</span>
        </div>

        {/* Search Bar Section */}
        <div className='bg-card/80 border-border order-3 my-2 flex h-11 w-full max-w-sm flex-grow items-center gap-4 rounded-full border px-4 py-2.5 sm:order-2 sm:my-0 sm:flex-grow-0'>
          <Icons.Search className='text-muted-foreground h-5 w-5' />
          <Input
            type='text'
            placeholder='Check address rewards'
            className='text-foreground placeholder:text-muted-foreground flex-grow border-0 bg-transparent p-0 text-base leading-tight font-normal ring-offset-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
          />
          <div className='bg-muted text-muted-foreground flex h-5 w-5 items-center justify-center rounded px-1.5 py-[3px] text-xs font-semibold'>
            /
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className='order-2 flex items-center gap-2.5 sm:order-3'>
          <AuthComponent />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
