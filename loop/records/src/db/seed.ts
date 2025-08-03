import { db } from './index';
import { Campaign } from '@pfp2e/sdk';
import { keccak256 } from 'js-sha3';

// =============================================================================
// CAMPAIGN DEFINITIONS
// =============================================================================

const campaigns: Omit<Campaign, 'rules' | 'created_at'>[] = [
  {
    id: 'bayc-pfp-staking',
    name: 'BAYC PFP Staking',
    description: 'Get rewarded for using your BAYC NFT as your PFP on Twitter/X.',
    type: 'nft',
    reward_info: {
      totalPool: '1.2M APE',
      dailyRate: '9.72 APE',
    },
  },
  {
    id: 'ethglobal-pfp-staking',
    name: 'ETHGLOBAL PFP Staking',
    description: 'A campaign for ETHGLOBAL participants.',
    type: 'nft',
    reward_info: {
      totalPool: '950k EGLOBAL',
      dailyRate: '593 EGLOBAL',
    },
  },
  {
    id: '1inch-derivative',
    name: '1 INCH Derivative',
    description: 'Support 1inch with a branded PFP overlay.',
    type: 'overlay',
    reward_info: {
      totalPool: '2.1M 1INCH',
      dailyRate: '8.7 1INCH',
    },
  },
  {
    id: 'punks-pfp-staking',
    name: 'PUNKS PFP Staking',
    description: 'Show off your CryptoPunk and earn rewards.',
    type: 'nft',
    reward_info: {
      totalPool: '1800 ETH',
      dailyRate: '0.317 ETH',
    },
  },
  {
    id: 'sproto-pfp-staking',
    name: 'SPROTO PFP Staking',
    description: 'A campaign for the Sproto community.',
    type: 'nft',
    reward_info: {
      totalPool: '800k BITCOIN',
      dailyRate: '8.98 BITCOIN',
    },
  },
  {
    id: 'mog-acc-derivative',
    name: 'MOG/ACC Derivative',
    description: 'Join the MOG/ACC movement with a derivative PFP.',
    type: 'overlay',
    reward_info: {
      totalPool: '118M MOG',
      dailyRate: '480 MOG',
    },
  },
  {
    id: 'default-x-campaign',
    name: 'Default X Campaign',
    description: 'A default campaign for all new X users.',
    type: 'overlay',
    reward_info: {
      totalPool: '500,000 $DEFAULT',
      dailyRate: '5,000 $DEFAULT',
    },
  },
  {
    id: 'judges-campaign',
    name: 'ETHGlobal Judges Campaign',
    description: 'A special campaign for ETHGlobal hackathon judges.',
    type: 'nft',
    reward_info: {
      totalPool: '300 RWT',
      dailyRate: 'N/A',
    },
  }
];

const JUDGES = [
    { social_handle: 'judge_1', wallet_address: '0x1000000000000000000000000000000000000001' },
    { social_handle: 'judge_2', wallet_address: '0x2000000000000000000000000000000000000002' },
    { social_handle: 'judge_3', wallet_address: '0x3000000000000000000000000000000000000003' },
    { social_handle: 'mr13tech', wallet_address: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199' },
];

// =============================================================================
// DATABASE SEEDING LOGIC
// =============================================================================

try {
  console.log('Seeding database with all campaigns and judges...');
  db.transaction(() => {
    // 1. Clear existing data
    db.exec('DELETE FROM verifications; DELETE FROM pfps; DELETE FROM target_pfps; DELETE FROM users; DELETE FROM campaigns;');
    console.log('- Cleared existing data.');

    // 2. Seed campaigns
    const campaignStmt = db.prepare('INSERT INTO campaigns (id, name, description, type, reward_info, created_at) VALUES (?, ?, ?, ?, ?, ?)');
    for (const campaign of campaigns) {
      campaignStmt.run(
        campaign.id,
        campaign.name,
        campaign.description ?? null,
        campaign.type,
        JSON.stringify(campaign.reward_info) ?? null,
        Math.floor(Date.now() / 1000)
      );
    }
    console.log(`- Seeded ${campaigns.length} campaigns.`);

    // 3. Seed judges as users
    const userStmt = db.prepare('INSERT OR IGNORE INTO users (social_platform, social_handle, wallet_address, created_at) VALUES (?, ?, ?, ?)');
    for (const judge of JUDGES) {
      userStmt.run('twitter', judge.social_handle, judge.wallet_address, Date.now());
    }
    console.log(`- Seeded ${JUDGES.length} judges as users.`);

    // 4. Seed target PFPs for the judges campaign (the ground truth)
    const targetPfpStmt = db.prepare('INSERT INTO target_pfps (campaign_id, pfp_hash, description) VALUES (?, ?, ?)');
    for (const judge of JUDGES) {
        // For the judges campaign, the "hash" is just the hash of their handle.
        // The oracle will check if a user's handle is in this list.
        targetPfpStmt.run('judges-campaign', keccak256(judge.social_handle), `Judge: ${judge.social_handle}`);
    }
    console.log(`- Seeded ${JUDGES.length} target PFPs for the judges-campaign.`);


  })();
  console.log('Seeding complete.');
} catch (error) {
  console.error('Failed to seed database:', error);
  process.exit(1);
}
