import { ethers } from "hardhat";
import 'dotenv/config';

// Import the ABI directly from the compiled artifact.
import { abi as MERKLE_DISTRIBUTOR_ABI } from "../artifacts/contracts/MerkleDistributor.sol/MerkleDistributor.json";

/**
 * This script performs an end-to-end test of the MerkleDistributor contract system
 * for the "Judges Campaign" by consuming the live records API.
 *
 * PRE-REQUISITES:
 * 1. A Hardhat node must be running (`task contracts:node`).
 * 2. Contracts must be deployed (`task contracts:deploy`).
 * 3. The records service must be running (`task records:dev`).
 * 4. The rewards oracle must have been run at least once (`task rewards:start`).
 * 5. A .env file must be present in the `contracts/` directory with the required variables.
 */
async function main() {
  console.log("🚀 Starting Judges E2E test...");

  // --- CONFIGURATION ---
  const {
    RECORDS_API_URL = "http://localhost:8787",
    MERKLE_DISTRIBUTOR_ADDRESS,
    REWARD_TOKEN_ADDRESS,
  } = process.env;

  if (!MERKLE_DISTRIBUTOR_ADDRESS || !REWARD_TOKEN_ADDRESS) {
    throw new Error("MERKLE_DISTRIBUTOR_ADDRESS and REWARD_TOKEN_ADDRESS must be set in the environment.");
  }

  const CAMPAIGN_ID = 'judges-campaign';
  const JUDGE_HANDLE = 'judge_1';

  // 1. CONNECT TO DEPLOYED CONTRACTS
  console.log("\nStep 1: Connecting to deployed contracts...");
  const [owner, judge1] = await ethers.getSigners();
  
  const distributor = new ethers.Contract(MERKLE_DISTRIBUTOR_ADDRESS, MERKLE_DISTRIBUTOR_ABI, judge1);
  const rewardToken = await ethers.getContractAt("RewardToken", REWARD_TOKEN_ADDRESS, judge1);

  console.log(`   ✅ Connected to contracts.`);
  console.log(`   - RewardToken: ${REWARD_TOKEN_ADDRESS}`);
  console.log(`   - MerkleDistributor: ${MERKLE_DISTRIBUTOR_ADDRESS}`);

  // 2. VERIFY ON-CHAIN EPOCH
  console.log(`\nStep 2: Verifying contract's current epoch...`);
  const onChainEpoch = await distributor.currentEpoch();
  if (onChainEpoch < 1) {
    throw new Error(`Contract epoch is not yet started. Expected >= 1, got ${onChainEpoch}`);
  }
  console.log(`   ✅ Contract is at epoch ${onChainEpoch}.`);

  // 3. VERIFY USER STATUS VIA API
  console.log(`\nStep 3: Verifying status for user "${JUDGE_HANDLE}" via API...`);
  const statusRes = await fetch(`${RECORDS_API_URL}/v1/user-status/${JUDGE_HANDLE}`);
  if (!statusRes.ok) {
    throw new Error(`Failed to fetch user status: ${await statusRes.text()}`);
  }
  const statusData = await statusRes.json();
  const judgeCampaignStatus = statusData.campaigns.find((c: any) => c.campaignId === CAMPAIGN_ID);
  
  if (!judgeCampaignStatus || !judgeCampaignStatus.isClaimable) {
      throw new Error(`User "${JUDGE_HANDLE}" is not verified or rewards are not claimable.`);
  }
  console.log(`   ✅ User is verified and rewards are claimable for epoch ${judgeCampaignStatus.latestEpoch}.`);

  // 4. FETCH PROOF VIA API
  console.log(`\nStep 4: Fetching Merkle proof for "${JUDGE_HANDLE}"...`);
  const proofRes = await fetch(`${RECORDS_API_URL}/v1/proof/${CAMPAIGN_ID}/${JUDGE_HANDLE}`);
   if (!proofRes.ok) {
    throw new Error(`Failed to fetch proof: ${await proofRes.text()}`);
  }
  const proofData = await proofRes.json();
  const { epoch, amount, proof } = proofData;
  console.log(`   ✅ Proof received for epoch ${epoch}.`);

  // 5. FUNDING (Owner action)
  console.log("\nStep 5: Funding the distributor contract...");
  const totalRewards = ethers.parseEther("300"); // 3 judges * 100 tokens
  await rewardToken.connect(owner).mint(MERKLE_DISTRIBUTOR_ADDRESS, totalRewards);
  console.log(`   ✅ Minted and sent ${ethers.formatEther(totalRewards)} RWT to the distributor.`);

  // 6. CLAIM SIMULATION (Judge action)
  console.log(`\nStep 6: Simulating a claim for judge ${judge1.address}...`);
  const balanceBefore = await rewardToken.balanceOf(judge1.address);
  console.log(`   - Judge 1 balance before claim: ${ethers.formatEther(balanceBefore)} RWT`);

  const claimTx = await distributor.connect(judge1).claim(epoch, JUDGE_HANDLE, amount, proof);
  await claimTx.wait();
  console.log(`   ✅ Claim successful. Transaction: ${claimTx.hash}`);

  const balanceAfter = await rewardToken.balanceOf(judge1.address);
  console.log(`   - Judge 1 balance after claim: ${ethers.formatEther(balanceAfter)} RWT`);

  if (balanceAfter.toString() === amount.toString()) {
    console.log("\n🎉 Judges E2E test successful! The judge claimed the correct amount.");
  } else {
    console.error("\n❌ Judges E2E test failed! The judge's final balance is incorrect.");
  }
}

main().catch((error) => {
  console.error("❌ Test script failed:", error);
  process.exitCode = 1;
});
