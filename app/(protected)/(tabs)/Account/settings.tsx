import authService from '@/api/auth/AuthQueries';
import HeaderBackButton from '@/components/ui/complex/header/headerBackButton';
import ActionList from '@/components/ui/primitive/actionList';
import { SWText } from '@/components/ui/primitive/text';
import { accountLinks } from '@/constants/accountLinks';
import { useSession } from '@/context/SessionContext';
import tokenService from '@/services/TokenService';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AccountSettingsScreen() {
  const session = useSession();

  async function signOut() {
    if (GoogleSignin.hasPreviousSignIn()) {
      await GoogleSignin.signOut();
    }
    session.setUser(null);
    const refresh = await tokenService.getRefreshToken();
    await authService.logout(refresh);
    await tokenService.clear();
    await session.refreshSession();
    router.replace('/signup');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <HeaderBackButton />
        <SWText style={styles.title}>Settings</SWText>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.section}>
        <ActionList actions={accountLinks} />
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.signOutButton}
          activeOpacity={0.9}
          onPress={signOut}
        >
          <SWText style={styles.signOutText}>Sign out</SWText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#050C14',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#EAF2FF',
  },
  headerSpacer: {
    width: 34,
    height: 34,
  },
  section: {
    gap: 10,
    paddingBottom: 20,
  },
  signOutButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#E23E57',
  },
  signOutText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
