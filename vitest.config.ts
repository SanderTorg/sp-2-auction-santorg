import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    include: ["js/**/*.test.js"],
    exclude: ["e2e/**", "node_modules/**", "dist/**"],
  },
});
