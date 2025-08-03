<div align="center">
  <img src="docs/logo.png" alt="PFP2E Logo" width="128" />
  <h1>PFP2E Protocol</h1>
  <p>Verifiable Visual Identity · Programmable Rewards</p>
</div>

---

PFP2E is a hybrid on-chain/off-chain protocol for verifying visual identity and linking it to a trustless reward system. This repository contains the reference implementation.

![PFP2E Components Diagram](docs/components.jpg)

---

### Monorepo Structure

This repository is a monorepo managed by **[Bun](https://bun.sh/)** and **[Task](https://taskfile.dev/)**.

| Module | Description |
| :--- | :--- |
| **[`/contracts`](./contracts)** | The on-chain settlement layer (`Solidity`, `Hardhat`). |
| **[`/loop`](./loop)** | The off-chain verification engine, structured as a set of packages. |
| **[`/demo`](./demo)** | Frontend proofs-of-concept (`Next.js`). |
| **[`/docs`](./docs)** | System architecture diagrams and documentation. |

---

### Getting Started

**Prerequisites:**
-   [**Task**](https://taskfile.dev/installation/)
-   [**Bun**](https://bun.sh/)

**1. Bootstrap the Project**
This is the only command you need to run for a first-time setup. It will:
- Install all dependencies.
- Generate the type-safe SDK client.
- Run all tests to ensure everything is working.

```bash
task bootstrap
```

**2. Run the Backend Services**
The backend is composed of independent services that must be run in separate terminal sessions.

**Terminal 1: Start the Records API**
This service manages the database and exposes the core API.

```bash
# For development with hot-reloading
task records:dev

# For production
task records:prod
```

**Terminal 2: Start the Rewards Service**
This service consumes data from the `records` API to calculate rewards.

```bash
# For development
task rewards:dev

# For production
task rewards:prod
```

The `records` API server will now be running on `http://localhost:8787`.

---

### License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
