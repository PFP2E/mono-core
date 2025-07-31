# /loop

> The off-chain verification engine, built with Node.js.

### Design Philosophy
The backend follows a service-oriented data pipeline model. Each service has a single, clear responsibility, making the system easy to understand, test, and maintain.

### Development Workflow
This module follows the same containerized, `Task`-based workflow as `/demo`.

### Service Pipeline
-   **[`/indexer`](./indexer/readme.md)**: Pre-processes NFT collections into a searchable format.
-   **[`/records`](./records/readme.md)**: Manages the verification lifecycle and writes on-chain receipts.
-   **[`/rewards`](./rewards/readme.md)**: Calculates rewards and constructs the Merkle tree for settlement.
-   **[`/sdk`](./sdk/readme.md)**: Shared utilities and clients for all backend services.

[↰ Back to root](../readme.md)