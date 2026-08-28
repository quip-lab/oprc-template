import { expo } from "@better-auth/expo";
import { createDatabase } from "@repo/db";
import { getAuthEnvironment } from "@repo/env";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";

const environment = getAuthEnvironment();

export const { db } = createDatabase(environment.DATABASE_URL);

export const auth = betterAuth({
    baseURL: environment.BETTER_AUTH_URL,
    secret: environment.BETTER_AUTH_SECRET,
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
