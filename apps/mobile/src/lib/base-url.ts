import Constants from "expo-constants";

/**
 * Uses the configured production origin when present. Otherwise, Metro's LAN
 * host lets Expo Go and development builds reach the local web server.
 */
export function getBaseUrl() {
    const apiUrl = Constants.expoConfig?.extra?.apiUrl;

    if (typeof apiUrl === "string" && apiUrl.length > 0) {
        return apiUrl;
    }

    const debuggerHost = Constants.expoConfig?.hostUri;
    const host = debuggerHost?.split(":")[0];

    return host ? `http://${host}:3000` : "http://localhost:3000";
}
