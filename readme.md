<div align="center">

# PFP2E Protocol
### Verifiable Visual Identity · Programmable Rewards

</div>

---

### PFP2E is a hybrid on-chain/off-chain protocol for verifying visual identity and linking it to a trustless reward system. This repository contains the reference implementation built for the ETHGlobal hackathon.

![PFP2E Components Diagram](docs/components.jpg)

---

### Design Philosophy: Pragmatic Simplicity
This project was built in a constrained, hackathon environment. We prioritized a clean, working, end-to-end demo over feature-completeness. The architecture is intentionally simple, the contracts are minimal, and the code is written for clarity.

---

### Local Development
The project uses a containerized environment managed by **[Task](https://taskfile.dev/)** and **Docker**. This provides a consistent, reproducible workflow.

**Prerequisites:**
-   Docker
-   [Task](https://taskfile.dev/installation/) (`brew install go-task/tap/go-task`)

To run a module, navigate to its directory (e.g., `cd demo`) and use the `task` commands:

```bash
# Start the development server
task dev

# Run the test suite
task test
```

---

### Repository Guide
This repository is a monorepo organized by domain.

| Module | Description |
| :--- | :--- |
| **[`/contracts`](./contracts)** | The on-chain settlement layer (`Solidity`, `Hardhat`). |
| **[`/loop`](./loop)** | The off-chain verification engine (`Node.js`, `SQLite`). |
| **[`/demo`](./demo)** | Frontend proofs-of-concept (`Next.js`, `Task`). |
| **[`/docs`](./docs)** | System architecture diagrams. |

---

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![1inch](https://img.shields.io/badge/1inch-1F2A4D?style=for-the-badge&logo=1inch&logoColor=white)

</div>