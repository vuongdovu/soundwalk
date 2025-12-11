import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSelector } from 'react-redux';
import { selectSession } from '@/state/selectors/sessionSelectors';

export default function HomeScreen() {
  const session = useSelector(selectSession)

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#0F1724', dark: '#050C14' }}
      headerImage={
        <View style={styles.hero}>
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
          />
          <View style={styles.heroOverlay} />
        </View>
      }>
        <View>
          <ThemedText>
            {session?.token}
          </ThemedText>
        </View>
      <ThemedView style={styles.headerText}>
        <ThemedText type="title" style={styles.title}>
          Welcome back
        </ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>
          Your personalized hub for exploring, learning, and staying on track.
        </ThemedText>
      </ThemedView>

      <View style={styles.cardGrid}>
        <ThemedView style={styles.card}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Quick start
          </ThemedText>
          <ThemedText style={styles.cardBody}>
            Jump into your next task with curated shortcuts and recent activity.
          </ThemedText>
          <Link href="/(protected)/(tabs)/Explore">
            <Link.Trigger>
              <ThemedText type="link">Explore now</ThemedText>
            </Link.Trigger>
          </Link>
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Learn
          </ThemedText>
          <ThemedText style={styles.cardBody}>
            Browse tips, guides, and walkthroughs tailored to your goals.
          </ThemedText>
          <Link href="/modal">
            <Link.Trigger>
              <ThemedText type="link">Open modal</ThemedText>
            </Link.Trigger>
          </Link>
        </ThemedView>
      </View>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Quick actions
        </ThemedText>
        <View style={styles.actionRow}>
          <ThemedView style={styles.actionPill}>
            <ThemedText type="defaultSemiBold">Create</ThemedText>
            <ThemedText style={styles.pillText}>Start something new</ThemedText>
          </ThemedView>
          <ThemedView style={styles.actionPill}>
            <ThemedText type="defaultSemiBold">Invite</ThemedText>
            <ThemedText style={styles.pillText}>Add teammates</ThemedText>
          </ThemedView>
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reactLogo: {
    height: 200,
    width: 300,
    resizeMode: 'contain',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 36, 0.35)',
  },
  headerText: {
    gap: 8,
    marginBottom: 12,
  },
  title: {
    fontWeight: '800',
  },
  subtitle: {
    lineHeight: 20,
  },
  cardGrid: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    marginTop: 8,
  },
  card: {
    flex: 1,
    minWidth: 200,
    borderRadius: 14,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  cardTitle: {
    fontWeight: '700',
  },
  cardBody: {
    lineHeight: 20,
  },
  section: {
    marginTop: 20,
    gap: 10,
  },
  sectionTitle: {
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  actionPill: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    gap: 4,
    minWidth: 150,
  },
  pillText: {
    color: 'rgba(255,255,255,0.7)',
  },
});
