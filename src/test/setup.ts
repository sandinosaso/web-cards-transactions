/// <reference types="vitest/globals" />
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Suppress noisy console errors in tests unless explicitly testing for them
const originalConsoleError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});
afterEach(() => {
  console.error = originalConsoleError;
});
