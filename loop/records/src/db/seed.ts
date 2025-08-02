import { db } from '@pfp2e/sdk';
import type { Campaign } from '@pfp2e/sdk';

const campaigns: Campaign[] = [
  {
    id: 'bayc-social-staking',
    name: 'Bored Ape Yacht Club Social Staking',
    description: 'Get rewarded for using your BAYC NFT as your PFP on Twitter/X.',
    type: 'nft',
    rules: {
      type: 'nft',
      collectionAddress: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
      requireOwnership: true,
    },
    reward_info: {
      totalPool: '1,000,000 $APE',
      dailyRate: '10,000 $APE',
    },
    created_at: Math.floor(Date.now() / 1000),
  },
  {
    id: 'future-kicks-overlay',
    name: 'Future Kicks Overlay Campaign',
    description: 'Add the Future Kicks overlay to your PFP for a 20% discount.',
    type: 'overlay',
    rules: {
      type: 'overlay',
      overlayAssetUrl: 'https://example.com/overlays/future-kicks.png',
    },
    reward_info: {
      totalPool: 'Unlimited 20% discount codes',
    },
    created_at: Math.floor(Date.now() / 1000),
  },
];

console.log('Seeding database...');

const insertStmt = db.prepare(
  'INSERT OR IGNORE INTO campaigns (id, name, description, type, rules, reward_info, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
);

for (const campaign of campaigns) {
  try {
    insertStmt.run(
      campaign.id,
      campaign.name,
      campaign.description ?? null,
      campaign.type,
      JSON.stringify(campaign.rules),
      campaign.reward_info ? JSON.stringify(campaign.reward_info) : null,
      campaign.created_at
    );
    console.log(`- Seeded campaign: ${campaign.name}`);
  } catch (error) {
    console.error(`Failed to seed campaign: ${campaign.name}`, error);
  }
}

console.log('Seeding complete.');
