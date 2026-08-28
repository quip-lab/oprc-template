import {
    Alert,
    Button,
    Card,
    Form,
    Input,
    Label,
    Spinner,
    TextField,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";

import { authClient } from "#/lib/auth-client";
import { orpc } from "#/lib/orpc";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
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

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
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
                <Form className="contents" onSubmit={handleSubmit}>
                    <Card.Content className="flex flex-col gap-4">
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
                            <TextField
                                fullWidth
                                isRequired
                                name="name"
                                onChange={setName}
                                value={name}
                            >
                                <Label>Name</Label>
                                <Input placeholder="Your name" />
                            </TextField>
                        )}
                        <TextField
                            fullWidth
                            isRequired
                            name="email"
                            onChange={setEmail}
                            type="email"
                            value={email}
                        >
                            <Label>Email</Label>
                            <Input placeholder="you@example.com" />
                        </TextField>
                        <TextField
                            fullWidth
                            isRequired
                            name="password"
                            onChange={setPassword}
                            type="password"
                            value={password}
                        >
                            <Label>Password</Label>
                            <Input
                                minLength={8}
                                placeholder="At least 8 characters"
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
                    </Card.Content>
                    <Card.Footer className="flex flex-col gap-3">
                        <Button fullWidth type="submit">
                            {isSignUp ? "Create account" : "Sign in"}
                        </Button>
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
                </Form>
            </Card>
        </main>
    );
}
