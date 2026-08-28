import { Button, Card } from "@heroui/react";
import type { ErrorComponentProps } from "@tanstack/react-router";

export function RouteError({ error, reset }: ErrorComponentProps) {
    const detail =
        import.meta.env.DEV && error instanceof Error
            ? error.message
            : "Please try again. If the problem persists, return to the home page.";

    return (
        <main className="grid min-h-screen place-items-center bg-background p-6">
            <Card className="w-full max-w-md gap-6">
                <Card.Header>
                    <Card.Title>Something went wrong</Card.Title>
                    <Card.Description>{detail}</Card.Description>
                </Card.Header>
                <Card.Footer className="flex-col gap-3 sm:flex-row">
                    <Button onPress={reset}>Try again</Button>
                    <Button
                        onPress={() => {
                            globalThis.location.assign("/");
                        }}
                        variant="secondary"
                    >
                        Go home
                    </Button>
                </Card.Footer>
            </Card>
        </main>
    );
}

export function RouteNotFound() {
    return (
        <main className="grid min-h-screen place-items-center bg-background p-6">
            <Card className="w-full max-w-md gap-6">
                <Card.Header>
                    <Card.Title>Page not found</Card.Title>
                    <Card.Description>
                        The page you requested does not exist or has moved.
                    </Card.Description>
                </Card.Header>
                <Card.Footer>
                    <Button
                        onPress={() => {
                            globalThis.location.assign("/");
                        }}
                    >
                        Go home
                    </Button>
                </Card.Footer>
            </Card>
        </main>
    );
}
