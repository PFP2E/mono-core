# Service: `@pfp2e/records`

> The "Ground Truth" database service for the PFP2E protocol.

This service owns the SQLite database and exposes it via a clean REST API. It is the single source of truth for all off-chain data, including campaign definitions, the canonical set of valid PFP hashes, and the list of reward-eligible participants.

### API Endpoints
The API is fully documented using OpenAPI. When the service is running, an interactive Swagger UI is available.

-   **`GET /v1/docs`**: Interactive Swagger UI.
-   **`GET /v1/campaigns`**: Lists all campaigns.
-   **`GET /v1/users`**: Lists all reward-eligible participants.
-   **`GET /v1/target-pfps/:campaignId`**: Lists the target PFP hashes for a specific campaign.
-   **`GET /v1/verifications`**: Lists all historical verification records.

[↰ Back to `/loop`](../readme.md)
