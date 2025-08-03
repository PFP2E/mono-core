# @pfp2e/contracts

This package contains the on-chain settlement layer for the pfp2e protocol, built with Solidity and Hardhat.

## Design Philosophy

These contracts follow a **Pragmatic Simplicity** approach. They are minimal, single-purpose, and optimized for clarity and security. The core component is an epoch-based Merkle distributor for handling recurring reward cycles, with a powerful 1inch integration for flexible reward claiming.

## Core Components

-   **`MerkleDistributor.sol`**: A robust, epoch-based contract for distributing ERC-20 rewards. It supports multiple, distinct distribution cycles and allows users to claim rewards as the native token or swap them instantly via 1inch.
-   **`RewardToken.sol`**: A standard ERC-20 token, used for rewards and testing.

## Reward Claim Flows

The protocol offers two distinct flows for claiming rewards, providing maximum flexibility for the user.

### Flow 1: Standard Claim (Native Reward Token)

This is the straightforward flow for users who want to receive the project's native reward token.

**Objective:** Claim your rewards directly to your wallet.

1.  **Fetch Proof:** The user's client calls the off-chain **Records API** to get their reward `amount` and a cryptographic `merkleProof`.
2.  **Execute Claim:** The client calls the `claim()` function on the `MerkleDistributor` contract, providing the proof and amount.
3.  **Verification & Transfer:** The contract verifies the proof and, if valid, transfers the specified `amount` of the native reward token directly to the user's wallet.

```
User Client              Off-Chain API              On-Chain Contract
     |                        |                            |
     |--- 1. Get Proof ------>|                            |
     |<---- (amount, proof) --|                            |
     |                        |                            |
     |--- 2. claim(proof) --->|--------------------------->| MerkleDistributor
     |                        |                            |   - Verifies Proof
     |                        |                            |   - Transfers Reward Token
     |<----------------------------------------------------|
     |                                                    |
```

### Flow 2: Claim & Swap with 1inch

This advanced flow allows users to instantly convert their rewards into a different token (e.g., USDT, ETH) in a single, gas-efficient transaction.

**Objective:** Claim rewards and automatically swap them to a token of your choice.

1.  **Fetch Proof:** Same as the standard flow, the client gets the reward `amount` and `merkleProof` from the **Records API**.
2.  **Fetch Swap Data:** The client calls the **1inch Aggregation API**, requesting the data needed to swap the reward amount from the native reward token to the user's desired destination token (e.g., USDT).
3.  **Execute Claim & Swap:** The client calls the `claimWithSwap()` function on the `MerkleDistributor`, providing the proof, amount, and the `swapData` from 1inch.
4.  **Verification & 1inch Swap:** The contract verifies the proof, approves the 1inch Router to spend the reward tokens, and executes the swap. The 1inch contract sends the resulting tokens (e.g., USDT) directly to the user's wallet.

```
User Client              Off-Chain API              On-Chain Contract
     |                        |                            |
     |--- 1. Get Proof ------>|                            |
     |<---- (amount, proof) --|                            |
     |                        |                            |
     |---- 2. Get Swap Data ->| (1inch API)                |
     |<---- (swapData) -------|                            |
     |                        |                            |
     |--- 3. claimWithSwap -->|--------------------------->| MerkleDistributor
     |     (proof, swapData)  |                            |   - Verifies Proof
     |                        |                            |   - Calls 1inch Router
     |                        |                            |       - Executes Swap
     |                        |                            |       - Sends Dest. Token
     |<----------------------------------------------------|
     |                                                    |
```

## Development Workflow

This is a standard Hardhat project, fully integrated into the monorepo's Bun workspace.

### Compile Contracts

```bash
bunx hardhat compile
```

### Run Tests

```bash
bunx hardhat test
```

### Deploy Contracts

1.  **Start a local node:**
    ```bash
    bunx hardhat node
    ```

2.  **In a separate terminal, run the deployment script:**
    ```bash
    bunx hardhat run scripts/deploy.ts --network localhost
    ```

[↰ Back to root](../readme.md)
