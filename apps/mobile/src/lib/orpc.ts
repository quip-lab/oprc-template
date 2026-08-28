import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import type { router } from "@repo/api";

import { authClient, authUrl } from "./auth-client";

const link = new RPCLink({
    origin: authUrl,
    url: "/api/rpc",
    headers: async () => ({
        cookie: await authClient.getCookie(),
    }),
});

const client: RouterClient<typeof router> = createORPCClient(link);

export const orpc = createTanstackQueryUtils(client);
