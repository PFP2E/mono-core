# Service: `@pfp2e/records`

> Manages the real-time verification lifecycle via a REST API.

| | |
| :--- | :--- |
| **Input** | A user identifier and a campaign ID via the API. |
| **Process** | Consumes the `@pfp2e/sdk` to interact with the database. It validates requests, fetches campaign rules, and (in the future) will perform PFP hashing and comparison. |
| **Output** | A verification status via the API and a new record in the `verifications` table upon success. |

### API Endpoints
-   `GET /v1/campaigns`: Lists all available campaigns.
-   `GET /v1/campaigns/:id`: Fetches details for a single campaign.
-   `POST /v1/verify`: Submits a user for verification against a campaign.

[↰ Back to `/loop`](../readme.md)
