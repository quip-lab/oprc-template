# Mobile application

The `mobile` workspace is an Expo Router client for the shared Better Auth and
oRPC backend hosted by the web app. It supports iOS, Android, and Expo web.

## Run locally

From the repository root:

```sh
pnpm --filter mobile dev
pnpm --filter mobile ios
pnpm --filter mobile android
pnpm --filter mobile web
```

Start the web workspace separately before signing in or making RPC calls:

```sh
pnpm --filter web dev
```

For Expo Go or a physical development build, the device and development
machine must share a LAN. `src/lib/base-url.ts` gets Metro's LAN host at
runtime and targets port `3000`; no `EXPO_PUBLIC_AUTH_URL` is needed.

The localhost fallback works for simulators. A standalone build reads
`EXPO_PUBLIC_API_URL` from Expo config and uses that deployed origin instead.

## Structure

| Location | Responsibility |
| --- | --- |
| `src/app/` | Expo Router routes and root layout. |
| `src/app/_layout.tsx` | Gesture root, HeroUI Native, theme, splash screen, and TanStack Query providers. |
| `src/lib/auth-client.ts` | Better Auth Expo client backed by SecureStore. |
| `src/lib/orpc.ts` | Typed RPC client that forwards the stored auth cookie. |
| `src/lib/base-url.ts` | Development LAN address discovery. |
| `src/lib/query-client.ts` | Browser/mobile singleton `QueryClient`. |
| `src/components/` | Expo Router tab shell. Standard interface components come from HeroUI Native. |

## UI

Mobile screens use HeroUI Native components from `heroui-native`. The required
`GestureHandlerRootView` and `HeroUINativeProvider` are installed in
`src/app/_layout.tsx`. Styling is powered by Uniwind and Tailwind CSS 4:

- `src/global.css` imports Tailwind, Uniwind, and HeroUI Native styles.
- `metro.config.js` wraps Expo's Metro configuration with Uniwind and generates
  `src/uniwind-types.d.ts`.

After changing Tailwind configuration, restart Expo/Metro so Uniwind can
regenerate its type definitions.

Expo web uses its client-only output. The primary web application is the
TanStack Start workspace, so static rendering is intentionally not enabled for
this companion client.

## Authentication and data

The Better Auth Expo plugin persists the session cookie using
`expo-secure-store`. oRPC reads that cookie in `src/lib/orpc.ts` and sends it
in the request headers, so server procedures protected by `authorized` receive
the same session as the web app.

Authentication fields use React Hook Form with the shared Zod schemas from
`@repo/validators`; use the same combination for every new mobile form.

```tsx
const { data: session } = authClient.useSession();
const healthQuery = useQuery(orpc.health.queryOptions());
```

Add RPC procedures in `@repo/api`, not inside this workspace. The client types
update from the shared router automatically.

## Configuration

`app.config.ts` defines the `mobile` URL scheme, icons, splash screen,
`expo-router`, `expo-secure-store`, and the public API origin. The app has its
own `biome.json` so Expo assets stay outside code-quality checks.

## EAS builds and submission

`eas.json` provides the standard Expo profiles:

- `development` builds include the dev client and are internally distributed.
- `preview` builds are production-like internal builds.
- `production` builds target the app stores.

Before the first cloud build, run the EAS configure flow from this workspace.
It links the Expo project and asks for the permanent iOS bundle identifier and
Android package name; do not ship the template `mobile` identifiers.

```sh
pnpm --dir apps/mobile dlx eas-cli@22.6.0 build:configure
```

Set `EXPO_PUBLIC_API_URL` in EAS for each applicable environment. It is safe to
be public because it is embedded in the client; never place credentials in an
`EXPO_PUBLIC_` variable.

```sh
pnpm --dir apps/mobile dlx eas-cli@22.6.0 env:set \
    --name EXPO_PUBLIC_API_URL \
    --value https://api.example.com \
    --environment production \
    --visibility plaintext

pnpm --filter mobile eas:build:preview
pnpm --filter mobile eas:build:production
pnpm --filter mobile eas:submit
```

```sh
pnpm --filter mobile check-types
pnpm --filter mobile lint
```
