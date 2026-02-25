import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // ─── Ignored paths ──────────────────────────────────────────────────────────
  {
    ignores: [
      "dist/**",
      "build/**",
      "storybook-static/**",
      "coverage/**",
      "playwright-report/**",
      "node_modules/**",
    ],
  },

  // ─── Base JS recommended (all files) ────────────────────────────────────────
  js.configs.recommended,

  // ─── Application source — full type-checked linting ─────────────────────────
  // recommendedTypeChecked activates rules that require the TS language service
  // (no-floating-promises, no-unsafe-*, etc.). Scoped to src/ only because
  // e2e/ and config files are NOT included in tsconfig.json's "include".
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: tseslint.configs.recommendedTypeChecked,

    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },

    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    settings: {
      react: { version: "detect" },
    },

    rules: {
      // ── React ──────────────────────────────────────────────────────────────
      ...reactPlugin.configs.recommended.rules,
      // Not needed with React 17+ JSX transform
      "react/react-in-jsx-scope": "off",
      // Redundant when using TypeScript
      "react/prop-types": "off",
      // Prefer self-closing tags for components with no children
      "react/self-closing-comp": "warn",

      // ── React Hooks ────────────────────────────────────────────────────────
      ...reactHooks.configs.recommended.rules,

      // ── React Refresh (Vite HMR safety) ───────────────────────────────────
      // Warns when a file mixes component and non-component exports — which
      // prevents Vite from doing surgical hot-swap and forces a full reload.
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // ── TypeScript ─────────────────────────────────────────────────────────
      // Disable base rule — the TS-aware version handles it correctly
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Require explicit return types on exported functions
      "@typescript-eslint/explicit-function-return-type": [
        "warn",
        { allowExpressions: true, allowHigherOrderFunctions: true },
      ],
      // Enforce consistent type import style
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      // Fire-and-forget must be explicit (e.g. void refetch())
      "@typescript-eslint/no-floating-promises": "error",
      // No async functions passed where sync is expected
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
    },
  },

  // ─── Context files — mixed hook + component exports are intentional ──────────
  // CardsStateContext exports both the provider component and hook functions.
  // react-refresh/only-export-components is a Vite HMR hint that doesn't apply
  // to context modules — HMR works correctly here regardless.
  {
    files: ["src/**/context/**/*.{ts,tsx}"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },

  // ─── Test + story files — relax pedantic rules ───────────────────────────────
  // explicit-function-return-type is too noisy for test helpers, mocks, and
  // Storybook render functions where the return type is always obvious from
  // context. Type-unsafe rules are also relaxed since mocks are intentionally
  // untyped at times.
  {
    files: [
      "src/**/*.test.{ts,tsx}",
      "src/**/*.stories.{ts,tsx}",
      "src/test/**/*.{ts,tsx}",
    ],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
    },
  },

  // ─── E2E specs — non-type-checked (not in tsconfig "include") ───────────────
  // Playwright specs live in e2e/ which is excluded from tsconfig.json.
  // We apply the base recommended rules without type information.
  {
    files: ["e2e/**/*.ts"],
    extends: tseslint.configs.recommended,
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  // ─── Vite / tooling config files ────────────────────────────────────────────
  {
    files: ["*.config.{js,ts,mjs,cjs}", ".storybook/**/*.{ts,tsx}"],
    extends: tseslint.configs.recommended,
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-misused-promises": "off",
    },
  },
]);