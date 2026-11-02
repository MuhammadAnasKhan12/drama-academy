import { defineConfig } from "drizzle-kit";

// Generates SQL migrations from src/db/schema.ts into ./migrations,
// which Wrangler applies to D1 (`npm run api:db:migrate:local` / `:remote`).
export default defineConfig({
  dialect: "sqlite",
  schema: "./api/src/db/schema.ts",
  out: "./api/migrations",
});
