'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { SunIcon, MoonIcon } from 'lucide-react'

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)

  // Mount check to prevent hydration issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    // Render a placeholder or null to avoid layout shift
    return <div className='h-9 w-9 p-2' />
  }

  const handleToggle = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button
      onClick={handleToggle}
      variant='ghost'
      size='icon'
      className='p-2'
      aria-label='Toggle Theme'
    >
      {resolvedTheme === 'dark' ? (
        <SunIcon className='h-5 w-5' aria-hidden='true' />
      ) : (
        <MoonIcon className='h-5 w-5' aria-hidden='true' />
      )}
    </Button>
  )
}

export default ThemeToggle
