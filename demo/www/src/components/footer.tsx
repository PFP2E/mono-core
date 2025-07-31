import React from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export const Footer = () => {
  return (
    <footer className="border-t border-border">
      <div className="container mx-auto flex items-center justify-between py-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} PFP2e Protocol</p>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <a href="https://github.com/pfp2e" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Icons.GitHub className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href="https://x.com/pfp2e" target="_blank" rel="noopener noreferrer" aria-label="X (formerly Twitter)">
              <Icons.Twitter className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </footer>
  );
};