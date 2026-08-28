import { useQuery } from "@tanstack/react-query";
import {
    Alert,
    Button,
    Card,
    Input,
    Label,
    Spinner,
    TextField,
    Typography,
} from "heroui-native";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { authClient } from "@/lib/auth-client";
import { orpc } from "@/lib/orpc";

export default function HomeScreen() {
    const { data: session, isPending } = authClient.useSession();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(true);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
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
        setIsAuthenticating(true);

        try {
            const result = isSignUp
                ? await authClient.signUp.email({ email, name, password })
                : await authClient.signIn.email({ email, password });

            if (result.error) {
                setMessage(result.error.message ?? "Unable to authenticate.");
            }
        } catch {
            setMessage("Unable to authenticate. Please try again.");
        } finally {
            setIsAuthenticating(false);
        }
    }

    if (isPending) {
        return (
            <SafeAreaView style={styles.screen}>
                <View style={styles.centered}>
                    <Spinner />
                    <Typography color="muted">Loading session…</Typography>
                </View>
            </SafeAreaView>
        );
    }

    if (session) {
        return (
            <SafeAreaView style={styles.screen}>
                <View style={styles.content}>
                    <Card className="gap-5">
                        <Card.Header>
                            <Card.Title>
                                Welcome, {session.user.name}
                            </Card.Title>
                            <Card.Description>
                                {session.user.email}
                            </Card.Description>
                        </Card.Header>
                        <Card.Body className="gap-3">
                            <Alert
                                status={
                                    healthQuery.isSuccess
                                        ? "success"
                                        : healthQuery.isError
                                          ? "danger"
                                          : "accent"
                                }
                            >
                                <Alert.Indicator />
                                <Alert.Content>
                                    <Alert.Title>{apiStatus}</Alert.Title>
                                    <Alert.Description>
                                        {meQuery.data
                                            ? `oRPC session: ${meQuery.data.email}`
                                            : "Checking your oRPC session…"}
                                    </Alert.Description>
                                </Alert.Content>
                            </Alert>
                        </Card.Body>
                        <Card.Footer>
                            <Button
                                onPress={() => {
                                    void authClient.signOut();
                                }}
                                variant="secondary"
                            >
                                Sign out
                            </Button>
                        </Card.Footer>
                    </Card>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.content}>
                <Card className="gap-5">
                    <Card.Header>
                        <Card.Title>
                            {isSignUp ? "Create an account" : "Sign in"}
                        </Card.Title>
                        <Card.Description>
                            Use your email and password to continue.
                        </Card.Description>
                    </Card.Header>
                    <Card.Body className="gap-4">
                        <Alert
                            status={
                                healthQuery.isSuccess
                                    ? "success"
                                    : healthQuery.isError
                                      ? "danger"
                                      : "accent"
                            }
                        >
                            <Alert.Indicator />
                            <Alert.Content>
                                <Alert.Title>{apiStatus}</Alert.Title>
                            </Alert.Content>
                        </Alert>
                        {isSignUp && (
                            <TextField isRequired>
                                <Label>Name</Label>
                                <Input
                                    autoCapitalize="words"
                                    onChangeText={setName}
                                    placeholder="Your name"
                                    value={name}
                                />
                            </TextField>
                        )}
                        <TextField isRequired>
                            <Label>Email</Label>
                            <Input
                                autoCapitalize="none"
                                autoComplete="email"
                                keyboardType="email-address"
                                onChangeText={setEmail}
                                placeholder="you@example.com"
                                value={email}
                            />
                        </TextField>
                        <TextField isRequired>
                            <Label>Password</Label>
                            <Input
                                autoComplete={
                                    isSignUp
                                        ? "new-password"
                                        : "current-password"
                                }
                                onChangeText={setPassword}
                                placeholder="At least 8 characters"
                                secureTextEntry
                                value={password}
                            />
                        </TextField>
                        {message && (
                            <Alert status="danger">
                                <Alert.Indicator />
                                <Alert.Content>
                                    <Alert.Title>
                                        Unable to authenticate
                                    </Alert.Title>
                                    <Alert.Description>
                                        {message}
                                    </Alert.Description>
                                </Alert.Content>
                            </Alert>
                        )}
                    </Card.Body>
                    <Card.Footer className="gap-3">
                        <Button
                            isDisabled={
                                isAuthenticating ||
                                !email ||
                                !password ||
                                (isSignUp && !name)
                            }
                            onPress={() => {
                                void authenticate();
                            }}
                        >
                            {isAuthenticating
                                ? "Working…"
                                : isSignUp
                                  ? "Create account"
                                  : "Sign in"}
                        </Button>
                        <Button
                            isDisabled={isAuthenticating}
                            onPress={() => {
                                setIsSignUp((value) => !value);
                                setMessage(undefined);
                            }}
                            variant="tertiary"
                        >
                            {isSignUp
                                ? "Already have an account? Sign in"
                                : "Need an account? Sign up"}
                        </Button>
                    </Card.Footer>
                </Card>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    centered: {
        alignItems: "center",
        flex: 1,
        gap: 12,
        justifyContent: "center",
        padding: 24,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        padding: 24,
    },
});
