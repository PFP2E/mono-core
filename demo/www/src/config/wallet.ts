// src/config/wallet.ts
export const wallets = [
  {
    id: 'metamask',
    name: 'MetaMask',
    iconSrc: '/icons/metamask.svg',
    description: 'Connect to your MetaMask wallet'
  },
  {
    id: 'walletConnect',
    name: 'WalletConnect',
    iconSrc: '/icons/walletconnect.svg',
    description: 'Scan with WalletConnect to connect'
  },
  {
    id: 'safe',
    name: 'Safe',
    iconSrc: '/icons/safe.svg',
    description: 'Connect to your Safe wallet'
  },
  {
    id: 'injected',
    name: 'Injected',
    iconSrc: '/icons/injected.svg',
    description: 'Connect with your browser wallet'
  }
]

export type WalletConfig = (typeof wallets)[number]
