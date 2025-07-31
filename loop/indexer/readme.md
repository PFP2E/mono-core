# Service: `indexer`

> Pre-processes NFT collections for fast similarity search.

| | |
| :--- | :--- |
| **Input** | A list of NFT contract addresses. |
| **Process** | For each NFT, fetches the image and computes a perceptual hash (`ahash`). |
| **Output** | An SQLite database (`index.db`) mapping `(tokenId, ahash)`. |

[↰ Back to `/loop`](../readme.md)