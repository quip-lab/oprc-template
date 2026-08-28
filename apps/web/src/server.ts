import { auth } from "@repo/auth";
import handler, { createServerEntry } from "@tanstack/react-start/server-entry";

export default createServerEntry({
    fetch(request, options) {
        const pathname = new URL(request.url).pathname;

        if (pathname === "/api/auth" || pathname.startsWith("/api/auth/")) {
            return auth.handler(request);
        }

        return handler.fetch(request, options);
    },
});
