import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * This module deploys the full MerkleDistributor system, including a new
 * RewardToken. In a real-world scenario, you might pass the token address
 * as a parameter if it already exists.
 */
const DeployModule = buildModule("DeployModule", (m) => {
  // Get the deployer account from Hardhat's configured accounts.
  const deployer = m.getAccount(0);

  // A placeholder address for the 1inch router.
  // Replace with the actual address on a live network.
  const oneInchRouter = m.getParameter(
    "oneInchRouter",
    "0x1111111111111111111111111111111111111111"
  );

  // Deploy the RewardToken contract, making the deployer the owner.
  const rewardToken = m.contract("RewardToken", [deployer]);

  // Deploy the MerkleDistributor, passing the address of the RewardToken
  // and making the deployer the initial owner.
  const distributor = m.contract("MerkleDistributor", [
    rewardToken,
    oneInchRouter,
    deployer,
  ]);

  // Return the deployed contracts for use in scripts or tests.
  return { rewardToken, distributor };
});

export default DeployModule;
