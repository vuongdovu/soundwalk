import { Stack } from "expo-router";

export default function ProtectedLayout() {
  // Trust that RootLayout has already verified authentication and onboarding
  // If this component is rendered, the user is authenticated and onboarding is complete
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // Disable swipe back gestures
        animation: "fade",
        animationDuration: 150,
      }}
    >
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
