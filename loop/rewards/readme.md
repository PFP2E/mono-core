# Service: `@pfp2e/rewards`

> The "Epoch Oracle" that connects off-chain verification data to the on-chain settlement layer.

This service is the core engine of the PFP2E protocol. It operates in discrete "epochs" and is responsible for the entire verification and reward settlement lifecycle.

### Oracle Process
When executed, the oracle performs the following steps:
1.  **Fetch Ground Truth**: Reads the canonical list of valid PFP hashes and reward-eligible participants from the `@pfp2e/records` API.
2.  **Live Verification**: For each participant, it simulates fetching their live social media PFP, hashes it, and compares it against the ground truth set.
3.  **Calculate Rewards**: It aggregates all successful verifications for the epoch into a rewards list.
4.  **Generate Merkle Tree**: It builds a Merkle tree from the rewards list to create a single, cryptographic proof of the epoch's results.
5.  **Settle On-Chain**: It connects to an EVM and calls the `startNewEpoch` function on the `MerkleDistributor` smart contract, writing the new Merkle root to the blockchain.

### Configuration
The oracle is configured via a `.env` file in this directory:
```
# The URL of the running @pfp2e/records service
RECORDS_API_URL="http://localhost:8787"

# The private key of the wallet authorized to call startNewEpoch()
PRIVATE_KEY="YOUR_CONTRACT_OWNER_PRIVATE_KEY"

# The JSON-RPC endpoint of the target EVM chain
RPC_URL="http://127.0.0.1:8545/"

# The deployed address of the MerkleDistributor contract
CONTRACT_ADDRESS="YOUR_DEPLOYED_MERKLE_DISTRIBUTOR_CONTRACT_ADDRESS"
```

[↰ Back to `/loop`](../readme.md)
