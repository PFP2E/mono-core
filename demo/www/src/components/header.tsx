'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/theme-toggle'
import { Icons } from '@/components/icons'
import { AuthComponent } from '@/components/auth-component'
import { campaigns } from '@/lib/mock-data'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, X } from 'lucide-react'

export const Header = () => {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [showResults, setShowResults] = React.useState(false)
  const [filteredCampaigns, setFilteredCampaigns] = React.useState<any[]>([])

  // Filter campaigns based on search query
  const filterCampaigns = (query: string) => {
    if (!query.trim()) {
      setFilteredCampaigns([])
      return
    }

    const filtered = campaigns.filter(campaign => {
      const searchTerm = query.toLowerCase()
      const campaignName = campaign.campaignName.toLowerCase()
      const tokenName = getTokenName(campaign.campaignName).toLowerCase()
      
      return campaignName.includes(searchTerm) || 
             tokenName.includes(searchTerm) ||
             searchTerm.includes(tokenName.toLowerCase())
    })

    setFilteredCampaigns(filtered)
  }

  // Get token name for campaign
  const getTokenName = (campaignName: string): string => {
    if (campaignName.includes('BAYC')) return 'BAYC'
    if (campaignName.includes('ETHGLOBAL')) return 'ETHG'
    if (campaignName.includes('1 INCH')) return '1INCH'
    if (campaignName.includes('PUNKS')) return 'PUNK'
    if (campaignName.includes('SPROTO')) return 'SPROTO'
    if (campaignName.includes('MOG')) return 'MOG'
    return 'TOKEN'
  }

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    filterCampaigns(query)
    setShowResults(query.length > 0)
  }

  // Handle search focus
  const handleSearchFocus = () => {
    if (searchQuery.length > 0) {
      setShowResults(true)
    }
  }

  // Handle search blur
  const handleSearchBlur = () => {
    // Delay hiding results to allow clicking on them
    setTimeout(() => setShowResults(false), 200)
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery('')
    setFilteredCampaigns([])
    setShowResults(false)
  }

  return (
    <header className='sticky top-0 left-0 z-50 w-full backdrop-blur-md'>
      <nav className='bg-background/50 border-border sm-px-12 flex w-full flex-wrap items-center justify-between border-b px-4 py-2.5 md:px-28'>
        {/* Logo Section */}
        <Link href='/' className='flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity pointer-events-auto relative z-10'>
          <Image src='/logo.png' alt='PFP2E Logo' width={32} height={32} className='pointer-events-auto' />
          <span className='text-primary text-2xl font-bold pointer-events-auto'>PFP2E</span>
        </Link>

        {/* Search Bar Section */}
        <div className='bg-card/80 border-border order-3 my-2 flex h-11 w-full max-w-sm flex-grow items-center gap-4 rounded-full border px-4 py-2.5 sm:order-2 sm:my-0 sm:flex-grow-0 relative'>
          <Search className='text-muted-foreground h-5 w-5' />
          <Input
            type='text'
            placeholder='Search Campaign & Check Wallet Rewards'
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            className='text-foreground placeholder:text-muted-foreground flex-grow border-0 bg-transparent p-0 text-base leading-tight font-normal ring-offset-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className='text-muted-foreground hover:text-foreground'
            >
              <X className='h-4 w-4' />
            </button>
          )}
          <div className='bg-muted text-muted-foreground flex h-5 w-5 items-center justify-center rounded px-1.5 py-[3px] text-xs font-semibold'>
            /
          </div>

          {/* Search Results Dropdown */}
          {showResults && filteredCampaigns.length > 0 && (
            <div className='absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50'>
              {filteredCampaigns.map((campaign) => (
                <Link href={`/campaign/${campaign.campaignName}`} key={campaign.id}>
                  <Card className='border-0 rounded-none hover:bg-muted/50 cursor-pointer'>
                    <CardContent className='p-4'>
                      <div className='flex items-center gap-3'>
                        <Image
                          src={campaign.imageUrl}
                          alt={campaign.campaignName}
                          width={40}
                          height={40}
                          className='rounded-lg'
                        />
                        <div className='flex-1'>
                          <div className='font-medium'>{campaign.campaignName}</div>
                          <div className='text-sm text-muted-foreground'>
                            {campaign.campaignType}
                          </div>
                          <div className='text-sm text-muted-foreground'>
                            Unclaimed Rewards
                          </div>
                          <div className='text-lg font-bold text-primary'>
                            {getTokenName(campaign.campaignName)} 14
                          </div>
                        </div>
                        <Button size='sm' variant='outline'>
                          Claim Rewards
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* No Results */}
          {showResults && searchQuery && filteredCampaigns.length === 0 && (
            <div className='absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg p-4 z-50'>
              <div className='text-center text-muted-foreground'>
                No campaigns found for "{searchQuery}"
              </div>
            </div>
          )}
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
