import { ORPCError } from "@orpc/client";

export function getApiErrorMessage(error: unknown) {
    if (error instanceof ORPCError) {
        if (error.code === "UNAUTHORIZED") {
            return "Your session has expired. Sign in again to continue.";
        }

        if (error.code === "NOT_FOUND") {
            return "The requested resource could not be found.";
        }

        return error.message || "The API could not complete this request.";
    }

    return "The API could not be reached. Check your connection and try again.";
}
