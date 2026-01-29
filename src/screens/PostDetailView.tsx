import { usePost } from '@/api/posts/RQuery';
import HeaderBackButton from '@/components/ui/complex/header/headerBackButton';
import { HeaderMain } from '@/components/ui/complex/header/headerMain';
import { SWText } from '@/components/ui/primitive/text';
import { globalStyle } from '@/constants/styles';
import { theme } from '@/constants/theme';
import { useLocalSearchParams } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PostDetailView() {
  const { postId } = useLocalSearchParams<{ postId?: string }>();
  const resolvedPostId = Array.isArray(postId) ? postId[0] : postId;
  const { data: post, isLoading } = usePost(resolvedPostId);

  if (!resolvedPostId) {
    return (
      <SafeAreaView style={[globalStyle.safeArea, styles.container]}>
        <HeaderMain>
          <HeaderBackButton />
          <SWText>Post</SWText>
          <View style={styles.headerSpacer} />
        </HeaderMain>
        <View style={styles.messageContainer}>
          <SWText>Post not found.</SWText>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading || !post) {
    return (
      <SafeAreaView style={[globalStyle.safeArea, styles.container]}>
        <HeaderMain>
          <HeaderBackButton />
          <SWText>Post</SWText>
          <View style={styles.headerSpacer} />
        </HeaderMain>
        <View style={styles.messageContainer}>
          <SWText>Loading...</SWText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[globalStyle.safeArea, styles.container]}>
      <HeaderMain>
        <HeaderBackButton />
        <SWText>Post</SWText>
        <View style={styles.headerSpacer} />
      </HeaderMain>
      <View style={styles.imageWrap}>
        <Image source={{ uri: post.photo }} style={styles.image} />
      </View>
      <View style={styles.meta}>
        <SWText>Visibility: {post.visibility}</SWText>
        <SWText>Taken at: {post.taken_at}</SWText>
        <SWText>
          Location: {post.lat}, {post.lng}
        </SWText>
      </View>
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
  imageWrap: {
    flex: 1,
    backgroundColor: theme.colorBlack,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  meta: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 6,
  },
  messageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
