# @pfp2e/contracts

This package contains the on-chain settlement layer for the pfp2e protocol, built with Solidity and Hardhat.

## Design Philosophy

These contracts follow a **Pragmatic Simplicity** approach. They are minimal, single-purpose, and optimized for clarity and security. The core component is an epoch-based Merkle distributor for handling recurring reward cycles.

## Core Components

-   **`MerkleDistributor.sol`**: A robust, epoch-based contract for distributing ERC-20 rewards. It supports multiple, distinct distribution cycles, each with its own Merkle root.
-   **`ProofOfPFP.sol`**: A derivative NFT contract that mints a "proof" token to the owner of an original NFT.
-   **`RewardToken.sol`**: A standard ERC-20 token, used for rewards and testing.

## Development Workflow

This is a standard Hardhat project, fully integrated into the monorepo's Bun workspace.

### Compile Contracts

To compile all contracts, run the following command from this directory (`/contracts`):

```bash
bunx hardhat compile
```

### Run Tests

The project has a comprehensive test suite that covers all functionality, including multi-epoch scenarios.

```bash
bunx hardhat test
```

### Deploy Contracts

Deployment is handled by Hardhat Ignition for reliability.

1.  **Start a local node:**
    ```bash
    bunx hardhat node
    ```

2.  **In a separate terminal, run the deployment script:**
    This will deploy the `RewardToken` and `MerkleDistributor` contracts to the local node.
    ```bash
    bunx hardhat run scripts/deploy.ts --network localhost
    ```

### End-to-End Test Script

To see the entire system in action, you can run the end-to-end test script. This script deploys the contracts, starts an epoch, funds the distributor, and simulates a successful user claim, all in a single command.

```bash
bunx hardhat run scripts/e2e-test.ts --network localhost
```

[↰ Back to root](../readme.md)