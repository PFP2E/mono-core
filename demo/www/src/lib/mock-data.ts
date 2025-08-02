export type Campaign = {
  id: number
  name: string
  campaignName: string
  campaignType: string
  imageUrl: string
  stakers: number
  rewardPool: string
  dailyReward: string
  apy: number | 'N/A'
  apyColor: 'green' | 'orange'
  fundable: boolean
  claimable: boolean
  token: string
}

export const campaigns: Campaign[] = [
  {
    id: 1,
    name: 'BAYC<br/>PFP Staking',
    campaignName: 'BAYC',
    campaignType: 'PFP Staking',
    imageUrl: '/images/BAYC.jpg',
    stakers: 1234,
    rewardPool: '1.2M APE',
    dailyReward: '9.72 APE',
    apy: 12.5,
    apyColor: 'green',
    fundable: true,
    claimable: true,
    token: 'BAYC'
  },
  {
    id: 2,
    name: 'ETHGLOBAL<br/>PFP Staking',
    campaignName: 'ETHGLOBAL',
    campaignType: 'PFP Staking',
    imageUrl: '/images/ETHGLOBAL.jpg',
    stakers: 16,
    rewardPool: '950k EGLOBAL',
    dailyReward: '593 EBLOBAL',
    apy: 15.2,
    apyColor: 'green',
    fundable: true,
    claimable: false,
    token: 'ETHG'
  },
  {
    id: 3,
    name: '1 INCH<br/>Derivative',
    campaignName: '1 INCH',
    campaignType: 'Derivative',
    imageUrl: '/images/1INCH.jpg',
    stakers: 2341,
    rewardPool: '2.1M 1INCH',
    dailyReward: '8.7 1INCH',
    apy: 'N/A',
    apyColor: 'green',
    fundable: true,
    claimable: true,
    token: '1INCH'
  },
  {
    id: 4,
    name: 'PUNKS<br/>PFP Staking',
    campaignName: 'PUNKS',
    campaignType: 'PFP Staking',
    imageUrl: '/images/CRYPTOPUNKS.jpg',
    stakers: 567,
    rewardPool: '1800 ETH',
    dailyReward: '0.317 ETH',
    apy: 8.2,
    apyColor: 'green',
    fundable: true,
    claimable: false,
    token: 'PUNK'
  },
  {
    id: 5,
    name: 'SPROTO<br/>PFP Staking',
    campaignName: 'SPROTO',
    campaignType: 'PFP Staking',
    imageUrl: '/images/SPROTO.jpg',
    stakers: 890,
    rewardPool: '800k BITCOIN',
    dailyReward: '8.98 BITCOIN',
    apy: 22.1,
    apyColor: 'orange',
    fundable: false,
    claimable: true,
    token: 'SPROTO'
  },
  {
    id: 6,
    name: 'MOGACC<br/>Derivative',
    campaignName: 'MOGACC',
    campaignType: 'Derivative',
    imageUrl: '/images/MOG.jpg',
    stakers: 2456,
    rewardPool: '118M MOG',
    dailyReward: '480 MOG',
    apy: 'N/A',
    apyColor: 'green',
    fundable: true,
    claimable: true,
    token: 'MOG'
  }
]
