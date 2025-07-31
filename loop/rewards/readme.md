# Service: `rewards`

> Calculates and prepares rewards for all verified participants.

| | |
| :--- | :--- |
| **Input** | A list of all verified users for the current epoch. |
| **Process** | Constructs a Merkle tree of eligible addresses and their reward amounts. |
| **Output** | A JSON object containing the Merkle root for the `MerkleDistributor` contract. |

[↰ Back to `/loop`](../readme.md)