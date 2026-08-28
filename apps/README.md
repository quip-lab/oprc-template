# Applications

This directory contains the deployable clients. They consume the shared API
router from `@repo/api`; neither app defines a separate backend contract.

| App | Runtime | Purpose |
| --- | --- | --- |
| [web](web/README.md) | TanStack Start + Vite | Hosts the web UI, Better Auth endpoint, and oRPC HTTP endpoint. |
| [mobile](mobile/README.md) | Expo Router | Native/mobile client for the same Better Auth and oRPC backend. |

Run an app from the workspace root with `pnpm --filter <name> dev`.
