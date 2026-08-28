import { describe, expect, it } from "vitest";

import { getAuthEnvironment, getDatabaseEnvironment } from "./index.js";

const databaseUrl = "postgresql://postgres:postgres@localhost:5432/oprc";

describe("server environment", () => {
    it("accepts a valid PostgreSQL and Better Auth configuration", () => {
        expect(
            getAuthEnvironment({
                BETTER_AUTH_SECRET:
                    "a-strong-development-secret-with-32-characters",
                BETTER_AUTH_URL: "http://localhost:3000",
                DATABASE_URL: databaseUrl,
            }),
        ).toMatchObject({ DATABASE_URL: databaseUrl });
    });

    it("rejects non-PostgreSQL database URLs", () => {
        expect(() =>
            getDatabaseEnvironment({ DATABASE_URL: "mysql://localhost/oprc" }),
        ).toThrow("DATABASE_URL must use postgres:// or postgresql://.");
    });

    it("rejects the template auth secret in production", () => {
        expect(() =>
            getAuthEnvironment({
                BETTER_AUTH_SECRET:
                    "replace-with-a-strong-random-secret-that-is-at-least-32-characters",
                BETTER_AUTH_URL: "https://example.com",
                DATABASE_URL: databaseUrl,
                NODE_ENV: "production",
            }),
        ).toThrow("BETTER_AUTH_SECRET must be replaced");
    });
});
