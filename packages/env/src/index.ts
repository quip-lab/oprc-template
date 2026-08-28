import { z } from "zod";

const databaseUrlSchema = z
    .url("DATABASE_URL must be a valid PostgreSQL connection URL.")
    .refine(
        (url) => {
            const protocol = new URL(url).protocol;

            return protocol === "postgres:" || protocol === "postgresql:";
        },
        { message: "DATABASE_URL must use postgres:// or postgresql://." },
    );

const databaseEnvironmentSchema = z.object({
    DATABASE_URL: databaseUrlSchema,
});

const authEnvironmentSchema = databaseEnvironmentSchema.extend({
    BETTER_AUTH_SECRET: z
        .string()
        .min(32, "BETTER_AUTH_SECRET must contain at least 32 characters."),
    BETTER_AUTH_URL: z.url("BETTER_AUTH_URL must be a valid URL."),
});

export function getDatabaseEnvironment(environment = process.env) {
    return databaseEnvironmentSchema.parse(environment);
}

export function getAuthEnvironment(environment = process.env) {
    const parsed = authEnvironmentSchema.parse(environment);

    if (
        environment.NODE_ENV === "production" &&
        parsed.BETTER_AUTH_SECRET.includes("replace-with")
    ) {
        throw new Error(
            "BETTER_AUTH_SECRET must be replaced before deploying to production.",
        );
    }

    return parsed;
}
