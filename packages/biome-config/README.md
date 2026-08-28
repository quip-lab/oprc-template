# @repo/biome-config

The shared Biome configuration used by the root workspace and both apps.
Consumers extend `biome.json` directly:

```json
{
    "extends": ["../../packages/biome-config/biome.json"]
}
```

## Defaults

- Four-space indentation.
- Double quotes and semicolons for JavaScript and TypeScript.
- Biome's recommended lint rules.
- Import organization through Biome assist actions.

The root `biome.json` owns repository-wide VCS integration and ignores generated
or non-source paths, including Drizzle migration metadata. App-level configs
extend this package and additionally ignore their generated assets and router
files.

Run quality commands from the repository root:

```sh
pnpm check
pnpm check:fix
pnpm format
```

No build or typecheck task is needed for this configuration-only package.
