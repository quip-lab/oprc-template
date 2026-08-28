import Constants from "expo-constants";

/**
 * Uses Metro's LAN host during development so Expo Go and development builds
 * can reach the TanStack Start server running on port 3000.
 */
export function getBaseUrl() {
    const debuggerHost = Constants.expoConfig?.hostUri;
    const host = debuggerHost?.split(":")[0];

    return host ? `http://${host}:3000` : "http://localhost:3000";
}
