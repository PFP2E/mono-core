<div align="center">
  <img src="docs/logo.png" alt="PFP2E Logo" width="128" />
  <h1>PFP2E Protocol</h1>
  <p>Verifiable Visual Identity · Programmable Rewards</p>
</div>

---

PFP2E is a hybrid on-chain/off-chain protocol for verifying visual identity and linking it to a trustless reward system. This repository contains the reference implementation of the system, structured as a professional monorepo.

## System Architecture

The system is composed of two primary layers: an **Off-Chain Loop** for data processing and an **On-Chain Layer** for settlement.

```mermaid
graph TD
    subgraph Off-Chain Loop
        A[(@pfp2e/records API)] -- Serves user & campaign data --> B[(@pfp2e/rewards Oracle)];
    end

    subgraph On-Chain Layer
        C[MerkleDistributor.sol] -- Manages reward epochs --> D[Claimants];
    end

    B -- 1. Calculates Merkle Root --> C;
    C -- 2. Stores Root --> C;
    D -- 3. Submits Proof to Claim --> C;

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#f9f,stroke:#333,stroke-width:2px
    style C fill:#ccf,stroke:#333,stroke-width:2px
    style D fill:#ccf,stroke:#333,stroke-width:2px
```

---

### Monorepo Structure

This repository is a monorepo managed by **[Bun](https://bun.sh/)** and **[Task](https://taskfile.dev/)**.

| Module | Description |
| :--- | :--- |
| **[`/contracts`](./contracts)** | The on-chain settlement layer, built with Solidity and Hardhat. |
| **[`/loop`](./loop)** | The off-chain verification engine, structured as a set of services. |
| **[`/demo`](./demo)** | Frontend proofs-of-concept, built with Next.js. |
| **[`/docs`](./docs)** | System architecture diagrams and documentation. |

---

### Getting Started

**Prerequisites:**
-   [**Task**](https://taskfile.dev/installation/)
-   [**Bun**](https://bun.sh/)

**1. Bootstrap the Project**
This is the only command you need to run for a first-time setup. It will install all dependencies and ensure the system is ready.

```bash
task bootstrap
```

**2. Run the End-to-End Demo**
To see the entire system in action, run the master `e2e:run` task. This will:
1. Start a local blockchain node.
2. Start the `@pfp2e/records` API server.
3. Deploy the smart contracts.
4. Run the `@pfp2e/rewards` oracle to settle a new epoch on-chain.
5. Run a test script to claim a reward from the newly settled epoch.

```bash
task e2e:run
```

---

### License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.