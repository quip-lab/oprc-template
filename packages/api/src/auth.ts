import "@orpc/experimental-effect/extensions/effect";
import { ORPCError, os } from "@orpc/server";
import { auth } from "@repo/auth";

import type { APIContext } from "./context.js";

export const base = os.$context<APIContext>();

const authMiddleware = base.middleware(async ({ context, next }) => {
    const sessionData = await auth.api.getSession({
        headers: context.headers,
    });

    if (!sessionData?.session || !sessionData.user) {
        throw new ORPCError("UNAUTHORIZED");
    }

    return next({
        context: {
            session: sessionData.session,
            user: sessionData.user,
        },
    });
});

export const authorized = base.use(authMiddleware);
