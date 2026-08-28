import type { Database } from "@repo/db";

export interface APIContext {
    db: Database;
    headers: Headers;
}
