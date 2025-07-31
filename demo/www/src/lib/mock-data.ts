export type Campaign = {
  id: number
  name: string
  imageUrl: string
  participants: number
  rewardPool: string
  dailyReward: string
  apy: number
  apyColor: 'green' | 'orange'
  fundable: boolean
  claimable: boolean
}

export const campaigns: Campaign[] = [
  {
    id: 1,
    name: 'Bored Ape Yacht Club<br/>Social Staking',
    imageUrl: 'https://placehold.co/64x64/1E1B18/FFFFFF?text=NFT',
    participants: 1234,
    rewardPool: '1.2M RWT',
    dailyReward: '10k RWT',
    apy: 12.5,
    apyColor: 'green',
    fundable: true,
    claimable: true
  },
  {
    id: 2,
    name: 'CryptoPunks<br/>Loyalty Program',
    imageUrl: 'https://placehold.co/64x64/1E1B18/FFFFFF?text=NFT',
    participants: 567,
    rewardPool: '800k RWT',
    dailyReward: '5k RWT',
    apy: 8.2,
    apyColor: 'green',
    fundable: true,
    claimable: false
  },
  {
    id: 3,
    name: 'Pudgy Penguins<br/>Community Rewards',
    imageUrl: 'https://placehold.co/64x64/1E1B18/FFFFFF?text=NFT',
    participants: 890,
    rewardPool: '500k RWT',
    dailyReward: '2.5k RWT',
    apy: 22.1,
    apyColor: 'orange',
    fundable: false,
    claimable: true
  }
]
