import { http, cookieStorage, createConfig, createStorage } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { injected, walletConnect, metaMask, safe } from 'wagmi/connectors'

// 1. Get projectId from https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WC_PID

if (!projectId) {
  console.warn(
    'WalletConnect projectId is not set. Please set NEXT_PUBLIC_WC_PID in your .env file.'
  )
}

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected(),
    walletConnect({ projectId: projectId || '' }),
    metaMask(),
    safe()
  ],
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http()
  }
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
