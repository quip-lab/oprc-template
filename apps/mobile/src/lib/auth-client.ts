import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const authUrl = Constants.expoConfig?.extra?.authUrl;

export const authClient = createAuthClient({
    baseURL: typeof authUrl === "string" ? authUrl : "http://localhost:3000",
    plugins: [
        expoClient({
            scheme: "mobile",
            storagePrefix: "mobile",
            storage: SecureStore,
        }),
    ],
});
