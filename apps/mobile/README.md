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

The localhost fallback works for simulators. A standalone production build
needs a deployed API origin configured in `getBaseUrl`.

## Structure

| Location | Responsibility |
| --- | --- |
| `src/app/` | Expo Router routes and root layout. |
| `src/app/_layout.tsx` | Gesture root, HeroUI Native, theme, splash screen, and TanStack Query providers. |
| `src/lib/auth-client.ts` | Better Auth Expo client backed by SecureStore. |
| `src/lib/orpc.ts` | Typed RPC client that forwards the stored auth cookie. |
| `src/lib/base-url.ts` | Development LAN address discovery. |
| `src/lib/query-client.ts` | Browser/mobile singleton `QueryClient`. |
| `src/components/` | Reusable UI components. |

## UI

Mobile screens use HeroUI Native components from `heroui-native`. The required
`GestureHandlerRootView` and `HeroUINativeProvider` are installed in
`src/app/_layout.tsx`. Styling is powered by Uniwind and Tailwind CSS 4:

- `src/global.css` imports Tailwind, Uniwind, and HeroUI Native styles.
- `metro.config.js` wraps Expo's Metro configuration with Uniwind and generates
  `src/uniwind-types.d.ts`.

After changing Tailwind configuration, restart Expo/Metro so Uniwind can
regenerate its type definitions.

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
`expo-router`, and `expo-secure-store`. The app has its own `biome.json` so
Expo assets stay outside code-quality checks.

```sh
pnpm --filter mobile check-types
pnpm --filter mobile lint
```
