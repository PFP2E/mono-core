import type { NextConfig } from 'next'
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})

const config: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
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
