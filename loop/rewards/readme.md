# Service: `@pfp2e/rewards`

> The "Oracle" that connects the off-chain world to the on-chain settlement layer.

| | |
| :--- | :--- |
| **Input** | Reads user and campaign data from the `@pfp2e/records` API. |
| **Process** | 1. Simulates PFP verification for all users. <br> 2. Calculates a Merkle Tree from the verified users. <br> 3. Connects to an EVM and calls the `startNewEpoch` function on the `MerkleDistributor` contract. |
| **Output** | A new epoch is started on the smart contract with a new Merkle Root, ready for users to claim against. |

[↰ Back to `/loop`](../readme.md)