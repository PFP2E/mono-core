import { ethers, ignition } from "hardhat";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import DeployModule from "../ignition/modules/Deploy";

/**
 * This script performs an end-to-end test of the MerkleDistributor contract system.
 * It simulates a full lifecycle: deployment, epoch creation, funding, and a successful claim.
 */
async function main() {
  console.log("🚀 Starting end-to-end test...");

  // 1. DEPLOYMENT
  console.log("\nStep 1: Deploying contracts via Hardhat Ignition...");
  const { rewardToken, distributor } = await ignition.deploy(DeployModule);
  const [owner, user1, user2] = await ethers.getSigners();
  console.log(`   ✅ Contracts deployed.`);
  console.log(`   - RewardToken: ${await rewardToken.getAddress()}`);
  console.log(`   - MerkleDistributor: ${await distributor.getAddress()}`);

  // 2. EPOCH SETUP
  console.log("\nStep 2: Setting up data for Epoch 1...");
  const claimers = [
    { address: user1.address, amount: ethers.parseEther("100") },
    { address: user2.address, amount: ethers.parseEther("200") },
  ];
  const leaves = claimers.map((c) =>
    ethers.solidityPackedKeccak256(["address", "uint256"], [c.address, c.amount])
  );
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  const merkleRoot = tree.getHexRoot();
  console.log(`   - Generated Merkle Root: ${merkleRoot}`);

  console.log("\nStep 3: Starting Epoch 1 on-chain...");
  const tx = await distributor.startNewEpoch(merkleRoot);
  await tx.wait();
  console.log(`   ✅ Epoch 1 started. Transaction: ${tx.hash}`);

  // 4. FUNDING
  console.log("\nStep 4: Funding the distributor contract...");
  const totalRewards = claimers.reduce((sum, c) => sum + c.amount, ethers.parseEther("0"));
  await rewardToken.mint(await distributor.getAddress(), totalRewards);
  console.log(`   ✅ Minted and sent ${ethers.formatEther(totalRewards)} RWT to the distributor.`);

  // 5. CLAIM SIMULATION
  console.log(`\nStep 5: Simulating a claim for user ${user1.address}...`);
  const claimer = claimers[0];
  const proof = tree.getHexProof(ethers.solidityPackedKeccak256(["address", "uint256"], [claimer.address, claimer.amount]));
  
  const balanceBefore = await rewardToken.balanceOf(user1.address);
  console.log(`   - User 1 balance before claim: ${ethers.formatEther(balanceBefore)} RWT`);

  const claimTx = await distributor.connect(user1).claim(1, claimer.amount, proof);
  await claimTx.wait();
  console.log(`   ✅ Claim successful. Transaction: ${claimTx.hash}`);

  const balanceAfter = await rewardToken.balanceOf(user1.address);
  console.log(`   - User 1 balance after claim: ${ethers.formatEther(balanceAfter)} RWT`);

  if (balanceAfter === claimer.amount) {
    console.log("\n🎉 End-to-end test successful! The user claimed the correct amount.");
  } else {
    console.error("\n❌ End-to-end test failed! The user's final balance is incorrect.");
  }
}

main().catch((error) => {
  console.error("❌ Test script failed:", error);
  process.exitCode = 1;
});