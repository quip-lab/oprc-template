import type { WithEffectContext } from "@orpc/experimental-effect";
import type { Database } from "@repo/db";
import { Context } from "effect";

export interface APIContext extends WithEffectContext<never> {
    db: Database;
    headers: Headers;
}

export function createAPIContext(db: Database, headers: Headers): APIContext {
    return {
        db,
        headers,
        "effect/context": Context.empty(),
    };
}
