import { zodResolver } from "@hookform/resolvers/zod";
import {
    type SignInFormValues,
    type SignUpFormValues,
    signInSchema,
    signUpSchema,
} from "@repo/validators";
import { useQuery } from "@tanstack/react-query";
import {
    Alert,
    Button,
    Card,
    FieldError,
    Input,
    Label,
    Spinner,
    TextField,
    Typography,
} from "heroui-native";
import { useState } from "react";
import { type Control, Controller, type Path, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { authClient } from "@/lib/auth-client";
import { orpc } from "@/lib/orpc";

export default function HomeScreen() {
    const { data: session, isPending } = authClient.useSession();
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

    async function signIn(values: SignInFormValues) {
        setMessage(undefined);

        try {
            const result = await authClient.signIn.email(values);

            if (result.error) {
                setMessage(result.error.message ?? "Unable to authenticate.");
            }
        } catch {
            setMessage("Unable to authenticate. Please try again.");
        }
    }

    async function signUp(values: SignUpFormValues) {
        setMessage(undefined);

        try {
            const result = await authClient.signUp.email(values);

            if (result.error) {
                setMessage(result.error.message ?? "Unable to authenticate.");
            }
        } catch {
            setMessage("Unable to authenticate. Please try again.");
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
                            <ConnectionAlert
                                detail={
                                    meQuery.data
                                        ? `oRPC session: ${meQuery.data.email}`
                                        : "Checking your oRPC session…"
                                }
                                isError={healthQuery.isError}
                                isSuccess={healthQuery.isSuccess}
                                title={apiStatus}
                            />
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
                        <ConnectionAlert
                            isError={healthQuery.isError}
                            isSuccess={healthQuery.isSuccess}
                            title={apiStatus}
                        />
                        {isSignUp ? (
                            <SignUpForm message={message} onSubmit={signUp} />
                        ) : (
                            <SignInForm message={message} onSubmit={signIn} />
                        )}
                    </Card.Body>
                    <Card.Footer className="gap-3">
                        <Button
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

function ConnectionAlert({
    detail,
    isError,
    isSuccess,
    title,
}: {
    detail?: string;
    isError: boolean;
    isSuccess: boolean;
    title: string;
}) {
    return (
        <Alert status={isSuccess ? "success" : isError ? "danger" : "accent"}>
            <Alert.Indicator />
            <Alert.Content>
                <Alert.Title>{title}</Alert.Title>
                {detail && <Alert.Description>{detail}</Alert.Description>}
            </Alert.Content>
        </Alert>
    );
}

function SignInForm({
    message,
    onSubmit,
}: {
    message?: string;
    onSubmit: (values: SignInFormValues) => Promise<void>;
}) {
    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<SignInFormValues>({
        defaultValues: { email: "", password: "" },
        resolver: zodResolver(signInSchema),
    });

    return (
        <View style={styles.form}>
            <EmailField control={control} />
            <PasswordField control={control} />
            {message && <AuthenticationError message={message} />}
            <Button
                isDisabled={isSubmitting}
                onPress={() => {
                    void handleSubmit(onSubmit)();
                }}
            >
                {isSubmitting ? "Working…" : "Sign in"}
            </Button>
        </View>
    );
}

function SignUpForm({
    message,
    onSubmit,
}: {
    message?: string;
    onSubmit: (values: SignUpFormValues) => Promise<void>;
}) {
    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<SignUpFormValues>({
        defaultValues: { email: "", name: "", password: "" },
        resolver: zodResolver(signUpSchema),
    });

    return (
        <View style={styles.form}>
            <Controller
                control={control}
                name="name"
                render={({ field, fieldState }) => (
                    <TextField isInvalid={Boolean(fieldState.error)} isRequired>
                        <Label>Name</Label>
                        <Input
                            autoCapitalize="words"
                            onChangeText={field.onChange}
                            placeholder="Your name"
                            value={field.value}
                        />
                        {fieldState.error && (
                            <FieldError>{fieldState.error.message}</FieldError>
                        )}
                    </TextField>
                )}
            />
            <EmailField control={control} />
            <PasswordField control={control} />
            {message && <AuthenticationError message={message} />}
            <Button
                isDisabled={isSubmitting}
                onPress={() => {
                    void handleSubmit(onSubmit)();
                }}
            >
                {isSubmitting ? "Working…" : "Create account"}
            </Button>
        </View>
    );
}

function EmailField<T extends SignInFormValues>({
    control,
}: {
    control: Control<T>;
}) {
    return (
        <Controller
            control={control}
            name={"email" as Path<T>}
            render={({ field, fieldState }) => (
                <TextField isInvalid={Boolean(fieldState.error)} isRequired>
                    <Label>Email</Label>
                    <Input
                        autoCapitalize="none"
                        autoComplete="email"
                        keyboardType="email-address"
                        onChangeText={field.onChange}
                        placeholder="you@example.com"
                        value={field.value}
                    />
                    {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                    )}
                </TextField>
            )}
        />
    );
}

function PasswordField<T extends SignInFormValues>({
    control,
}: {
    control: Control<T>;
}) {
    return (
        <Controller
            control={control}
            name={"password" as Path<T>}
            render={({ field, fieldState }) => (
                <TextField isInvalid={Boolean(fieldState.error)} isRequired>
                    <Label>Password</Label>
                    <Input
                        autoComplete="password"
                        onChangeText={field.onChange}
                        placeholder="At least 8 characters"
                        secureTextEntry
                        value={field.value}
                    />
                    {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                    )}
                </TextField>
            )}
        />
    );
}

function AuthenticationError({ message }: { message: string }) {
    return (
        <Alert status="danger">
            <Alert.Indicator />
            <Alert.Content>
                <Alert.Title>Unable to authenticate</Alert.Title>
                <Alert.Description>{message}</Alert.Description>
            </Alert.Content>
        </Alert>
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
    form: {
        gap: 16,
    },
});
