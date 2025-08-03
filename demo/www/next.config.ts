import type { NextConfig } from 'next'
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@pfp2e/sdk'],
  pageExtensions: ['ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
        pathname: '/profile_images/**'
      },
      {
        protocol: 'https',
        hostname: 'placehold.co'
      }
    ]
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
}

export default withBundleAnalyzer(config)
