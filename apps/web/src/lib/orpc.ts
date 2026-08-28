import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import type { router } from "@repo/api";

const link = new RPCLink({
    url: "/api/rpc",
    fetch: (url, init) =>
        globalThis.fetch(url, {
            ...init,
            credentials: "include",
        }),
});

const client: RouterClient<typeof router> = createORPCClient(link);

export const orpc = createTanstackQueryUtils(client);
