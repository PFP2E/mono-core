# Service: `@pfp2e/records`

> Owns the database and serves as the "ground truth" for off-chain data via a REST API.

| | |
| :--- | :--- |
| **Input** | N/A. This service is the source of data. |
| **Process** | Manages an SQLite database and exposes it via a REST API with Swagger documentation. |
| **Output** | Serves user and campaign data to other services in the loop. |

### API Endpoints
The full API is described by the OpenAPI spec and can be viewed interactively.
-   `GET /v1/docs`: Interactive Swagger UI.
-   `GET /v1/campaigns`: Lists all available campaigns.
-   `GET /v1/users`: Lists all users.
-   `GET /v1/target-pfps/:campaignId`: Lists the target PFP hashes for a campaign.

[↰ Back to `/loop`](../readme.md)