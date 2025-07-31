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
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'PFP2E Demo',
  description: 'A demo application for the PFP2E Protocol.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
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
            <div className="relative flex min-h-screen flex-col">
              <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-primary/20 to-background -z-10" />
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
