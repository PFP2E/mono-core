import { db } from './index';
import { Campaign } from '@pfp2e/sdk';
import { keccak256 } from 'js-sha3';

// =============================================================================
// CONFIGURATION
// =============================================================================

const CAMPAIGN_ID = 'judges-campaign';

const campaign: Omit<Campaign, 'rules'> = {
  id: CAMPAIGN_ID,
  name: 'PFP2E Judges Campaign',
  description: 'A special campaign for the hackathon judges.',
  type: 'nft',
  reward_info: {
    totalPool: '1,000,000 $JUDGE',
    dailyRate: '10,000 $JUDGE',
  },
  created_at: Math.floor(Date.now() / 1000),
};

// =============================================================================
// GROUND TRUTH DATA
// =============================================================================

// 1. JUDGES: A list of judges who will be participants in this campaign.
const JUDGES = [
  { social_handle: 'judge_1', wallet_address: '0x1000000000000000000000000000000000000001' },
  { social_handle: 'judge_2', wallet_address: '0x2000000000000000000000000000000000000002' },
  { social_handle: 'judge_3', wallet_address: '0x3000000000000000000000000000000000000003' },
];

// 2. TARGET PFP: The PFP that the judges should be using.
const TARGET_PFP_HASH = keccak256('pfp2e-judge-pfp');

// =============================================================================
// DATABASE SEEDING LOGIC
// =============================================================================

try {
  console.log('Seeding database with judges campaign...');
  db.transaction(() => {
    // 1. Clear all existing data to ensure a clean slate
    db.exec('DELETE FROM verifications; DELETE FROM pfps; DELETE FROM target_pfps; DELETE FROM users; DELETE FROM campaigns;');

    // 2. Seed the Campaign
    const campaignStmt = db.prepare('INSERT INTO campaigns (id, name, description, type, reward_info, created_at) VALUES (?, ?, ?, ?, ?, ?)');
    campaignStmt.run(campaign.id, campaign.name, campaign.description ?? null, campaign.type, JSON.stringify(campaign.reward_info) ?? null, campaign.created_at);
    console.log(`- Seeded campaign: ${campaign.name}`);

    // 3. Seed Target PFP
    const targetPfpStmt = db.prepare('INSERT INTO target_pfps (campaign_id, pfp_hash, description) VALUES (?, ?, ?)');
    targetPfpStmt.run(CAMPAIGN_ID, TARGET_PFP_HASH, 'PFP2E Judge PFP');
    console.log(`- Seeded target PFP hash.`);

    // 4. Seed the Participants (Judges) into the users table
    const userStmt = db.prepare('INSERT INTO users (social_platform, social_handle, wallet_address, created_at) VALUES (?, ?, ?, ?)');
    for (const user of JUDGES) {
      userStmt.run('twitter', user.social_handle, user.wallet_address, Date.now());
    }
    console.log(`- Seeded ${JUDGES.length} judges as participants.`);

  })();
  console.log('Seeding complete.');
} catch (error) {
  console.error('Failed to seed database:', error);
  console.error(error);
  process.exit(1);
}
