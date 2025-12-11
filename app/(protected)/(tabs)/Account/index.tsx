import { StyleSheet, TouchableOpacity, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useDispatch } from 'react-redux';
import { clearSession } from '@/state/slices/sessionSlice';

export default function AccountScreen() {
  const dispatch = useDispatch();
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#0F1724', dark: '#050C14' }}
      headerImage={<View />}
    >
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Account
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Manage your session and preferences from here.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle" style={styles.cardTitle}>
          Session
        </ThemedText>
        <ThemedText style={styles.cardBody}>
          You are currently signed in. Use the button below to sign out.
        </ThemedText>
        <TouchableOpacity
          style={styles.signOutButton}
          activeOpacity={0.9}
          onPress={() => {
            dispatch(clearSession());
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
