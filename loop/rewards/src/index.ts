import 'dotenv/config';
import { OpenAPI } from '@pfp2e/sdk/client';
import { ethers } from 'ethers';
import { MerkleTree } from 'merkletreejs';
import { keccak256 } from 'js-sha3';

// =============================================================================
// CONFIGURATION
// =============================================================================
const RECORDS_API_URL = process.env.RECORDS_API_URL || 'http://localhost:8787';
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const CAMPAIGN_ID = 'bayc-social-staking-mvp';
const REWARD_AMOUNT = ethers.parseEther('100');
const CURRENT_EPOCH = 1;

const contractAbi = ["function setMerkleRoot(bytes32 _root) external", "function merkleRoot() view returns (bytes32)"];
OpenAPI.BASE = RECORDS_API_URL;

// =============================================================================
// MOCK PFP FETCHER (Hackathon MVP)
// =============================================================================
// Simulates fetching a user's live PFP and hashing it.
// The seed data (`seed.ts`) defines which users have "valid" PFPs.
async function getLivePfpHash(user: { social_handle: string }): Promise<string> {
  console.log(`  - [Simulating] Fetching live PFP for ${user.social_handle}...`);
  if (user.social_handle === 'user_A_valid') {
    return keccak256('bayc_1');
  }
  if (user.social_handle === 'user_B_valid_judge') {
    return keccak256('vitalik.eth');
  }
  return keccak256('not_a_bayc'); // Default to an invalid hash
}

// =============================================================================
// ORACLE MAIN LOGIC
// =============================================================================
async function runEpoch() {
  console.log(`\n--- Starting Oracle Epoch ${CURRENT_EPOCH} ---`);

  if (!PRIVATE_KEY || !RPC_URL || !CONTRACT_ADDRESS) {
    throw new Error("Missing required environment variables: PRIVATE_KEY, RPC_URL, CONTRACT_ADDRESS");
  }

  // 1. Fetch Ground Truth Data
  console.log(`[1/5] Fetching ground truth from ${RECORDS_API_URL}...`);
  const targetHashes: string[] = await fetch(`${RECORDS_API_URL}/v1/target-pfps/${CAMPAIGN_ID}`).then(res => res.json());
  const participants: any[] = await fetch(`${RECORDS_API_URL}/v1/users`).then(res => res.json());
  const targetHashesSet = new Set(targetHashes);
  console.log(`  - Loaded ${targetHashesSet.size} target PFP hashes.`);
  console.log(`  - Loaded ${participants.length} participants to verify.`);

  // 2. Verification Loop
  console.log(`[2/5] Running verification loop for ${participants.length} participants...`);
  const verifiedWallets = new Set<string>();
  for (const user of participants) {
    const livePfpHash = await getLivePfpHash(user);
    if (targetHashesSet.has(livePfpHash)) {
      // Ethers requires addresses to be properly checksummed before any on-chain interaction.
      const checksummedAddress = ethers.getAddress(user.wallet_address);
      verifiedWallets.add(checksummedAddress);
      console.log(`    ✅ [SUCCESS] ${user.social_handle} is verified.`);
    } else {
      console.log(`    ❌ [FAILURE] ${user.social_handle} is not verified.`);
    }
  }
  console.log(`  - Found ${verifiedWallets.size} unique verified wallets.`);

  // 3. Reward Calculation & Merkle Tree Generation
  console.log('[3/5] Calculating rewards and generating Merkle tree...');
  const rewards = Array.from(verifiedWallets).map(address => ({
    address,
    amount: REWARD_AMOUNT
  }));

  if (rewards.length === 0) {
    console.log("No users verified. Nothing to settle.");
    return;
  }

  const leaves = rewards.map(r =>
    ethers.solidityPackedKeccak256(["address", "uint256"], [r.address, r.amount])
  );
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  const merkleRoot = tree.getHexRoot();
  console.log(`  - Generated Merkle Root: ${merkleRoot}`);

  // 4. On-Chain Settlement
  console.log(`[4/5] Connecting to EVM and preparing to settle on-chain...`);
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, wallet);

  console.log(`  - Submitting transaction to set Merkle root on contract ${CONTRACT_ADDRESS}...`);
  const tx = await contract.setMerkleRoot(merkleRoot);
  console.log(`  - Transaction sent! Hash: ${tx.hash}`);

  // 5. Confirmation
  console.log('[5/5] Waiting for transaction confirmation...');
  await tx.wait();
  console.log('  - Transaction confirmed!');

  const newRootOnChain = await contract.merkleRoot();
  console.log(`  - Verified new Merkle Root on-chain: ${newRootOnChain}`);

  if (newRootOnChain !== merkleRoot) {
    throw new Error("FATAL: Merkle root on-chain does not match calculated root!");
  }

  console.log(`\n--- Oracle Epoch ${CURRENT_EPOCH} Completed Successfully ---`);
}

runEpoch().catch(error => {
  console.error("\n--- ORACLE RUN FAILED ---");
  console.error(error);
  process.exit(1);
});