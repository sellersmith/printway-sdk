import { defineConfig } from "vitest/config";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  test: {
    globals: true,
    exclude: ["**/node_modules/**", "**/.claude/**"],
    // Integration tests: sequential execution, global token refresh setup
    globalSetup: process.argv.some(a => a.includes("integration"))
      ? ["tests/integration/global-setup.ts"]
      : [],
    fileParallelism: false,
  },
});
