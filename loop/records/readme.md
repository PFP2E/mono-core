# Service: `records`

> Manages the real-time verification lifecycle.

| | |
| :--- | :--- |
| **Input** | A user identifier (e.g., Twitter handle) and a campaign ID. |
| **Process** | Hashes the user's PFP and compares it against the `indexer`'s database. |
| **Output** | If a match is found, writes a verification receipt on-chain. |

[↰ Back to `/loop`](../readme.md)