/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    exclude: ["coverage/**", "node_modules/**", "test/e2e/**", ".next/**"],
    include: ["**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "lcov"],
      exclude: ["node_modules/", ".next/", "test/", "**/*.d.ts", "**/*.config.*"],
      thresholds: {
        statements: 65,
        branches: 35,
        functions: 60,
        lines: 65,
      },
    },
  },
});
