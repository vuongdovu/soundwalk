/**
 * Auth Layout
 *
 * Root layout for all authentication-related routes:
 * - signup - Onboarding flow with nested layouts
 *
 * The signup directory has its own _layout.tsx which handles:
 * - signup/splash - Hero splash screen
 * - signup/phone-number - Phone entry
 * - signup/verify - OTP verification
 * - signup/(steps)/* - All profile steps with fixed header
 */

import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function OnboardingLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          animationDuration: 200,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name="signup" />
      </Stack>
    </>
  );
}
