import { useInfiniteClusterPost } from '@/api/posts/RQuery';
import type { PostReponse } from '@/api/posts/type';
import HeaderBackButton from '@/components/ui/complex/header/headerBackButton';
import { HeaderMain } from '@/components/ui/complex/header/headerMain';
import { SWText } from '@/components/ui/primitive/text';
import { globalStyle } from '@/constants/styles';
import { theme } from '@/constants/theme';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ClusterView() {
  const { clusterId, resolution } = useLocalSearchParams<
    '/Main/cluster/[clusterId]',
    { resolution?: string }
  >();
  const resolvedClusterId = Array.isArray(clusterId)
    ? clusterId[0]
    : clusterId;
  const resolvedResolution = resolution ? Number(resolution) : undefined;

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, isError, error } =
    useInfiniteClusterPost(
      resolvedClusterId
        ? { h3_index: resolvedClusterId, resolution: resolvedResolution }
        : undefined,
    );

  const posts = useMemo<PostReponse[]>(() => {
    if (!data) return [];
    return data.pages.flatMap((page) =>
      Array.isArray(page) ? page : page.results,
    );
  }, [data]);

  if (!resolvedClusterId) {
    return (
      <SafeAreaView style={[globalStyle.safeArea, styles.container]}>
        <HeaderMain>
          <HeaderBackButton />
          <SWText>Cluster</SWText>
          <View style={styles.headerSpacer} />
        </HeaderMain>
        <View style={styles.messageContainer}>
          <SWText>Cluster not found.</SWText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[globalStyle.safeArea, styles.container]}>
      <HeaderMain>
        <HeaderBackButton />
        <SWText>Cluster</SWText>
        <View style={styles.headerSpacer} />
      </HeaderMain>
      <FlatList
        data={posts}
        keyExtractor={(item) =>
          item.id ?? `${item.lat}-${item.lng}-${item.taken_at}`
        }
        contentContainerStyle={styles.listContent}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.6}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.messageContainer}>
              <SWText>Loading...</SWText>
            </View>
          ) : (
            <View style={styles.messageContainer}>
              <SWText>No posts in this cluster.</SWText>
            </View>
          )
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footer}>
              <SWText>Loading more...</SWText>
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          const handlePress = () => {
            if (!item.id) return;
            router.push({
              pathname: '/Main/post/[postId]',
              params: { postId: item.id },
            });
          };

          return (
            <Pressable onPress={handlePress} style={styles.card}>
              <Image source={{ uri: item.photo }} style={styles.thumbnail} />
              <View style={styles.meta}>
                <SWText numberOfLines={1}>{item.taken_at}</SWText>
                <SWText numberOfLines={1}>
                  {item.lat}, {item.lng}
                </SWText>
              </View>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colorBlack,
  },
  headerSpacer: {
    width: theme.fontSize34,
    height: theme.fontSize34,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  card: {
    backgroundColor: theme.colorGrey,
    borderRadius: 12,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  meta: {
    padding: 12,
    gap: 4,
  },
  messageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  footer: {
    paddingVertical: 12,
    alignItems: 'center',
  },
});
