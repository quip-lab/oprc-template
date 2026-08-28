# @repo/auth

This package owns the Better Auth server configuration. It creates the
Drizzle-backed authentication service and re-exports the associated database
instance for the web server's oRPC context.

## Public exports

```ts
import { auth, db } from "@repo/auth";
```

- `auth` is the Better Auth instance; the web server passes requests to
  `auth.handler` at `/api/auth/*`.
- `db` is the Drizzle database instance created from `DATABASE_URL`.

Importing this package initializes the database connection configuration and
therefore requires `DATABASE_URL`. Keep it on the server side; applications use
Better Auth client packages instead.

## Configuration

`src/auth.ts` enables email/password authentication and configures:

- The Drizzle PostgreSQL adapter from `@repo/db`.
- The Expo plugin, which supports native client cookie storage.
- TanStack Start cookie support for the web app.
- `mobile://` and Expo development origins as trusted mobile origins.

Required root environment variables are `DATABASE_URL`, `BETTER_AUTH_SECRET`,
and `BETTER_AUTH_URL`. See the root [environment reference](../../README.md#environment-variables).

## Schema generation

Better Auth's CLI generates its tables at
`../db/src/schema/auth.ts`. Treat that generated file as owned by Better Auth.

```sh
pnpm --filter @repo/auth auth:generate
pnpm db:generate
pnpm db:migrate
```

Run the generator after changing Better Auth options that affect its schema.

## Commands

```sh
pnpm --filter @repo/auth check-types
pnpm --filter @repo/auth lint
```
