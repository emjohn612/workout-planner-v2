import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { WorkoutProvider } from "../WorkoutContext";

export default function RootLayout() {
    return (
        <WorkoutProvider>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="workout/create" options={{ presentation: "modal" }} />
                <Stack.Screen name="workout/[id]" options={{ gestureEnabled: false }} />
            </Stack>
        </WorkoutProvider>
    );
}
