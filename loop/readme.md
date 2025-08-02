# /loop

> The off-chain verification engine, built with Bun and TypeScript.

### Design Philosophy
The backend follows a service-oriented data pipeline model. Each service is a distinct package within the Bun workspace, ensuring clear separation of concerns.

### Packages
-   **[`@pfp2e/sdk`](./sdk)**: A shared library containing the database client, shared types, and utilities.
-   **[`@pfp2e/records`](./records)**: The core API service that manages the verification lifecycle.
-   **[`@pfp2e/rewards`](./rewards)**: A service that consumes verification data to calculate and prepare rewards for on-chain settlement.
-   **[`@pfp2e/indexer`](./indexer)**: (Future service) Pre-processes NFT collections for fast similarity search.

[↰ Back to root](../readme.md)
