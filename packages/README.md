# Shared packages

These workspaces hold the server contract and shared configuration used by the
applications. They use the `@repo/*` package namespace and are consumed through
their declared package exports.

| Package | Purpose |
| --- | --- |
| [@repo/api](api/README.md) | oRPC router, auth middleware, Effect integration, and API context. |
| [@repo/auth](auth/README.md) | Better Auth server instance and Drizzle-backed database instance. |
| [@repo/db](db/README.md) | PostgreSQL client, Drizzle schema, and migrations. |
| [@repo/validators](validators/README.md) | Client-safe Zod schemas shared by application forms. |
| [@repo/biome-config](biome-config/README.md) | Shared formatter, linter, and assist rules. |
| [@repo/typescript-config](typescript-config/README.md) | Shared TypeScript compiler bases. |

Use workspace imports such as `@repo/api` and `@repo/db`; avoid reaching into
another package's `src` directory.
