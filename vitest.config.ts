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
          // Test infrastructure
          "src/test/**",
          "src/**/*.test.{ts,tsx}",
          "src/**/*.spec.{ts,tsx}",
          "src/**/*.stories.tsx",

          // App entry point (just ReactDOM.render)
          "src/main.tsx",

          // Config files (not application code)
          "*.config.{ts,js}",
          "playwright.config.ts",
          ".storybook/**",

          // Build / report artifacts
          "playwright-report/**",
          "dist/**",
          "coverage/**",

          // E2E tests (tested by Playwright, not Vitest)
          "e2e/**",

          // Dev-only diagnostic utility (not production code)
          "src/shared/utils/useWhyDidYouRender.ts",

          // Composition root — wires providers together, no branching logic.
          // Tested implicitly by Playwright E2E (full app boots).
          // Unit-testing would duplicate renderWithProviders.
          "src/app/App.tsx",

          // Store singleton — only imported by App.tsx (composition root).
          // Just a configureStore() call, zero branching. Each test creates
          // its own isolated store via createTestStore() in renderWithProviders.
          "src/app/store/index.ts",

          // CSS reset — visual-only, no logic to assert on.
          // Verified by Storybook + Playwright screenshots.
          "src/app/GlobalStyles.ts",

          // Barrel re-exports — zero runtime logic, just `export { X } from`.
          // Coverage would only confirm the re-export is reachable.
          "src/features/cards/index.ts",

          // Type-only files (no runtime code to cover)
          "src/**/*.types.ts",
          "src/**/*.d.ts",
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
