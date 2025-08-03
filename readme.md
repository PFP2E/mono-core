<div align="center">
  <img src="docs/logo.png" alt="PFP2E Logo" width="128" />
  <h1>PFP2E: Proof of PFP Engine</h1>
  <p>A decentralized protocol for creating powerful, verifiable, and rewarding social campaigns.</p>
  
  <p>
    <img src="https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white" alt="Bun" />
    <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Solidity-%23363636.svg?style=for-the-badge&logo=solidity&logoColor=white" alt="Solidity" />
    <img src="https://img.shields.io/badge/Hardhat-222222?style=for-the-badge&logo=hardhat&logoColor=white" alt="Hardhat" />
    <img src="https://img.shields.io/badge/Ethers.js-2C2C2C?style=for-the-badge&logo=ethers&logoColor=white" alt="Ethers.js" />
    <img src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/Task-2A91B8?style=for-the-badge&logo=task&logoColor=white" alt="Task" />
    <img src="https://img.shields.io/badge/1inch-1C1C1C?style=for-the-badge&logo=1inch&logoColor=white" alt="1inch" />
  </p>
</div>

---

## The Problem

Projects and communities need to incentivize user engagement, but traditional reward systems are centralized, inefficient, and lack transparency. How can you reward users for on-chain and off-chain actions in a way that is both verifiable and trustless?

## The Solution: PFP2E

PFP2E is a hybrid on-chain/off-chain protocol that allows anyone to create "Proof of PFP" campaigns. It links a user's visual identity (like a profile picture) to a flexible and programmable reward system, powered by a robust off-chain engine and settled on-chain.

**Key Features:**
- **Verifiable Actions:** Prove ownership of assets, social engagement, and more.
- **Programmable Rewards:** Distribute ERC-20 tokens via a secure, epoch-based Merkle distributor.
- **1inch Integration:** Allow users to claim rewards in any token they choose, instantly swapping via the 1inch Aggregation Protocol.
- **Decentralized & Trustless:** No central party controls the reward distribution.

## System Architecture

The system is composed of two primary layers: an **Off-Chain Loop** for data processing and an **On-Chain Layer** for settlement.

<div align="center">
  <img src="docs/components.jpg" alt="PFP2E System Architecture Diagram" />
</div>

---

### Monorepo Structure

This repository is a monorepo managed by **[Bun](https://bun.sh/)** and **[Task](https://taskfile.dev/)**.

| Module | Description |
| :--- | :--- |
| **[`/contracts`](./contracts)** | The on-chain settlement layer, built with Solidity and Hardhat. |
| **[`/loop`](./loop)** | The off-chain verification engine, structured as a set of services. |
| **[`/demo`](./demo)** | A Next.js frontend demonstrating the protocol in action. |
| **[`/docs`](./docs)** | System architecture diagrams and documentation. |

---

### Getting Started

**Prerequisites:**
-   [**Task**](https://taskfile.dev/installation/)
-   [**Bun**](https://bun.sh/)

**1. Bootstrap the Project**
This command installs all dependencies across the monorepo.

```bash
task bootstrap
```

**2. Run the Full System**
The off-chain system requires two services. Run each command in a separate terminal.

*   **Terminal 1: Start the Records API**
    ```bash
    task records:prod
    ```
*   **Terminal 2: Run the Rewards Oracle**
    (Ensure your `.env` file is configured in `/loop/rewards`)
    ```bash
    task rewards:prod
    ```

---

### License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
