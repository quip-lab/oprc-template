# @repo/api

The API package defines the complete oRPC server contract shared by the web
and mobile clients. Procedures use the official oRPC Effect integration and
Zod output schemas.

## Public exports

```ts
import { createAPIContext, router } from "@repo/api";
import type { APIContext, Router } from "@repo/api";
```

- `router` is mounted by the TanStack Start server at `/api/rpc`.
- `createAPIContext(db, headers)` creates request context with the Drizzle
  database, HTTP headers, and Effect context.
- `Router` is the source type used by both oRPC clients.

## Procedure model

`src/auth.ts` defines two reusable builders:

- `base` is available to all procedures and requires an `APIContext`.
- `authorized` adds a Better Auth session and user to the context, returning
  `UNAUTHORIZED` when no valid session exists.

`src/router.ts` currently exposes `health` and authenticated `auth.me`.
Procedures use `.effect(...)`, keeping Effect-native code and errors available
to the router.

```ts
export const example = authorized
    .output(z.object({ value: z.string() }))
    .effect(function* ({ context }) {
        return yield* Effect.succeed({ value: context.user.email });
    });
```

Add a procedure to the exported `router` object. Client helpers in both apps
will then infer its input/output types through `RouterClient<typeof router>`.

## Authentication boundary

The auth middleware calls `auth.api.getSession` with the request headers. The
web client sends browser credentials; the Expo client forwards its SecureStore
cookie. Do not trust a user ID from client input when `context.user` is
available.

## Commands

```sh
pnpm --filter @repo/api check-types
pnpm --filter @repo/api lint
```

The package has no standalone server. Run `pnpm --filter web dev` to exercise
the mounted API.
