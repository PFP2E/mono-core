import type { NextConfig } from 'next'

const remoteImgs = ['https://pbs.twimg.com/profile_images/**'].map(
  url => new URL(url)
)
const config: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx'],
  images: { remotePatterns: remoteImgs }
}
export default config
