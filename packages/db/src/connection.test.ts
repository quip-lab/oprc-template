import { sql } from "drizzle-orm";
import { describe, expect, it } from "vitest";

import { createDatabase } from "./client.js";

const databaseUrl = process.env.DATABASE_URL;
const databaseTest = databaseUrl ? it : it.skip;

describe("database connection", () => {
    databaseTest("connects using DATABASE_URL", async () => {
        if (!databaseUrl) {
            throw new Error("DATABASE_URL is required for database tests.");
        }

        const { close, db } = createDatabase(databaseUrl);

        try {
            const result = await db.execute<{ connected: number }>(
                sql`select 1 as connected`,
            );

            expect(result.rows[0]?.connected).toBe(1);
        } finally {
            await close();
        }
    });
});
