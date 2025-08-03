<div align="center">
  <img src="docs/logo.png" alt="PFP2E Logo" width="128" />
  <h1>PFP2E Protocol</h1>
  <p>Verifiable Visual Identity · Programmable Rewards</p>
  
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

PFP2E is a hybrid on-chain/off-chain protocol for verifying visual identity and linking it to a trustless reward system. This repository contains the reference implementation of the system, structured as a professional monorepo.

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
| **[`/demo`](./demo)** | Frontend proofs-of-concept, built with Next.js. |
| **[`/docs`](./docs)** | System architecture diagrams and documentation. |

---

### Getting Started

**Prerequisites:**
-   [**Task**](https://taskfile.dev/installation/)
-   [**Bun**](https://bun.sh/)

**1. Bootstrap the Project**
This is the only command you need to run for a first-time setup. It will install all dependencies across the monorepo.

```bash
task bootstrap
```

**2. Run the Services**
The off-chain system requires two services running in separate terminals:

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
