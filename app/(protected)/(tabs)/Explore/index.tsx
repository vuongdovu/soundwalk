import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import ParallaxScrollView from '@/components/parallax-scroll-view';

const features = [
  {
    title: 'Routing',
    body: 'File-based navigation with nested layouts and native tabs.',
    link: 'https://docs.expo.dev/router/introduction',
  },
  {
    title: 'Theming',
    body: 'Light and dark palettes with reusable themed components.',
    link: 'https://docs.expo.dev/develop/user-interface/color-themes/',
  },
  {
    title: 'Animations',
    body: 'Powered by Reanimated and the ParallaxScrollView header.',
    link: 'https://docs.swmansion.com/react-native-reanimated/',
  },
  {
    title: 'Images',
    body: 'Optimized image loading via expo-image with caching and effects.',
    link: 'https://reactnative.dev/docs/images',
  },
];

export default function ExploreScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#0F1724', dark: '#050C14' }}
      headerImage={
        <View style={styles.hero}>
          <IconSymbol
            size={280}
            color="#4F8EF7"
            name="sparkles"
            style={styles.headerImage}
          />
        </View>
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.title}>
          Explore
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Discover what’s included and where to extend your app.
        </ThemedText>
      </ThemedView>

      <View style={styles.grid}>
        {features.map((item) => (
          <ThemedView key={item.title} style={styles.card}>
            <ThemedText type="subtitle" style={styles.cardTitle}>
              {item.title}
            </ThemedText>
            <ThemedText style={styles.cardBody}>{item.body}</ThemedText>
            <Link href={item.link} asChild>
              <ThemedText type="link" style={styles.cardLink}>
                Learn more
              </ThemedText>
            </Link>
          </ThemedView>
        ))}
      </View>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Demo assets
        </ThemedText>
        <View style={styles.assetsRow}>
          <Image
            source={require('@/assets/images/react-logo.png')}
            style={styles.assetImage}
          />
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.assetImage}
          />
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerImage: {
    opacity: 0.9,
  },
  titleContainer: {
    gap: 6,
    marginBottom: 12,
  },
  title: {
    fontWeight: '800',
  },
  subtitle: {
    lineHeight: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
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
  cardLink: {
    marginTop: 4,
  },
  section: {
    marginTop: 20,
    gap: 10,
  },
  sectionTitle: {
    fontWeight: '700',
  },
  assetsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  assetImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
});
