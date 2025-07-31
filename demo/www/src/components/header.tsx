'use client'

import React from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Icons } from '@/components/icons';
import { useAppContext } from '@/context/app-context';

export const Header = () => {
  const { isConnected, connect, disconnect } = useAppContext();

  return (
    <header className="sticky top-0 left-0 z-10 w-full backdrop-blur-md">
      <nav className="w-full px-4 sm:px-12 md:px-28 py-2.5 bg-background/50 border-b border-border flex flex-wrap justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="PFP2E Logo" width={32} height={32} />
          <span className="text-primary text-2xl font-bold">PFP2e</span>
        </div>

        {/* Search Bar Section */}
        <div className="h-11 px-4 py-2.5 bg-card/80 rounded-full border border-border flex items-center gap-4 w-full max-w-sm my-2 sm:my-0 order-3 sm:order-2 flex-grow sm:flex-grow-0">
          <Icons.Search className="w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Check address rewards"
            className="bg-transparent p-0 text-foreground placeholder:text-muted-foreground text-base font-normal leading-tight focus:outline-none flex-grow border-0 ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <div className="w-5 h-5 px-1.5 py-[3px] bg-muted rounded text-muted-foreground text-xs font-semibold flex items-center justify-center">/</div>
        </div>

        {/* Action Buttons Section */}
        <div className="flex items-center gap-2.5 order-2 sm:order-3">
          {isConnected ? (
            <Button variant="outline" onClick={disconnect}>Disconnect</Button>
          ) : (
            <>
              <Button variant="outline" onClick={connect}>
                Connect Wallet
              </Button>
              <Button variant="outline" onClick={connect}>
                Sign in with <Icons.X className="ml-2 h-3.5 w-3.5" />
              </Button>
            </>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};
