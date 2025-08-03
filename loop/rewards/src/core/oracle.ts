import { ethers } from 'ethers';
import { MerkleTree } from 'merkletreejs';
import { keccak256 } from 'js-sha3';
import { MERKLE_DISTRIBUTOR_ABI } from './abi';
import { DefaultService, type Campaign } from '@pfp2e/sdk/client';

// =============================================================================
// TYPES
// =============================================================================

interface Participant {
  id: number;
  social_handle: string;
  wallet_address: string;
}

interface Reward {
  social_handle: string;
  amount: bigint;
}

interface OracleConfig {
  recordsApiUrl: string;
  campaignId: string;
  privateKey: string;
  rpcUrl: string;
  contractAddress: string;
  rewardAmount: bigint;
}

// =============================================================================
// CORE ORACLE FUNCTIONS
// =============================================================================

/**
 * Fetches the ground truth data for the oracle to run against.
 * @param {OracleConfig} config - The oracle's configuration.
 * @returns {Promise<{campaign: Campaign, targetHashesSet: Set<string>, participants: Participant[]}>} The campaign, the set of valid PFP hashes, and the list of participants.
 */
export async function fetchGroundTruthData(config: OracleConfig) {
  console.log(`[1/5] Fetching ground truth for campaign "${config.campaignId}" from ${config.recordsApiUrl}...`);
  
  const campaign: Campaign = await DefaultService.getV1Campaigns(config.campaignId);
  const targetHashes: string[] = await DefaultService.getV1TargetPfps(config.campaignId);
  const participants: any[] = await DefaultService.getV1Users();
  
  const targetHashesSet = new Set(targetHashes);
  console.log(`  - Loaded campaign type: ${campaign.type}`);
  console.log(`  - Loaded ${targetHashesSet.size} target PFP hashes.`);
  console.log(`  - Loaded ${participants.length} participants to verify.`);
  
  return { campaign, targetHashesSet, participants };
}

/**
 * Simulates fetching a user's live PFP and hashing it.
 * @param {Participant} user - The user to verify.
 * @returns {Promise<string>} The simulated hash of the user's live PFP.
 */
async function getLivePfpHash(user: Participant): Promise<string> {
  // This is a simulation for the hackathon.
  // A real implementation would fetch the user's live PFP from the social media API.
  if (user.social_handle.startsWith('judge_')) {
    return keccak256('pfp2e-judge-pfp');
  }
  if (user.social_handle === 'user_A_valid') {
    return keccak256('bayc_1');
  }
  if (user.social_handle === 'user_B_valid_judge') {
    return keccak256('vitalik.eth');
  }
  return keccak256('not_a_bayc'); // Default to an invalid hash
}

/**
 * Runs the verification loop, checking each participant against the set of valid hashes.
 * @param {Participant[]} participants - The list of users to verify.
 * @param {Set<string>} targetHashesSet - The set of valid PFP hashes.
 * @param {Campaign} campaign - The campaign being processed.
 * @returns {Set<string>} A set of unique wallet addresses that passed verification.
 */
export async function runVerificationLoop(participants: Participant[], targetHashesSet: Set<string>, campaign: Campaign): Promise<Set<string>> {
  console.log(`[2/5] Running verification loop for ${participants.length} participants...`);
  const verifiedHandles = new Set<string>();

  if (targetHashesSet.size === 0) {
    if (campaign.type === 'overlay') {
      // This is a "default" or "overlay" campaign, verify all participants
      for (const user of participants) {
        verifiedHandles.add(user.social_handle);
      }
      console.log(`  - ✅ Campaign type is 'overlay' with no targets. Verified all ${participants.length} participants by default.`);
    } else {
      // This is an 'nft' campaign with no target hashes, which means no one can be verified.
      console.log(`  - ⚠️  Campaign type is 'nft' but has no target PFPs. No users can be verified.`);
    }
  } else {
    // Standard verification against target hashes
    for (const user of participants) {
      const livePfpHash = await getLivePfpHash(user);
      if (targetHashesSet.has(livePfpHash)) {
        verifiedHandles.add(user.social_handle);
        console.log(`    ✅ [SUCCESS] ${user.social_handle} is verified.`);
      } else {
        // This is very verbose, so we can comment it out for cleaner logs.
        // console.log(`    ❌ [FAILURE] ${user.social_handle} is not verified.`);
      }
    }
  }
  console.log(`  - Found ${verifiedHandles.size} unique verified handles.`);
  return verifiedHandles;
}

/**
 * Generates a Merkle tree from the list of verified wallets and their reward amounts.
 * @param {Set<string>} verifiedWallets - The set of wallets eligible for rewards.
 * @param {bigint} rewardAmount - The amount each wallet will receive.
 * @returns {{tree: MerkleTree, root: string} | null} The generated Merkle tree and its root, or null if no one is eligible.
 */
export function generateMerkleTree(verifiedHandles: Set<string>, rewardAmount: bigint): { tree: MerkleTree; root: string; } | null {
  console.log('[3/5] Calculating rewards and generating Merkle tree...');
  const rewards: Reward[] = Array.from(verifiedHandles).map(social_handle => ({
    social_handle,
    amount: rewardAmount
  }));

  if (rewards.length === 0) {
    console.log("  - No users verified. Nothing to generate.");
    return null;
  }

  const leaves = rewards.map(r =>
    ethers.solidityPackedKeccak256(["string", "uint256"], [r.social_handle, r.amount])
  );
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  const merkleRoot = tree.getHexRoot();
  console.log(`  - Generated Merkle Root: ${merkleRoot}`);
  return { tree, root: merkleRoot };
}

/**
 * Connects to the blockchain and submits the new Merkle root to the smart contract.
 * @param {string} merkleRoot - The new Merkle root to set.
 * @param {OracleConfig} config - The oracle's configuration.
 */
export async function settleOnChain(merkleRoot: string, config: OracleConfig) {
  console.log(`[4/5] Connecting to EVM and preparing to settle on-chain...`);
  const provider = new ethers.JsonRpcProvider(config.rpcUrl);
  const wallet = new ethers.Wallet(config.privateKey, provider);
  const contract = new ethers.Contract(config.contractAddress, MERKLE_DISTRIBUTOR_ABI, wallet);

  console.log(`  - Submitting transaction to set Merkle root on contract ${config.contractAddress}...`);
  const tx = await contract.startNewEpoch(merkleRoot);
  console.log(`  - Transaction sent! Hash: ${tx.hash}`);

  console.log('[5/5] Waiting for transaction confirmation...');
  await tx.wait();
  console.log('  - Transaction confirmed!');

  const newEpoch = await contract.currentEpoch();
  const newRootOnChain = await contract.merkleRoots(newEpoch);
  console.log(`  - Verified new Merkle Root for epoch ${newEpoch} on-chain: ${newRootOnChain}`);

  if (newRootOnChain !== merkleRoot) {
    throw new Error("FATAL: Merkle root on-chain does not match calculated root!");
  }
}
