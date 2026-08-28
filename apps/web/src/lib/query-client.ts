import { environmentManager, QueryClient } from "@tanstack/react-query";

function makeQueryClient() {
    return new QueryClient();
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
    if (environmentManager.isServer()) {
        return makeQueryClient();
    }

    browserQueryClient ??= makeQueryClient();
    return browserQueryClient;
}
