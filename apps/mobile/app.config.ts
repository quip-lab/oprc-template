import type { ExpoConfig } from "expo/config";

const apiUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, "");
const appIdentifier =
    process.env.EXPO_APP_IDENTIFIER ?? "com.quip.oprctemplate";

const appConfig: ExpoConfig = {
    name: "mobile",
    slug: "mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "mobile",
    userInterfaceStyle: "automatic",
    ios: {
        bundleIdentifier: appIdentifier,
        icon: "./assets/expo.icon",
    },
    android: {
        package: appIdentifier,
        adaptiveIcon: {
            backgroundColor: "#E6F4FE",
            foregroundImage: "./assets/images/android-icon-foreground.png",
            backgroundImage: "./assets/images/android-icon-background.png",
            monochromeImage: "./assets/images/android-icon-monochrome.png",
        },
        predictiveBackGestureEnabled: false,
    },
    web: {
        favicon: "./assets/images/favicon.png",
    },
    plugins: [
        "expo-router",
        "expo-secure-store",
        [
            "expo-splash-screen",
            {
                backgroundColor: "#208AEF",
                image: "./assets/images/splash-icon.png",
                imageWidth: 76,
            },
        ],
    ],
    experiments: {
        typedRoutes: true,
        reactCompiler: true,
    },
    extra: {
        apiUrl,
    },
};

export default appConfig;
