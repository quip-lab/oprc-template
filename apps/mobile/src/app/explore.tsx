import { Button, Card, Typography } from "heroui-native";
import { Linking, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExploreScreen() {
    return (
        <SafeAreaView style={styles.screen}>
            <ScrollView contentContainerStyle={styles.content}>
                <Typography.Heading type="h2">
                    Explore the stack
                </Typography.Heading>
                <Typography.Paragraph color="muted">
                    Your web and mobile clients share Better Auth, the oRPC API,
                    and the Drizzle PostgreSQL schema.
                </Typography.Paragraph>

                <View style={styles.cards}>
                    <Card className="gap-3">
                        <Card.Body className="gap-2">
                            <Card.Title>Included integrations</Card.Title>
                            <Card.Description>
                                TanStack Query keeps API data in sync, while
                                Better Auth carries the session between each
                                client and the API.
                            </Card.Description>
                        </Card.Body>
                    </Card>

                    <Card className="gap-3">
                        <Card.Body className="gap-2">
                            <Card.Title>Useful references</Card.Title>
                            <Card.Description>
                                Browse the framework documentation from this
                                device.
                            </Card.Description>
                        </Card.Body>
                        <Card.Footer className="gap-3">
                            <Button
                                onPress={() => {
                                    void Linking.openURL(
                                        "https://docs.expo.dev",
                                    );
                                }}
                                variant="secondary"
                            >
                                Expo docs
                            </Button>
                            <Button
                                onPress={() => {
                                    void Linking.openURL(
                                        "https://orpc.dev/docs",
                                    );
                                }}
                                variant="tertiary"
                            >
                                oRPC docs
                            </Button>
                        </Card.Footer>
                    </Card>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    content: {
        gap: 16,
        padding: 24,
    },
    cards: {
        gap: 16,
    },
});
