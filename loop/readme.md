# /loop

> The off-chain data processing engine, built with Bun and TypeScript.

### Design Philosophy
The backend follows a clean, service-oriented architecture. Each package is a distinct service with a clear responsibility, ensuring a robust and maintainable system.

### Architecture Overview

1.  **`@pfp2e/records` (The Ground Truth Database)**
    This service owns the project's database. It is the single source of truth for all off-chain data, such as campaign rules, the list of valid PFP hashes, and registered users. It exposes this data via a simple, read-only REST API.

2.  **`@pfp2e/rewards` (The Epoch Oracle)**
    This is the core engine of the protocol. It runs in discrete "epochs" to:
    -   **Fetch** the ground truth data from the `records` service.
    -   **Verify** users by checking their live PFPs against the ground truth.
    -   **Calculate** rewards for the epoch.
    -   **Settle** the results on-chain by calling the `MerkleDistributor` smart contract.

3.  **`@pfp2e/sdk` (Shared Client)**
    A shared library containing a type-safe API client for the `@pfp2e/records` service, automatically generated from its OpenAPI specification.

[↰ Back to root](../readme.md)
