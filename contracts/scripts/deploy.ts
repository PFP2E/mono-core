import { ignition, ethers } from "hardhat";
import DeployModule from "../ignition/modules/Deploy";

async function main() {
  console.log("🚀 Starting deployment with Hardhat Ignition...");
  console.log("----------------------------------------------------");

  // Get deployer information
  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);

  console.log(`👤 Deployer Address: ${deployer.address}`);
  console.log(`💰 Deployer Balance: ${ethers.formatEther(balance)} ETH`);
  console.log("----------------------------------------------------");

  // The `deploy` function receives the module and executes it.
  const { rewardToken, distributor } = await ignition.deploy(DeployModule);

  const rewardTokenAddress = await rewardToken.getAddress();
  const distributorAddress = await distributor.getAddress();

  const balanceAfter = await ethers.provider.getBalance(deployer.address);

  console.log("✅ Deployment successful!");
  console.log("----------------------------------------------------");
  console.log(`RewardToken deployed to:       ${rewardTokenAddress}`);
  console.log(`MerkleDistributor deployed to: ${distributorAddress}`);
  console.log("----------------------------------------------------");
  console.log(`💰 Deployer Balance after: ${ethers.formatEther(balanceAfter)} ETH`);
  console.log(`🔥 Gas Used: ${ethers.formatEther(balance - balanceAfter)} ETH`);
  console.log("----------------------------------------------------");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});