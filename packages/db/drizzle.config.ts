import { getDatabaseEnvironment } from "@repo/env";
import { defineConfig } from "drizzle-kit";

const { DATABASE_URL: databaseUrl } = getDatabaseEnvironment();

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/schema/index.ts",
    out: "./drizzle",
    dbCredentials: {
        url: databaseUrl,
    },
});
