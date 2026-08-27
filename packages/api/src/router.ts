import { os } from "@orpc/server";
import { users } from "@repo/db";
import { z } from "zod";

import type { APIContext } from "./context.js";

const procedure = os.$context<APIContext>();

const userSchema = z.object({
    id: z.uuid(),
    email: z.email(),
    name: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const health = procedure
    .output(z.object({ status: z.literal("ok") }))
    .handler(() => ({ status: "ok" }));

export const listUsers = procedure
    .input(z.object({ limit: z.number().int().min(1).max(100).default(20) }))
    .output(z.array(userSchema))
    .handler(({ context, input }) =>
        context.db.select().from(users).limit(input.limit),
    );

export const router = {
    health,
    users: {
        list: listUsers,
    },
};

export type Router = typeof router;
