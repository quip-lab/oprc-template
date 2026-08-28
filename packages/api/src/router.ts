import { z } from "zod";

import { authorized, base } from "./auth.js";

export const health = base
    .output(z.object({ status: z.literal("ok") }))
    .handler(() => ({ status: "ok" }));

export const me = authorized
    .output(
        z.object({
            id: z.string(),
            email: z.email(),
            name: z.string(),
            emailVerified: z.boolean(),
            image: z.string().nullable().optional(),
        }),
    )
    .handler(({ context }) => context.user);

export const router = {
    health,
    auth: {
        me,
    },
};

export type Router = typeof router;
