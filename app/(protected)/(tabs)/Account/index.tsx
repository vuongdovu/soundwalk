import { useSession } from '@/context/SessionContext';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import authService from '@/api/auth/AuthQueries';
import { useCurrentUserProfile } from '@/api/profile/RQuery';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import ProfilePicture from '@/components/ui/complex/profile/profilePicture';
import ActionList from '@/components/ui/primitive/actionList';
import { accountLinks } from '@/constants/accountLinks';
import tokenService from '@/services/TokenService';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Text } from 'react-native';

export default function AccountScreen() {
  const session = useSession();
  const token = tokenService.getAccessToken();
  const {data, isLoading} = useCurrentUserProfile();


  async function signOut(){
    if (GoogleSignin.hasPreviousSignIn()) {
      await GoogleSignin.signOut()
      console.log("signed out")
    }
    session.setUser(null);
    const refresh = await tokenService.getRefreshToken();
    await authService.logout(refresh);
    await tokenService.clear();
    await session.refreshSession();
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#0F1724', dark: '#050C14' }}
      headerImage={<View />}
    >
      <ProfilePicture 
        profilePictureUrl={data?.profile_picture_url}
      />
      <Text>{session.user?.username}</Text>
      <ActionList 
        actions={accountLinks}
      />
      <ThemedView style={styles.card}>
        <TouchableOpacity
          style={styles.signOutButton}
          activeOpacity={0.9}
          onPress={() => {
            signOut();
          }}
        >
          <ThemedText type="defaultSemiBold" style={styles.signOutText}>
            Sign out
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
    marginBottom: 12,
  },
  title: {
    fontWeight: '800',
  },
  subtitle: {
    lineHeight: 20,
  },
  card: {
    borderRadius: 14,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  cardTitle: {
    fontWeight: '700',
  },
  cardBody: {
    lineHeight: 20,
  },
  signOutButton: {
    marginTop: 4,
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
