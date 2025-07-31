# /contracts

> The on-chain settlement layer, built with Solidity and Hardhat.

### Design Philosophy
These contracts follow a **Pragmatic Simplicity** approach. They are minimal, single-purpose, and optimized for clarity to serve the core needs of the hackathon demo.

### Core Components
-   **`MerkleDistributor.sol`**: A minimal, non-custodial contract for distributing ERC-20 rewards via a Merkle proof.
-   **`ProofOfPFP.sol`**: A derivative NFT contract that mints a "proof" token to the owner of an original NFT.
-   **`RewardToken.sol`**: A standard ERC-20 token for rewards.

### Development
-   **Framework**: [Hardhat](https://hardhat.org/)
-   **Compiler**: `0.8.20`
-   **Dependencies**: `OpenZeppelin Contracts`

```bash
# Compile all contracts
npx hardhat compile

# Run the full test suite
npx hardhat test
```

[↰ Back to root](../readme.md)
