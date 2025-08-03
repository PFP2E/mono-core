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
import { OpenAPI, DefaultService } from '@pfp2e/sdk/client';
import { MERKLE_DISTRIBUTOR_ABI } from './core/abi';

// =============================================================================
// ORACLE CONFIGURATION
// =============================================================================

const {
    RECORDS_API_URL = 'http://localhost:8787',
    DEPLOYER_PRIVATE_KEY,
    RPC_URL,
    MERKLE_DISTRIBUTOR_ADDRESS,
    EPOCH_INTERVAL_MS = '30000', // Default to 30 seconds
} = process.env;

const config = {
  recordsApiUrl: RECORDS_API_URL,
  privateKey: DEPLOYER_PRIVATE_KEY!,
  rpcUrl: RPC_URL!,
  contractAddress: MERKLE_DISTRIBUTOR_ADDRESS!,
  rewardAmount: ethers.parseEther('100'), // 100 tokens per verified user
};

// Configure the SDK to use the correct API endpoint
OpenAPI.BASE = config.recordsApiUrl;

const CAMPAIGN_IDS = ['bayc-social-staking-mvp', 'default-x-campaign', 'judges-campaign'];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function checkApiHealth() {
    console.log(`[HEALTH] Checking health of records API at ${config.recordsApiUrl}...`);
    try {
        const response = await fetch(`${config.recordsApiUrl}/v1/campaigns`);
        if (!response.ok) {
            throw new Error(`API returned a non-ok status: ${response.status}`);
        }
        console.log("   ✅ API is healthy.");
        return true;
    } catch (error) {
        console.error("   ❌ API is unreachable or unhealthy.");
        console.error("      Please ensure the @pfp2e/records service is running.");
        console.error(`      Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return false;
    }
}

async function getCurrentEpochFromChain(): Promise<bigint> {
    console.log("[CHAIN] Fetching current epoch from contract...");
    const provider = new ethers.JsonRpcProvider(config.rpcUrl);
    const contract = new ethers.Contract(config.contractAddress, MERKLE_DISTRIBUTOR_ABI, provider);
    const epoch = await contract.currentEpoch();
    console.log(`   ✅ Current on-chain epoch is: ${epoch}`);
    return epoch;
}


// =============================================================================
// MAIN ORACLE LOOP
// =============================================================================

/**
 * @description The main function of the oracle. It executes one full epoch run for all campaigns.
 */
async function runOracleCycle() {
  // 1. Fetch current on-chain epoch
  const currentEpoch = await getCurrentEpochFromChain();
  const nextEpoch = currentEpoch + 1n;
  console.log(`
--- Starting Oracle Cycle for Epoch ${nextEpoch} ---`);

  // Fetch ALL campaigns from the records service
  const allCampaigns = await DefaultService.getV1Campaigns();

  for (const campaign of allCampaigns) {
    console.log(`
--- Processing Campaign: ${campaign.id} ---`);
    const campaignConfig = { ...config, campaignId: campaign.id };

    // 2. Fetch Off-Chain Data
    const { targetHashesSet, participants } = await fetchGroundTruthData(campaignConfig);

    // 3. Run Verification
    const verifiedHandles = await runVerificationLoop(participants, targetHashesSet, campaign);

    // 4. Generate Merkle Tree
    const merkleData = generateMerkleTree(verifiedHandles, config.rewardAmount);
    if (!merkleData) {
      console.log(`
--- Campaign ${campaign.id} Completed: No rewards to settle for epoch ${nextEpoch}. ---`);
      continue;
    }

    // 5. Settle On-Chain
    await settleOnChain(merkleData.root, campaignConfig);

    // 6. Record Verifications in DB
    await DefaultService.postV1Verifications({
        campaignId: campaign.id,
        epoch: Number(nextEpoch),
        verifiedHandles: Array.from(verifiedHandles),
    });
    console.log(`   ✅ Recorded ${verifiedHandles.size} verifications to the database.`);
  }

  console.log(`
--- Oracle Cycle for Epoch ${nextEpoch} Completed Successfully ---`);
}

/**
 * @description The main entry point that runs the oracle as a daemon.
 */
async function main() {
    console.log("🚀 Starting PFP2E Rewards Oracle Daemon...");
    // 1. Validate Configuration & Health
    if (!config.privateKey || !config.rpcUrl || !config.contractAddress) {
        throw new Error("Missing required environment variables: DEPLOYER_PRIVATE_KEY, RPC_URL, MERKLE_DISTRIBUTOR_ADDRESS");
    }
    if (!(await checkApiHealth())) {
        process.exit(1);
    }

    // 2. Start the main processing loop
    while (true) {
        try {
            await runOracleCycle();
            const interval = parseInt(EPOCH_INTERVAL_MS, 10);
            console.log(`\n[DAEMON] Cycle complete. Waiting ${interval / 1000} seconds for next cycle...`);
            await delay(interval);
        } catch (error) {
            console.error("\n--- ORACLE CYCLE FAILED ---");
            console.error(error);
            const errorInterval = 10000; // Wait 10 seconds before retrying on error
            console.log(`[DAEMON] Retrying in ${errorInterval / 1000} seconds...`);
            await delay(errorInterval);
        }
    }
}


// Run the oracle and handle any top-level errors.
main().catch(error => {
  console.error("\n--- ORACLE DAEMON FAILED TO START ---");
  console.error(error);
  process.exit(1);
});
