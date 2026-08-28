import { createFileRoute } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";

import { authClient } from "#/lib/auth-client";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
    const { data: session, isPending } = authClient.useSession();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(true);
    const [message, setMessage] = useState<string>();

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
        return <main className="p-8">Loading session…</main>;
    }

    if (session) {
        return (
            <main className="mx-auto max-w-lg p-8">
                <h1 className="text-4xl font-bold">
                    Welcome, {session.user.name}
                </h1>
                <p className="mt-4 text-lg">{session.user.email}</p>
                <button
                    className="mt-6 rounded bg-black px-4 py-2 text-white"
                    onClick={() => authClient.signOut()}
                    type="button"
                >
                    Sign out
                </button>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-lg p-8">
            <h1 className="text-4xl font-bold">
                {isSignUp ? "Create an account" : "Sign in"}
            </h1>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                {isSignUp && (
                    <input
                        className="w-full rounded border p-3"
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Name"
                        required
                        value={name}
                    />
                )}
                <input
                    className="w-full rounded border p-3"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Email"
                    required
                    type="email"
                    value={email}
                />
                <input
                    className="w-full rounded border p-3"
                    minLength={8}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password"
                    required
                    type="password"
                    value={password}
                />
                {message && <p className="text-red-600">{message}</p>}
                <button
                    className="w-full rounded bg-black px-4 py-3 text-white"
                    type="submit"
                >
                    {isSignUp ? "Create account" : "Sign in"}
                </button>
            </form>
            <button
                className="mt-4 underline"
                onClick={() => setIsSignUp((value) => !value)}
                type="button"
            >
                {isSignUp
                    ? "Already have an account? Sign in"
                    : "Need an account? Sign up"}
            </button>
        </main>
    );
}
