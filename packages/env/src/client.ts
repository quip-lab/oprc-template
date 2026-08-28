import { z } from "zod";

const clientEnvironmentSchema = z.object({
    VITE_AUTH_URL: z.url("VITE_AUTH_URL must be a valid URL.").optional(),
});

export function getClientEnvironment(environment: { VITE_AUTH_URL?: string }) {
    return clientEnvironmentSchema.parse(environment);
}
