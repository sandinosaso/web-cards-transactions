import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

// mergeConfig inherits plugins (react()) and resolve.alias from vite.config.ts.
// This avoids re-importing @vitejs/plugin-react here, which would cause a
// TypeScript type conflict: Vitest 2.x bundles Vite 5 internally while the
// top-level vite is 6.x — two incompatible Plugin<any> types from different
// vite versions. mergeConfig sidesteps this entirely.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
      exclude: ["e2e/**", "node_modules/**"],
      coverage: {
        provider: "v8",
        reporter: ["text", "html", "lcov"],
        exclude: [
          "src/test/**",
          "src/**/*.stories.tsx",
          "src/main.tsx",
          "playwright.config.ts",
          ".storybook/**",
        ],
        thresholds: {
          lines: 80,
          functions: 80,
          branches: 80,
          statements: 80,
        },
      },
    },
  })
);
