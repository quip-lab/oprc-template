import {
    TabList,
    type TabListProps,
    TabSlot,
    Tabs,
    TabTrigger,
    type TabTriggerSlotProps,
} from "expo-router/ui";
import {
    Pressable,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from "react-native";

import { Colors } from "@/constants/theme";

export default function AppTabs() {
    return (
        <Tabs>
            <TabSlot style={{ height: "100%" }} />
            <TabList asChild>
                <CustomTabList>
                    <TabTrigger name="home" href="/" asChild>
                        <TabButton>Home</TabButton>
                    </TabTrigger>
                    <TabTrigger name="explore" href="/explore" asChild>
                        <TabButton>Explore</TabButton>
                    </TabTrigger>
                </CustomTabList>
            </TabList>
        </Tabs>
    );
}

export function TabButton({
    children,
    isFocused,
    ...props
}: TabTriggerSlotProps) {
    const scheme = useColorScheme();
    const colors = Colors[scheme === "unspecified" ? "light" : scheme];

    return (
        <Pressable
            {...props}
            style={({ pressed }) => [pressed && styles.pressed]}
        >
            <Text
                style={[
                    styles.tabText,
                    {
                        color: isFocused ? colors.text : colors.textSecondary,
                        fontWeight: isFocused ? "600" : "400",
                    },
                ]}
            >
                {children}
            </Text>
        </Pressable>
    );
}

export function CustomTabList({ children, style, ...props }: TabListProps) {
    const scheme = useColorScheme();
    const colors = Colors[scheme === "unspecified" ? "light" : scheme];

    return (
        <View {...props} style={[styles.tabListContainer, style]}>
            <View
                style={[
                    styles.innerContainer,
                    { backgroundColor: colors.backgroundElement },
                ]}
            >
                <Text style={[styles.brandText, { color: colors.text }]}>
                    Quip
                </Text>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    tabListContainer: {
        position: "absolute",
        width: "100%",
        padding: 16,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    innerContainer: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
        flexGrow: 1,
        gap: 8,
        maxWidth: 800,
    },
    brandText: {
        marginRight: "auto",
    },
    pressed: {
        opacity: 0.7,
    },
    tabText: {
        fontSize: 14,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
});
