import { expo } from "@better-auth/expo";
import { createDatabase } from "@repo/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to initialize Better Auth.");
}

export const { db } = createDatabase(databaseUrl);

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
    secret: process.env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: [
        "mobile://",
        ...(process.env.NODE_ENV === "development" ? ["exp://**"] : []),
    ],
    plugins: [expo(), tanstackStartCookies()],
});
