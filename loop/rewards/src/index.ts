import { db } from '@pfp2e/sdk';

console.log('Rewards service starting...');

interface Verification {
  id: number;
  user_id: number;
  campaign_id: string;
  pfp_id: number;
  verified_at: number;
  onchain_receipt_tx_hash: string | null;
}

interface User {
  id: number;
  wallet_address: string;
}

// 1. Fetch all successful verifications
console.log('Fetching all verifications...');
const verifications = db.query('SELECT * FROM verifications').all() as Verification[];

if (verifications.length === 0) {
  console.log('No verifications found. Nothing to do.');
  process.exit(0);
}

console.log(`Found ${verifications.length} verification records.`);

// 2. Calculate rewards (simple placeholder logic)
// Each verification is worth 100 reward units.
const rewards: { [userId: number]: number } = {};
for (const verification of verifications) {
  rewards[verification.user_id] = (rewards[verification.user_id] || 0) + 100;
}

console.log('Calculated rewards per user ID:', rewards);

// 3. Map user IDs to wallet addresses to prepare for Merkle tree
const userIds = Object.keys(rewards);
const userQuery = db.query<User, [string]>(`
  SELECT id, wallet_address FROM users WHERE id IN (${userIds.map(() => '?').join(',')})
`);
const users = userQuery.all(...userIds) as User[];

const merkleTreeInput: { [walletAddress: string]: number } = {};
for (const user of users) {
  if (user.wallet_address) {
    merkleTreeInput[user.wallet_address] = rewards[user.id];
  } else {
    console.warn(`User with ID ${user.id} has no wallet address, skipping reward.`);
  }
}

// 4. Final Output
// In a real scenario, we would now compute the Merkle root from this object.
// For now, we just output the prepared data.
console.log('\n--- Merkle Tree Input ---');
console.log(JSON.stringify(merkleTreeInput, null, 2));
console.log('-------------------------\n');

console.log('Rewards service finished.');