import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import type { router } from "@repo/api";

const link = new RPCLink({
    url: "/api/rpc",
    fetch: (request, init) =>
        globalThis.fetch(request, {
            ...init,
            credentials: "include",
        }),
});

export const orpc: RouterClient<typeof router> = createORPCClient(link);
