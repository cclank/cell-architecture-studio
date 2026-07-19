import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // jsdom gives the pure-logic modules a localStorage to persist into.
    environment: "jsdom",
    include: ["src/**/*.test.ts"],
    clearMocks: true,
  },
});
