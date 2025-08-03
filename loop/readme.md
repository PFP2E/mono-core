# /loop

> The off-chain data processing engine, built with Bun and TypeScript.

### Design Philosophy
The backend follows a service-oriented architecture. Each package is a distinct service within the Bun workspace, ensuring clear separation of concerns and independent operation.

### Packages
-   **[`@pfp2e/sdk`](./sdk)**: A shared library containing a generated API client and shared TypeScript types.
-   **[`@pfp2e/records`](./records)**: The core API service that owns the database and serves as the "ground truth" for off-chain data.
-   **[`@pfp2e/rewards`](./rewards)**: The "oracle" service that consumes data from the `records` API, performs verification logic, and settles the results on-chain by calling the smart contract.
-   **[`@pfp2e/indexer`](./indexer)**: A service to pre-process NFT collections for fast similarity search.

[↰ Back to root](../readme.md)