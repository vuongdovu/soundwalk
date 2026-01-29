import { PermissionProvider } from '@/context/PermissionContext';
import { SessionProvider, useSession } from '@/context/SessionContext';
import { queryClient } from '@/services/QueryClientService';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { getAuth } from '@react-native-firebase/auth';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { setLogLevel } from '@react-native-firebase/app';

export const unstable_settings = {};

if(__DEV__) {
  getAuth().settings.appVerificationDisabledForTesting = true;
  setLogLevel('debug');
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={styles.root}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <QueryClientProvider client={queryClient}>
          <BottomSheetModalProvider>
            <SessionProvider>
              <PermissionProvider>
                <RootNavigation />
              </PermissionProvider>
            </SessionProvider>
          </BottomSheetModalProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigation() {
  const { user, loading } = useSession();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[1] === 'onboarding';

    if (!user) {
      if (!inAuthGroup) {
        router.replace('/signup');
      }
      return;
    }

    if (!user.profile_completed) {
      if (!inAuthGroup || !inOnboarding) {
        router.replace('/onboarding/account');
      }
      return;
    }

    if (inAuthGroup) {
      router.replace('/Main');
    }
  }, [user, loading, segments, router]);
  
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
          animationDuration: 200,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(protected)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
