import { Effect } from "effect";
import { z } from "zod";

import { authorized, base } from "./auth.js";

export const health = base
    .output(z.object({ status: z.literal("ok") }))
    .effect(function* () {
        return yield* Effect.succeed({ status: "ok" as const });
    });

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
    .effect(function* ({ context }) {
        return yield* Effect.succeed(context.user);
    });

export const router = {
    health,
    auth: {
        me,
    },
};

export type Router = typeof router;
