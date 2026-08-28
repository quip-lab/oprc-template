import {
    Alert,
    Button,
    Card,
    FieldError,
    Form,
    Input,
    Label,
    Spinner,
    TextField,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    type SignInFormValues,
    type SignUpFormValues,
    signInSchema,
    signUpSchema,
} from "@repo/validators";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { type Control, Controller, type Path, useForm } from "react-hook-form";

import { authClient } from "#/lib/auth-client";
import { orpc } from "#/lib/orpc";

export const Route = createFileRoute("/")({ component: Home });

export function Home() {
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
            <main className="grid min-h-screen place-items-center bg-background p-8">
                <Card className="flex items-center gap-3 p-6">
                    <Spinner />
                    <Card.Description>Loading session…</Card.Description>
                </Card>
            </main>
        );
    }

    if (session) {
        return (
            <main className="grid min-h-screen place-items-center bg-background p-6">
                <Card className="w-full max-w-md gap-6">
                    <Card.Header>
                        <Card.Title>Welcome, {session.user.name}</Card.Title>
                        <Card.Description>
                            {session.user.email}
                        </Card.Description>
                    </Card.Header>
                    <Card.Content>
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
                    </Card.Content>
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
            </main>
        );
    }

    return (
        <main className="grid min-h-screen place-items-center bg-background p-6">
            <Card className="w-full max-w-md gap-6">
                <Card.Header>
                    <Card.Title>
                        {isSignUp ? "Create an account" : "Sign in"}
                    </Card.Title>
                    <Card.Description>
                        Use your email and password to continue.
                    </Card.Description>
                </Card.Header>
                <Card.Content>
                    <ConnectionAlert
                        isError={healthQuery.isError}
                        isSuccess={healthQuery.isSuccess}
                        title={apiStatus}
                    />
                </Card.Content>
                {isSignUp ? (
                    <SignUpForm message={message} onSubmit={signUp} />
                ) : (
                    <SignInForm message={message} onSubmit={signIn} />
                )}
                <Card.Footer>
                    <Button
                        fullWidth
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
        </main>
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
        <Form className="contents" onSubmit={handleSubmit(onSubmit)}>
            <Card.Content className="flex flex-col gap-4">
                <EmailField control={control} />
                <PasswordField control={control} />
                {message && <AuthenticationError message={message} />}
            </Card.Content>
            <Card.Footer>
                <Button fullWidth isPending={isSubmitting} type="submit">
                    Sign in
                </Button>
            </Card.Footer>
        </Form>
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
        <Form className="contents" onSubmit={handleSubmit(onSubmit)}>
            <Card.Content className="flex flex-col gap-4">
                <Controller
                    control={control}
                    name="name"
                    render={({ field, fieldState }) => (
                        <TextField
                            fullWidth
                            isInvalid={Boolean(fieldState.error)}
                            isRequired
                            name={field.name}
                            onChange={field.onChange}
                            value={field.value}
                        >
                            <Label>Name</Label>
                            <Input placeholder="Your name" />
                            {fieldState.error && (
                                <FieldError>
                                    {fieldState.error.message}
                                </FieldError>
                            )}
                        </TextField>
                    )}
                />
                <EmailField control={control} />
                <PasswordField control={control} />
                {message && <AuthenticationError message={message} />}
            </Card.Content>
            <Card.Footer>
                <Button fullWidth isPending={isSubmitting} type="submit">
                    Create account
                </Button>
            </Card.Footer>
        </Form>
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
                <TextField
                    fullWidth
                    isInvalid={Boolean(fieldState.error)}
                    isRequired
                    name={field.name}
                    onChange={field.onChange}
                    type="email"
                    value={field.value}
                >
                    <Label>Email</Label>
                    <Input placeholder="you@example.com" />
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
                <TextField
                    fullWidth
                    isInvalid={Boolean(fieldState.error)}
                    isRequired
                    name={field.name}
                    onChange={field.onChange}
                    type="password"
                    value={field.value}
                >
                    <Label>Password</Label>
                    <Input minLength={8} placeholder="At least 8 characters" />
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
