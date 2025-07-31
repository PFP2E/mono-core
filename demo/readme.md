# /demo

> Frontend applications and proofs-of-concept, built with Next.js.

### Development Workflow
This project uses a containerized environment managed by **[Task](https://taskfile.dev/)** and **Docker Compose**. `Taskfile.yml` is the single entry point for all commands, providing a consistent and simple developer experience.

```bash
# Start the development server with hot-reloading
task dev

# Build and start the production server
task prod

# Run the full test suite (unit & UI)
task test

# Stop all running services
task stop
```

### Proofs-of-Concept
-   **`/vision`**: Demonstrates the core PFP matching engine.
-   **`/siweth`**: Demonstrates "Sign-In with Ethereum" integration.
-   **`/oauth2`**: Demonstrates a standard social OAuth2 flow.

[↰ Back to root](../readme.md)
