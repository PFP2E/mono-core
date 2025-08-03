/**
 * @file The main entry point for the PFP2E Rewards Oracle.
 * @description This script orchestrates the entire epoch process, from fetching data
 * to settling the final Merkle root on-chain. It is designed to be run as a periodic job.
 */

import 'dotenv/config';
import { ethers } from 'ethers';
import {
  fetchGroundTruthData,
  runVerificationLoop,
  generateMerkleTree,
  settleOnChain,
} from './core/oracle';

// =============================================================================
// ORACLE CONFIGURATION
// =============================================================================

/**
 * @description The configuration for the oracle run.
 * Values are sourced from environment variables for security and flexibility.
 */
const config = {
  recordsApiUrl: process.env.RECORDS_API_URL || 'http://localhost:8787',
  campaignId: 'bayc-social-staking-mvp',
  privateKey: process.env.PRIVATE_KEY!,
  rpcUrl: process.env.RPC_URL!,
  contractAddress: process.env.CONTRACT_ADDRESS!,
  rewardAmount: ethers.parseEther('100'), // 100 tokens per verified user
};

const CURRENT_EPOCH = 1; // In a production system, this would be dynamic.

// =============================================================================
// MAIN EXECUTION
// =============================================================================

/**
 * @description The main function of the oracle. It executes one full epoch run.
 */
async function main() {
  console.log(`\n--- Starting Oracle Epoch ${CURRENT_EPOCH} ---`);

  // 1. Validate Configuration
  if (!config.privateKey || !config.rpcUrl || !config.contractAddress) {
    throw new Error("Missing required environment variables: PRIVATE_KEY, RPC_URL, CONTRACT_ADDRESS");
  }

  // 2. Fetch Off-Chain Data
  const { targetHashesSet, participants } = await fetchGroundTruthData(config);

  // 3. Run Verification
  const verifiedWallets = await runVerificationLoop(participants, targetHashesSet);

  // 4. Generate Merkle Tree
  const merkleData = generateMerkleTree(verifiedWallets, config.rewardAmount);
  if (!merkleData) {
    console.log(`\n--- Oracle Epoch ${CURRENT_EPOCH} Completed: No rewards to settle. ---`);
    return;
  }

  // 5. Settle On-Chain
  await settleOnChain(merkleData.root, config);

  console.log(`\n--- Oracle Epoch ${CURRENT_EPOCH} Completed Successfully ---`);
}

// Run the oracle and handle any top-level errors.
main().catch(error => {
  console.error("\n--- ORACLE RUN FAILED ---");
  console.error(error);
  process.exit(1);
});
