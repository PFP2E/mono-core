// src/config/wagmi-config.ts
import { http, cookieStorage, createConfig, createStorage } from 'wagmi'
import { mainnet, sepolia, hardhat } from 'wagmi/chains'
import { injected, walletConnect, metaMask, safe } from 'wagmi/connectors'

const projectId = process.env.NEXT_PUBLIC_WC_PID

if (!projectId) {
  console.warn(
    'WalletConnect projectId is not set. Please set NEXT_PUBLIC_WC_PID in your .env file.'
  )
}

export const config = createConfig({
  chains: [mainnet, sepolia, hardhat],
  connectors: [
    injected(),
    ...(typeof indexedDB !== 'undefined'
      ? [walletConnect({ projectId: projectId || '' }), metaMask(), safe()]
      : [])
  ],
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [hardhat.id]: http(),
  }
})
