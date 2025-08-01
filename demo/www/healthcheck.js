// /www/healthcheck.js
// This script checks if the Next.js server is running.
// It's used by the HEALTHCHECK instruction in the Containerfile.
const response = await fetch('http://localhost:3000')
if (response.status !== 200) {
  process.exit(1)
}
process.exit(0)
