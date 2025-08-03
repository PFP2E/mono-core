import { db } from './index';
import { Campaign } from '@pfp2e/sdk';
import { keccak256 } from 'js-sha3';

// =============================================================================
// CONFIGURATION
// =============================================================================

const CAMPAIGN_ID = 'bayc-social-staking-mvp';

const campaign: Omit<Campaign, 'rules'> = {
  id: CAMPAIGN_ID,
  name: 'Bored Ape Yacht Club Social Staking (MVP)',
  description: 'Get rewarded for using your BAYC NFT as your PFP on Twitter/X.',
  type: 'nft',
  reward_info: {
    totalPool: '1,000,000 $RWT',
    dailyRate: '10,000 $RWT',
  },
  created_at: Math.floor(Date.now() / 1000),
};

// =============================================================================
// GROUND TRUTH DATA
// =============================================================================

// 1. JUDGES: A list of social handles whose PFPs are considered valid.
// We don't need their wallet addresses, as they are not participants for rewards.
const JUDGE_HANDLES = [
  'vitalik.eth', 'sandeep.eth', 'hayden.eth', 'judge_4', 'judge_5',
  'judge_6', 'judge_7', 'judge_8', 'judge_9', 'judge_10',
  'judge_11', 'judge_12', 'judge_13', 'judge_14', 'judge_15'
];

// 2. NFT COLLECTION: A simulated list of PFP hashes from the target NFT collection.
const NFT_COLLECTION_HASHES = {
  'bayc_1': keccak256('bayc_1'),
  'bayc_2': keccak256('bayc_2'),
  'bayc_3': keccak256('bayc_3'),
};

// 3. PARTICIPANTS: The list of actual users who have connected wallets and are eligible for rewards.
// Their addresses are stored in lowercase to prevent checksum issues.
const PARTICIPANTS = [
  { social_handle: 'user_A_valid', wallet_address: '0xa00000000000000000000000000000000000000a', pfp_hash_key: 'bayc_1' },
  { social_handle: 'user_B_valid_judge', wallet_address: '0xb00000000000000000000000000000000000000b', pfp_hash_key: 'vitalik.eth' }, // This user is using a judge's PFP
  { social_handle: 'user_C_invalid', wallet_address: '0xc00000000000000000000000000000000000000c', pfp_hash_key: 'not_a_bayc' },
];

// =============================================================================
// DATABASE SEEDING LOGIC
// =============================================================================

try {
  console.log('Seeding database with oracle-centric architecture...');
  db.transaction(() => {
    // 1. Clear all existing data to ensure a clean slate
    db.exec('DELETE FROM verifications; DELETE FROM pfps; DELETE FROM target_pfps; DELETE FROM users; DELETE FROM campaigns;');

    // 2. Seed the Campaign
    const campaignStmt = db.prepare('INSERT INTO campaigns (id, name, description, type, reward_info, created_at) VALUES (?, ?, ?, ?, ?, ?)');
    campaignStmt.run(campaign.id, campaign.name, campaign.description, campaign.type, JSON.stringify(campaign.reward_info), campaign.created_at);
    console.log(`- Seeded campaign: ${campaign.name}`);

    // 3. Seed Target PFPs (NFT Collection + Judges)
    const targetPfpStmt = db.prepare('INSERT INTO target_pfps (campaign_id, pfp_hash, description) VALUES (?, ?, ?)');
    
    // Add NFT collection hashes
    for (const [key, hash] of Object.entries(NFT_COLLECTION_HASHES)) {
      targetPfpStmt.run(CAMPAIGN_ID, hash, `NFT: ${key}`);
    }
    // Add Judge PFP hashes
    for (const handle of JUDGE_HANDLES) {
      targetPfpStmt.run(CAMPAIGN_ID, keccak256(handle), `Judge: ${handle}`);
    }
    console.log(`- Seeded ${Object.keys(NFT_COLLECTION_HASHES).length + JUDGE_HANDLES.length} target PFP hashes.`);

    // 4. Seed the Participants into the users table
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
