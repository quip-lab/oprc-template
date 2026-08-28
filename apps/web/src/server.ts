import { RPCHandler } from "@orpc/server/fetch";
import { createAPIContext, router } from "@repo/api";
import { auth, db } from "@repo/auth";
import handler, { createServerEntry } from "@tanstack/react-start/server-entry";

const rpcHandler = new RPCHandler(router);

export default createServerEntry({
    async fetch(request, options) {
        const pathname = new URL(request.url).pathname;

        if (pathname === "/api/auth" || pathname.startsWith("/api/auth/")) {
            return auth.handler(request);
        }

        if (pathname === "/api/rpc" || pathname.startsWith("/api/rpc/")) {
            const { response } = await rpcHandler.handle(request, {
                prefix: "/api/rpc",
                context: createAPIContext(db, request.headers),
            });

            return response ?? new Response("Not found", { status: 404 });
        }

        return handler.fetch(request, options);
    },
});
