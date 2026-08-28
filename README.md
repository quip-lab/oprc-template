<p align="center">
  <img src="assets/quip.png" alt="Quip" width="160" />
</p>

# oRPC full-stack template

A pnpm + Turborepo workspace for a TanStack Start web app and an Expo mobile
app. The web UI uses HeroUI and the native app uses HeroUI Native. Both clients
share a type-safe oRPC API, Better Auth session model, Drizzle schema, and
PostgreSQL database.

Built by Quip.

## Workspace layout

```text
apps/
  web/                 TanStack Start web application and HTTP entry point
  mobile/              Expo application
packages/
  api/                 oRPC router, auth middleware, and Effect procedures
  auth/                Better Auth server configuration
  db/                  Drizzle client, schema, and migrations
  env/                 Runtime environment validation
  validators/           Shared client-safe Zod validation schemas
  biome-config/        Shared Biome configuration
  typescript-config/   Shared TypeScript base configurations
```

See [apps/README.md](apps/README.md) and [packages/README.md](packages/README.md)
for the boundaries and package-specific guides.

## Prerequisites

- Node.js 24 or newer
- pnpm 11.23.0 (the pinned package manager)
- A PostgreSQL-compatible database

## Quick start

1. Install dependencies.

   ```sh
   pnpm install
   ```

2. Create a root `.env` from the example and set a real database URL and
   Better Auth secret.

   ```sh
   cp .env.example .env
   ```

3. Apply the committed database migrations.

   ```sh
   pnpm db:migrate
   ```

4. Start the web server and Expo app in separate terminals.

   ```sh
   pnpm --filter web dev
   pnpm --filter mobile dev
   ```

   The web server listens on port `3000` and binds to the LAN. Expo Go or a
   development build must be on the same network to reach it.

## Environment variables

All runtime configuration lives in the root `.env`; package scripts load it
through `dotenv-cli` when run from their package directory.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Drizzle and Better Auth. |
| `BETTER_AUTH_SECRET` | Yes | High-entropy secret used to sign auth data; the placeholder is rejected in production. |
| `BETTER_AUTH_URL` | Yes | Public origin handled by Better Auth, such as `http://localhost:3000`. |
| `VITE_AUTH_URL` | Web client | Browser-facing Better Auth origin; keep it aligned with `BETTER_AUTH_URL` locally. |

The mobile app intentionally does not use an `EXPO_PUBLIC_AUTH_URL`. During
development it derives the LAN host from Metro and connects to port `3000`.
For a standalone production mobile build, replace that development fallback
with the deployed API origin.

## How requests flow

```text
Web browser / Expo app
        │
        ├── /api/auth  → Better Auth → Drizzle → PostgreSQL
        │
        └── /api/rpc   → oRPC handler → @repo/api → Effect procedures
                                           │
                                           └── authenticated context + Drizzle
```

The web server mounts both endpoints in `apps/web/src/server.ts`. Clients use
`@orpc/tanstack-query` to expose typed TanStack Query options from the shared
router. The Expo client sends Better Auth's stored cookie with each RPC call.

## Commands

Run these from the repository root.

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Run all development tasks through Turbo with the root `.env`. |
| `pnpm build` | Build all workspace packages and apps. |
| `pnpm check` | Run Biome formatting, lint, and assist checks. |
| `pnpm check:fix` | Apply Biome formatting and safe fixes. |
| `pnpm check-types` | Typecheck all TypeScript projects. |
| `pnpm test` | Run unit tests and database integration tests when `DATABASE_URL` is set. |
| `pnpm test:watch` | Run tests in watch mode. |
| `pnpm format` | Format supported files with Biome. |
| `pnpm lint` | Run package lint tasks through Turbo. |
| `pnpm db:generate` | Generate Drizzle SQL migrations from the schema. |
| `pnpm db:migrate` | Apply generated Drizzle migrations. |

Use `pnpm --filter <package> <script>` to target one workspace, for example
`pnpm --filter web dev` or `pnpm --filter @repo/auth auth:generate`.

## Quality gates and automation

Husky runs before each commit. It checks staged files with Biome and runs the
workspace typecheck. When Biome can safely fix a staged file, the hook leaves
the fix unstaged and blocks the commit so you can review and stage it.

GitHub Actions runs the same Husky script in CI mode on a Blacksmith runner,
then builds the workspace. The stable `required` job is intended for branch
protection.

Dependabot checks daily for npm/pnpm workspace updates—including pnpm
catalogs—and GitHub Action updates. Enable Dependabot alerts and security
updates in the GitHub repository settings to receive vulnerability PRs too.

## Database workflow

Application tables belong in `packages/db/src/schema`. Better Auth tables are
generated into `packages/db/src/schema/auth.ts`; do not hand-edit that file.

```sh
# Regenerate Better Auth's Drizzle schema after changing Better Auth options.
pnpm --filter @repo/auth auth:generate

# Generate SQL after schema changes, review it, then apply it.
pnpm db:generate
pnpm db:migrate
```

`pnpm --filter @repo/db db:push` is available for development-only schema
prototyping. Prefer generated migrations for shared and production databases.

## Documentation

- [Web app](apps/web/README.md)
- [Mobile app](apps/mobile/README.md)
- [API package](packages/api/README.md)
- [Auth package](packages/auth/README.md)
- [Database package](packages/db/README.md)
- [Environment package](packages/env/README.md)
- [Validation package](packages/validators/README.md)
- [Biome configuration](packages/biome-config/README.md)
- [TypeScript configuration](packages/typescript-config/README.md)
