# Environment package

`@repo/env` validates runtime configuration with Zod before it reaches database
or authentication code. Server-only consumers import `@repo/env`; browser code
imports the browser-safe `@repo/env/client` export.

`DATABASE_URL`, `BETTER_AUTH_URL`, and `BETTER_AUTH_SECRET` are required for
the server. Production also rejects the template secret value.
