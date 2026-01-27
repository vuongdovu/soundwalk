import { useInfiniteMyPost } from '@/api/posts/RQuery';
import type { PostReponse } from '@/api/posts/type';
import { useCurrentUserProfile } from '@/api/profile/RQuery';
import ProfilePicture from '@/components/ui/complex/profile/profilePicture';
import { SWText } from '@/components/ui/primitive/text';
import { theme } from '@/constants/theme';
import { useSession } from '@/context/SessionContext';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const HEADER_HEIGHT = 260;

export default function AccountScreen() {
  const session = useSession();
  const { data: profile } = useCurrentUserProfile();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteMyPost({ is_draft: false });

  const posts = useMemo<PostReponse[]>(() => {
    if (!data) return [];
    return data.pages.flatMap((page) =>
      Array.isArray(page) ? page : page.results,
    );
  }, [data]);

  const scrollRef = useAnimatedRef<Animated.FlatList<PostReponse>>();
  const scrollOffset = useScrollOffset(scrollRef);
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75],
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1],
          ),
        },
      ],
    };
  });

  const displayName =
    profile?.full_name?.trim() || session.user?.username || 'Your profile';
  const displayHandle =
    profile?.username?.trim() || session.user?.username || 'soundwalker';

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.FlatList
        ref={scrollRef}
        data={posts}
        keyExtractor={(item) =>
          item.id ?? `${item.lat}-${item.lng}-${item.taken_at}`
        }
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={() => (
          <View>
            <Animated.View style={[styles.header, headerAnimatedStyle]}>
              <View style={styles.headerGlowTop} />
              <View style={styles.headerGlowBottom} />
              <TouchableOpacity
                style={styles.settingsButton}
                activeOpacity={0.9}
                onPress={() => router.push('/Account/settings')}
              >
                <MaterialCommunityIcons name="cog" size={20} color="#EAF2FF" />
              </TouchableOpacity>
              <View style={styles.headerContent}>
                <ProfilePicture profilePictureUrl={profile?.profile_picture_url} />
                <SWText style={styles.name}>{displayName}</SWText>
                <SWText style={styles.handle}>@{displayHandle}</SWText>
              </View>
            </Animated.View>
            <View style={styles.sectionHeader}>
              <SWText style={styles.sectionTitle}>Timeline</SWText>
            </View>
          </View>
        )}
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
              <SWText>No posts yet.</SWText>
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
              pathname: '/Account/post/[postId]',
              params: { postId: item.id },
            });
          };

          return (
            <Pressable onPress={handlePress} style={styles.card}>
              <Image source={{ uri: item.photo }} style={styles.thumbnail} />
              <View style={styles.meta}>
                <SWText numberOfLines={1}>{item.taken_at}</SWText>
                <SWText numberOfLines={1}>
                  Visibility: {item.visibility}
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
  safeArea: {
    flex: 1,
    backgroundColor: '#050C14',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 12,
  },
  header: {
    height: HEADER_HEIGHT,
    backgroundColor: '#0F1724',
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  headerGlowTop: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#2563EB',
    opacity: 0.25,
    top: -120,
    right: -80,
  },
  headerGlowBottom: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#0EA5E9',
    opacity: 0.2,
    bottom: -160,
    left: -60,
  },
  settingsButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15,23,36,0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 24,
    gap: 6,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#EAF2FF',
  },
  handle: {
    fontSize: 13,
    color: '#9FB2D5',
  },
  sectionHeader: {
    paddingTop: 16,
    paddingBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EAF2FF',
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
