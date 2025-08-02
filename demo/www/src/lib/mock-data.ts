export type Campaign = {
  id: number
  name: string
  campaignName: string
  campaignType: string
  imageUrl: string
  stakers: number
  rewardPool: string
  dailyReward: string
  apy: number
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
    dailyReward: '10k APE',
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
    stakers: 856,
    rewardPool: '950k EGLOBAL',
    dailyReward: '8k EBLOBAL',
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
    dailyReward: '15k 1INCH',
    apy: 18.7,
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
    rewardPool: '800k ETH',
    dailyReward: '5k ETH',
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
    rewardPool: '500k BITCOIN',
    dailyReward: '2.5k BITCOIN',
    apy: 22.1,
    apyColor: 'orange',
    fundable: false,
    claimable: true,
    token: 'SPROTO'
  },
  {
    id: 6,
    name: 'MOG/AAC<br/>Derivative',
    campaignName: 'MOG',
    campaignType: 'Derivative',
    imageUrl: '/images/MOG.jpg',
    stakers: 1456,
    rewardPool: '1.8M MOG',
    dailyReward: '12k MOG',
    apy: 14.3,
    apyColor: 'green',
    fundable: true,
    claimable: true,
    token: 'MOG'
  }
]
