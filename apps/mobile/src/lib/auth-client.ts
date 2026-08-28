import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const configuredAuthUrl = Constants.expoConfig?.extra?.authUrl;

export const authUrl =
    typeof configuredAuthUrl === "string"
        ? configuredAuthUrl
        : "http://localhost:3000";

export const authClient = createAuthClient({
    baseURL: authUrl,
    plugins: [
        expoClient({
            scheme: "mobile",
            storagePrefix: "mobile",
            storage: SecureStore,
        }),
    ],
});
