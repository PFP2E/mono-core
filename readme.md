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

**1. Install Dependencies**
This command installs all dependencies for all workspaces (`sdk`, `records`, `rewards`, `demo`).

```bash
task project:install
```

**2. Build Local Packages**
This command builds the local packages (like the SDK) that are dependencies for other services.

```bash
task project:build
```

**3. Setup the Database**
This is a one-time command to initialize the database schema and populate it with seed data.

```bash
task records:setup
```

**4. Run the Backend**
This command starts the backend API services.

```bash
task loop:start
```

The `records` API server will now be running and accessible.

---

### License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
