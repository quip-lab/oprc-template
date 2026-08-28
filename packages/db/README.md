# @repo/db

The database package provides Drizzle ORM with the `pg` driver for a
PostgreSQL-compatible database. It holds application schema, Better Auth's
generated schema, and Drizzle migration files.

## Public exports

```ts
import { createDatabase } from "@repo/db";
import type { Database } from "@repo/db";
```

`createDatabase(connectionString)` creates a `pg` pool and a Drizzle client
configured with every exported schema table. It also returns `close()` for
short-lived scripts and tests.

## Schema ownership

| Location | Ownership |
| --- | --- |
| `src/schema/users.ts` | Application tables; edit this and add your own schema files here. |
| `src/schema/auth.ts` | Better Auth generated tables; regenerate, do not hand-edit. |
| `src/schema/index.ts` | Schema barrel; export every schema module. |
| `drizzle/` | Generated SQL migrations and metadata. |

`drizzle.config.ts` reads `DATABASE_URL` and points Drizzle Kit at the schema
barrel. The package scripts load the root `.env`, so run database commands
through pnpm rather than calling `drizzle-kit` from an arbitrary directory.

## Migration workflow

```sh
# At the repository root
pnpm db:generate
pnpm db:migrate

# Development-only: directly synchronize a local disposable database
pnpm --filter @repo/db db:push
```

Always review generated SQL before applying it to a shared or production
database. Drizzle metadata is generated output and intentionally excluded from
Biome formatting checks.

## Commands

```sh
pnpm --filter @repo/db check-types
pnpm --filter @repo/db lint
```
