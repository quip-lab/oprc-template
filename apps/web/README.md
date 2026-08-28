# Web application

The `web` workspace is a TanStack Start application built by Vite. It is the
HTTP host for both shared backend entry points:

- `GET/POST /api/auth/*` is handled by Better Auth.
- `POST /api/rpc/*` is handled by oRPC and the router in `@repo/api`.

## Run locally

From the repository root:

```sh
pnpm --filter web dev
```

The script loads the root `.env`, listens on port `3000`, and uses `--host
0.0.0.0` so an Expo device on the same network can reach the server.

```sh
pnpm --filter web build
pnpm --filter web preview
pnpm --filter web check-types
```

## Structure

| Location | Responsibility |
| --- | --- |
| `src/routes/` | TanStack Router file-based routes. |
| `src/routes/__root.tsx` | Root document and `QueryClientProvider`. |
| `src/server.ts` | Routes Better Auth and oRPC requests before TanStack Start's normal handler. |
| `src/lib/auth-client.ts` | Browser Better Auth client using `VITE_AUTH_URL`. |
| `src/lib/orpc.ts` | Typed oRPC client with cookie credentials. |
| `src/lib/query-client.ts` | Per-request server query client and browser singleton. |
| `src/routeTree.gen.ts` | Generated router file; do not edit. |

## UI

The web UI uses `@heroui/react` with `@heroui/styles`. The stylesheet import is
in `src/styles.css`, immediately after Tailwind's import. HeroUI v3 does not
need a provider: compose its accessible controls directly using parts such as
`Card.Header`, `TextField`, `Input`, and `Button`.

## Data and auth

Use the exported `orpc` helper rather than constructing endpoint-specific
fetch calls. It derives types and TanStack Query options from the shared
server router.

```tsx
const healthQuery = useQuery(orpc.health.queryOptions());

const meQuery = useQuery({
    ...orpc.auth.me.queryOptions(),
    enabled: Boolean(session),
});
```

`authClient` handles sign-in, sign-up, sign-out, and session state. Its
requests include browser cookies; `src/lib/orpc.ts` also explicitly uses
`credentials: "include"` so authenticated RPC calls receive the session.

## Environment

`VITE_AUTH_URL` defaults to `http://localhost:3000`. Set it to the public web
origin in production and keep `BETTER_AUTH_URL` aligned on the server.

## Adding API behavior

Do not place shared business procedures in the web app. Add them to
`packages/api/src/router.ts`, export them from the router, then use their
generated query or mutation options here. See [the API package guide](../../packages/api/README.md).
