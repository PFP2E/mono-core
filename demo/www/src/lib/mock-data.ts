export type Campaign = {
  id: number
  name: string
  slug: string
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

// Helper function to calculate daily reward (1% of pool / stakers)
const calculateDailyReward = (rewardPool: string, stakers: number, token: string): string => {
  // Extract numeric value from reward pool string (e.g., "1.2M" -> 1200000)
  const poolValue = rewardPool.replace(/[^\d.]/g, '')
  const multiplier = rewardPool.includes('M') ? 1000000 : rewardPool.includes('k') ? 1000 : 1
  const poolAmount = parseFloat(poolValue) * multiplier
  
  // Calculate 1% of pool amount divided by stakers
  const dailyAmount = (poolAmount * 0.01) / stakers
  
  // Format the result
  if (dailyAmount >= 1000000) {
    return `${(dailyAmount / 1000000).toFixed(1)}M ${token}`
  } else if (dailyAmount >= 1000) {
    return `${(dailyAmount / 1000).toFixed(1)}k ${token}`
  } else {
    return `${Math.round(dailyAmount)} ${token}`
  }
}

export const campaigns: Campaign[] = [
  {
    id: 1,
    name: 'BAYC<br/>PFP Staking',
    slug: 'BAYC',
    imageUrl: '/images/BAYC.jpg',
    stakers: 1234,
    rewardPool: '1.2M RWT',
    dailyReward: calculateDailyReward('1.2M RWT', 1234, 'APE'),
    apy: 12.5,
    apyColor: 'green',
    fundable: true,
    claimable: true,
    token: 'APE'
  },
  {
    id: 2,
    name: 'ETHGLOBAL<br/>PFP Staking',
    slug: 'ETHGLOBAL',
    imageUrl: '/images/ETHGLOBAL.jpg',
    stakers: 856,
    rewardPool: '950k RWT',
    dailyReward: calculateDailyReward('950k RWT', 856, 'EGLOBAL'),
    apy: 15.2,
    apyColor: 'green',
    fundable: true,
    claimable: false,
    token: 'EGLOBAL'
  },
  {
    id: 3,
    name: '1 INCH<br/>Derivative',
    slug: '1INCH',
    imageUrl: '/images/1INCH.jpg',
    stakers: 2341,
    rewardPool: '2.1M RWT',
    dailyReward: calculateDailyReward('2.1M RWT', 2341, '1INCH'),
    apy: 18.7,
    apyColor: 'green',
    fundable: true,
    claimable: true,
    token: '1INCH'
  },
  {
    id: 4,
    name: 'PUNKS<br/>PFP Staking',
    slug: 'PUNKS',
    imageUrl: '/images/CRYPTOPUNKS.jpg',
    stakers: 567,
    rewardPool: '800k RWT',
    dailyReward: calculateDailyReward('800k RWT', 567, 'ETH'),
    apy: 8.2,
    apyColor: 'green',
    fundable: true,
    claimable: false,
    token: 'ETH'
  },
  {
    id: 5,
    name: 'SPROTO<br/>PFP Staking',
    slug: 'SPROTO',
    imageUrl: '/images/SPROTO.jpg',
    stakers: 890,
    rewardPool: '500k RWT',
    dailyReward: calculateDailyReward('500k RWT', 890, 'BITCOIN'),
    apy: 22.1,
    apyColor: 'orange',
    fundable: false,
    claimable: true,
    token: 'BITCOIN'
  },
  {
    id: 6,
    name: 'MOG<br/>Derivative',
    slug: 'MOG',
    imageUrl: '/images/MOG.jpg',
    stakers: 1456,
    rewardPool: '1.8M RWT',
    dailyReward: calculateDailyReward('1.8M RWT', 1456, 'MOG'),
    apy: 14.3,
    apyColor: 'green',
    fundable: true,
    claimable: true,
    token: 'MOG'
  }
]
