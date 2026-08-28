import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import type { router } from "@repo/api";

import { authClient, authUrl } from "./auth-client";

const link = new RPCLink({
    url: new URL("/api/rpc", authUrl),
    headers: async () => ({
        cookie: await authClient.getCookie(),
    }),
});

export const orpc: RouterClient<typeof router> = createORPCClient(link);
