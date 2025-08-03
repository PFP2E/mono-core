import { ethers, ignition } from "hardhat";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import DeployModule from "../ignition/modules/Deploy";
import { exec, execSync } from "child_process";

/**
 * This script performs an end-to-end test of the MerkleDistributor contract system
 * for the "Judges Campaign".
 * It simulates a full lifecycle: deployment, seeding, oracle run, and a successful claim.
 */
async function main() {
  console.log("🚀 Starting Judges E2E test...");

  // 1. DEPLOYMENT
  console.log("\nStep 1: Deploying contracts via Hardhat Ignition...");
  const { rewardToken, distributor } = await ignition.deploy(DeployModule);
  const [owner, judge1, judge2, judge3] = await ethers.getSigners();
  console.log(`   ✅ Contracts deployed.`);
  console.log(`   - RewardToken: ${await rewardToken.getAddress()}`);
  console.log(`   - MerkleDistributor: ${await distributor.getAddress()}`);

  // 2. SEEDING
  console.log("\nStep 2: Seeding the database with the Judges Campaign...");
  execSync("task records:db:seed-judges", { stdio: "inherit" });
  console.log("   ✅ Database seeded.");

  // 3. ORACLE RUN
  console.log("\nStep 3: Running the rewards oracle...");
  // Start the records service in the background
  const recordsService = exec("task records:dev");
  // Wait for the records service to start
  await new Promise(resolve => setTimeout(resolve, 5000));

  // We need to set the environment variables for the oracle to run
  process.env.RECORDS_API_URL = "http://localhost:8787"; // Assuming the records service is running
  process.env.PRIVATE_KEY = owner.privateKey;
  process.env.RPC_URL = "http://127.0.0.1:8545/"; // Hardhat network
  process.env.CONTRACT_ADDRESS = await distributor.getAddress();
  execSync("bun run loop/rewards/src/index.ts", { stdio: "inherit" });
  console.log("   ✅ Oracle run complete.");
  recordsService.kill();

  // 4. CLAIM SIMULATION
  console.log(`\nStep 4: Simulating a claim for judge ${judge1.address}...`);
  const rewardAmount = ethers.parseEther("100"); // This must match the amount in the oracle
  const leaf = ethers.solidityPackedKeccak256(["address", "uint256"], [judge1.address, rewardAmount]);
  
  // We need to re-create the Merkle tree to get the proof, since the API endpoint is not available
  const claimers = [
    { address: judge1.address, amount: rewardAmount },
    { address: judge2.address, amount: rewardAmount },
    { address: judge3.address, amount: rewardAmount },
  ];
  const leaves = claimers.map((c) =>
    ethers.solidityPackedKeccak256(["address", "uint256"], [c.address, c.amount])
  );
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  const proof = tree.getHexProof(leaf);

  const balanceBefore = await rewardToken.balanceOf(judge1.address);
  console.log(`   - Judge 1 balance before claim: ${ethers.formatEther(balanceBefore)} RWT`);

  // We need to fund the distributor contract
  const totalRewards = ethers.parseEther("300"); // 3 judges * 100 tokens
  await rewardToken.mint(await distributor.getAddress(), totalRewards);

  const currentEpoch = await distributor.currentEpoch();

  const claimTx = await distributor.connect(judge1).claim(currentEpoch, rewardAmount, proof);
  await claimTx.wait();
  console.log(`   ✅ Claim successful. Transaction: ${claimTx.hash}`);

  const balanceAfter = await rewardToken.balanceOf(judge1.address);
  console.log(`   - Judge 1 balance after claim: ${ethers.formatEther(balanceAfter)} RWT`);

  if (balanceAfter === rewardAmount) {
    console.log("\n🎉 Judges E2E test successful! The judge claimed the correct amount.");
  } else {
    console.error("\n❌ Judges E2E test failed! The judge's final balance is incorrect.");
  }
}

main().catch((error) => {
  console.error("❌ Test script failed:", error);
  process.exitCode = 1;
});
