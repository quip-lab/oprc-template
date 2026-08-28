# @repo/typescript-config

Shared TypeScript configurations for workspace packages. Use these as a base
instead of copying strict compiler settings into every package.

## Available configurations

| File | Use case |
| --- | --- |
| `base.json` | Node-oriented TypeScript packages. Enables strict mode, NodeNext modules, declaration output, isolated modules, and unchecked-index safety. |
| `react-library.json` | Extends `base.json` and enables the React JSX transform. |
| `nextjs.json` | Extends `base.json` with Next.js bundler resolution and its TypeScript plugin. |

For example:

```json
{
    "extends": "@repo/typescript-config/base.json",
    "compilerOptions": {
        "noEmit": true
    }
}
```

`@repo/api`, `@repo/auth`, and `@repo/db` use `base.json`. The TanStack Start
and Expo apps retain framework-specific TypeScript configurations.

The root pnpm catalog owns the standard TypeScript version, while Expo uses its
separate catalog to stay on the framework-supported TypeScript 6 release.
