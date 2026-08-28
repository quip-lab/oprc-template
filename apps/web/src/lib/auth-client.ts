import { getClientEnvironment } from "@repo/env/client";
import { createAuthClient } from "better-auth/react";

const environment = getClientEnvironment({
    VITE_AUTH_URL: import.meta.env.VITE_AUTH_URL,
});

export const authClient = createAuthClient({
    baseURL: environment.VITE_AUTH_URL ?? "http://localhost:3000",
});
