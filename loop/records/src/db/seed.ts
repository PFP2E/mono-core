import { db } from './index';
import { Campaign } from '@pfp2e/sdk';
import { keccak256 } from 'js-sha3';

// =============================================================================
// CONFIGURATION
// =============================================================================

const BAYC_CAMPAIGN_ID = 'bayc-social-staking-mvp';
const DEFAULT_X_CAMPAIGN_ID = 'default-x-campaign';

const baycCampaign: Omit<Campaign, 'rules'> = {
  id: BAYC_CAMPAIGN_ID,
  name: 'Bored Ape Yacht Club Social Staking (MVP)',
  description: 'Get rewarded for using your BAYC NFT as your PFP on Twitter/X.',
  type: 'nft',
  reward_info: {
    totalPool: '1,000,000 $RWT',
    dailyRate: '10,000 $RWT',
  },
  created_at: Math.floor(Date.now() / 1000),
};

const defaultXCampaign: Omit<Campaign, 'rules'> = {
    id: DEFAULT_X_CAMPAIGN_ID,
    name: 'Default X Campaign',
    description: 'A default campaign for all new X users.',
    type: 'overlay', // or 'nft', doesn't matter as it has no targets
    reward_info: {
      totalPool: '500,000 $DEFAULT',
      dailyRate: '5,000 $DEFAULT',
    },
    created_at: Math.floor(Date.now() / 1000),
  };

// =============================================================================
// GROUND TRUTH DATA
// =============================================================================

const JUDGE_HANDLES = [
  'vitalik.eth', 'sandeep.eth', 'hayden.eth', 'judge_4', 'judge_5',
  'judge_6', 'judge_7', 'judge_8', 'judge_9', 'judge_10',
  'judge_11', 'judge_12', 'judge_13', 'judge_14', 'judge_15'
];

const NFT_COLLECTION_HASHES = {
  'bayc_1': keccak256('bayc_1'),
  'bayc_2': keccak256('bayc_2'),
  'bayc_3': keccak256('bayc_3'),
};

const PARTICIPANTS = [
  { social_handle: 'user_A_valid', wallet_address: '0xa00000000000000000000000000000000000000a', pfp_hash_key: 'bayc_1' },
  { social_handle: 'user_B_valid_judge', wallet_address: '0xb00000000000000000000000000000000000000b', pfp_hash_key: 'vitalik.eth' },
  { social_handle: 'user_C_invalid', wallet_address: '0xc00000000000000000000000000000000000000c', pfp_hash_key: 'not_a_bayc' },
];

// =============================================================================
// DATABASE SEEDING LOGIC
// =============================================================================

try {
  console.log('Seeding database with oracle-centric architecture...');
  db.transaction(() => {
    db.exec('DELETE FROM verifications; DELETE FROM pfps; DELETE FROM target_pfps; DELETE FROM users; DELETE FROM campaigns;');

    const campaignStmt = db.prepare('INSERT INTO campaigns (id, name, description, type, reward_info, created_at) VALUES (?, ?, ?, ?, ?, ?)');
    campaignStmt.run(baycCampaign.id, baycCampaign.name, baycCampaign.description ?? null, baycCampaign.type, JSON.stringify(baycCampaign.reward_info) ?? null, baycCampaign.created_at);
    console.log(`- Seeded campaign: ${baycCampaign.name}`);
    campaignStmt.run(defaultXCampaign.id, defaultXCampaign.name, defaultXCampaign.description ?? null, defaultXCampaign.type, JSON.stringify(defaultXCampaign.reward_info) ?? null, defaultXCampaign.created_at);
    console.log(`- Seeded campaign: ${defaultXCampaign.name}`);

    const targetPfpStmt = db.prepare('INSERT INTO target_pfps (campaign_id, pfp_hash, description) VALUES (?, ?, ?)');
    
    for (const [key, hash] of Object.entries(NFT_COLLECTION_HASHES)) {
      targetPfpStmt.run(BAYC_CAMPAIGN_ID, hash, `NFT: ${key}`);
    }
    for (const handle of JUDGE_HANDLES) {
      targetPfpStmt.run(BAYC_CAMPAIGN_ID, keccak256(handle), `Judge: ${handle}`);
    }
    console.log(`- Seeded ${Object.keys(NFT_COLLECTION_HASHES).length + JUDGE_HANDLES.length} target PFP hashes for BAYC campaign.`);

    const userStmt = db.prepare('INSERT INTO users (social_platform, social_handle, wallet_address, created_at) VALUES (?, ?, ?, ?)');
    for (const user of PARTICIPANTS) {
      userStmt.run('twitter', user.social_handle, user.wallet_address, Date.now());
    }
    console.log(`- Seeded ${PARTICIPANTS.length} reward-eligible participants.`);

  })();
  console.log('Seeding complete.');
} catch (error) {
  console.error('Failed to seed database:', error);
  console.error(error);
  process.exit(1);
}