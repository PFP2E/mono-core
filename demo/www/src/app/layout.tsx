import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { AppProvider } from '@/context/app-context'
import { cn } from '@/lib/utils/cn'

import './globals.css'

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans'
})

export const metadata: Metadata = {
  title: 'PFP2E Demo',
  description: 'A demo application for the PFP2E Protocol.'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          'bg-background min-h-screen font-sans antialiased',
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider>
            <div className='relative flex min-h-screen flex-col'>
              <div className='from-primary/20 to-background absolute top-0 left-0 -z-10 h-[400px] w-full bg-gradient-to-b' />
              <Header />
              <main className='flex-1'>{children}</main>
              <Footer />
            </div>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
