/**
 * Minimal ImportMeta.env ambient declaration for the production build.
 *
 * tsconfig.build.json does NOT load "vite/client" because doing so creates an
 * unsuppressable type conflict between node_modules/vite and the separate copy
 * of Vite bundled inside vitest (vitest/node_modules/vite) — both augment
 * ImportMeta and their HMR types are structurally incompatible.
 *
 * tsconfig.json (IDE + yarn typecheck) still loads the full "vite/client"
 * for import.meta.hot, import.meta.glob, etc.
 *
 * This file is included by both tsconfigs via "include": ["src"] and
 * satisfies the only import.meta.env usage in the codebase (ApiClient/index.ts).
 */
interface ImportMetaEnv {
  readonly MODE: string;
  readonly [key: string]: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
