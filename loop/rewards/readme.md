# Service: `@pfp2e/rewards`

> Calculates and prepares rewards for all verified participants.

| | |
| :--- | :--- |
| **Input** | Reads all entries from the `verifications` table. |
| **Process** | Consumes the `@pfp2e/sdk` to query the database. It aggregates verification data to calculate the total reward due for each user. |
| **Output** | A JSON object mapping user wallet addresses to their claimable reward amounts, ready to be used as input for a Merkle tree. |

[↰ Back to `/loop`](../readme.md)
