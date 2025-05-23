import { envs } from "@commons/config";
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/modules/drizzle/schema.ts",
  dbCredentials: {
    url: envs.DATABASE_URL ?? ""
  }
});
