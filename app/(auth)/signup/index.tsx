import authService from '@/api/auth/AuthQueries';
import { GoogleSignin, isErrorWithCode, isSuccessResponse, statusCodes } from '@react-native-google-signin/google-signin';
// import * as AppleAuthentication from 'expo-apple-authentication';
import { useSession } from '@/context/SessionContext';
import TokenService from "@/services/TokenService";
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignupScreen() {
  const {refreshSession} = useSession();
  const router = useRouter();

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: "804136644010-9d2tffnkeag7mtu5u5mnblvsmhfjrsff.apps.googleusercontent.com",
      webClientId: "804136644010-46gcova7ksrmjjsvsgcvosroink4rpid.apps.googleusercontent.com"
    });
  }, []);

  function GoogleSignIn() {
    return (
      <Button
        title="Google Sign-In"
        onPress={() => signIn().then(() => console.log('Signed in with Google!'))}
      />
    );
  }

  const signIn = async () => {
    try {
      // await GoogleSignin.hasPlayServices();
      if (GoogleSignin.hasPreviousSignIn()) {
        await GoogleSignin.signOut()
      }
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        const { accessToken, idToken } = await GoogleSignin.getTokens();
        if (!accessToken) {
          throw new Error("Google sign-in did not return any tokens.");
        }
        const resp = await authService.google(accessToken);
        await TokenService.setTokens(resp.access, resp.refresh);
        await refreshSession();
        router.replace("/onboarding/account")
      } else {
        // sign in was cancelled by user
        console.log("cancelled by user")
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            break;
          default:
            console.log("Error during Google sign-in", error);
        }
      } else {
        // an error that's not related to google sign in occurred
        console.log("error", error)
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Create your account</Text>

        {/* <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={10}
          style={styles.appleButton}
          onPress={handleApple}
        /> */}

        <GoogleSignIn />

        {/* <TouchableOpacity
          style={styles.linkButton}
          activeOpacity={0.9}
          onPress={() => router.push('/signup/verify')}
        >
          <Text style={styles.linkText}>Use phone</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0C1B2A' },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  title: { fontSize: 24, fontWeight: '700', color: '#EAF2FF', textAlign: 'center' },
  appleButton: { width: '100%', maxWidth: 320, height: 52 },
  googleButton: { width: '100%', maxWidth: 320, height: 52 },
  linkButton: { paddingVertical: 10 },
  linkText: { color: '#9FB9FF', fontWeight: '700' },
});
