import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema/index.js";

export function createDatabase(connectionString: string) {
    const pool = new Pool({ connectionString });
    const db = drizzle({ client: pool, schema });

    return {
        db,
        close: () => pool.end(),
    };
}

export type Database = ReturnType<typeof createDatabase>["db"];
