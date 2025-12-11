import { useEffect } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as AppleAuthentication from 'expo-apple-authentication';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { useDispatch } from 'react-redux';
import { setSession } from '@/state/slices/sessionSlice';

export default function SignupScreen() {
  const dispatch = useDispatch();

  useEffect(() => {
    GoogleSignin.configure({
      // TODO: replace with your real Web Client ID from Google Cloud Console
      webClientId: 'YOUR_WEB_CLIENT_ID',
      iosClientId: "798679775748-jq6juds6ibvmsvdolqkf7rnn4bv0dckn.apps.googleusercontent.com"
    });
  }, []);

  const handleApple = async () => {
    try {
      const available = await AppleAuthentication.isAvailableAsync();
      if (!available) {
        Alert.alert('Apple Sign-In not available on this device');
        return;
      }
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      // TODO: send credential.identityToken or authorizationCode to your backend
      // const session = await api.signInWithApple(credential);
      // dispatch(setSession(session));
      // router.replace('/(protected)/(tabs)/Main');
    } catch (e: any) {
      if (e?.code === 'ERR_REQUEST_CANCELED') return;
      Alert.alert('Sign-in failed', e?.message ?? 'Please try again');
    }
  };

  const handleGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();
      // TODO: send userInfo.idToken or serverAuthCode to your backend to create a session
      // dispatch(setSession(session));
      // router.replace('/(protected)/(tabs)/Main');
      console.log('Google user', userInfo);
    } catch (e: any) {
      if (e?.code === statusCodes.SIGN_IN_CANCELLED) return;
      if (e?.code === statusCodes.IN_PROGRESS) return;
      Alert.alert('Google Sign-In failed', e?.message ?? 'Please try again');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Create your account</Text>

        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={10}
          style={styles.appleButton}
          onPress={handleApple}
        />

        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          style={styles.googleButton}
          onPress={handleGoogle}
        />

        <TouchableOpacity
          style={styles.linkButton}
          activeOpacity={0.9}
          onPress={() => router.push('/(auth)/signup/verify')}
        >
          <Text style={styles.linkText}>Use phone/email instead</Text>
        </TouchableOpacity>
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
