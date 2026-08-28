import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { authClient } from "@/lib/auth-client";
import { orpc } from "@/lib/orpc";

export default function HomeScreen() {
    const { data: session, isPending } = authClient.useSession();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(true);
    const [message, setMessage] = useState<string>();
    const healthQuery = useQuery(orpc.health.queryOptions());
    const meQuery = useQuery({
        ...orpc.auth.me.queryOptions(),
        enabled: Boolean(session),
    });
    const apiStatus = healthQuery.isSuccess
        ? "API connected"
        : healthQuery.isError
          ? "API unavailable"
          : "Checking API…";

    async function authenticate() {
        setMessage(undefined);

        const result = isSignUp
            ? await authClient.signUp.email({ email, name, password })
            : await authClient.signIn.email({ email, password });

        if (result.error) {
            setMessage(result.error.message ?? "Unable to authenticate.");
        }
    }

    if (isPending) {
        return (
            <ThemedView style={styles.container}>
                <ThemedText>Loading session…</ThemedText>
            </ThemedView>
        );
    }

    if (session) {
        return (
            <ThemedView style={styles.container}>
                <SafeAreaView style={styles.content}>
                    <ThemedText type="title">
                        Welcome, {session.user.name}
                    </ThemedText>
                    <ThemedText>{session.user.email}</ThemedText>
                    <ThemedText>{apiStatus}</ThemedText>
                    <ThemedText>
                        {meQuery.data
                            ? `oRPC session: ${meQuery.data.email}`
                            : "Checking oRPC session…"}
                    </ThemedText>
                    <Button
                        onPress={() => authClient.signOut()}
                        title="Sign out"
                    />
                </SafeAreaView>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.content}>
                <ThemedText type="title">
                    {isSignUp ? "Create an account" : "Sign in"}
                </ThemedText>
                <ThemedText>{apiStatus}</ThemedText>
                {isSignUp && (
                    <TextInput
                        autoCapitalize="words"
                        onChangeText={setName}
                        placeholder="Name"
                        style={styles.input}
                        value={name}
                    />
                )}
                <TextInput
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    placeholder="Email"
                    style={styles.input}
                    value={email}
                />
                <TextInput
                    autoComplete={
                        isSignUp ? "new-password" : "current-password"
                    }
                    onChangeText={setPassword}
                    placeholder="Password"
                    secureTextEntry
                    style={styles.input}
                    value={password}
                />
                {message && <ThemedText>{message}</ThemedText>}
                <Button
                    onPress={authenticate}
                    title={isSignUp ? "Create account" : "Sign in"}
                />
                <Button
                    onPress={() => setIsSignUp((value) => !value)}
                    title={
                        isSignUp
                            ? "Already have an account? Sign in"
                            : "Need an account? Sign up"
                    }
                />
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        gap: 16,
        justifyContent: "center",
        padding: 24,
    },
    input: {
        borderColor: "#9ca3af",
        borderRadius: 8,
        borderWidth: 1,
        padding: 12,
    },
});
