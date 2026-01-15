import { useCreatePost } from '@/api/posts/RQuery';
import type { CreatePostRequest, PostVisibility } from '@/api/posts/type';
import { ConfirmPost } from '@/components/ui/complex/create/ConfirmPost';
import { Button } from '@/components/ui/primitive/button';
import { visibilityFilters } from '@/constants/filters';
import { globalStyle } from '@/constants/styles';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useRef } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const visibilityKeys = Object.keys(visibilityFilters) as PostVisibility[];

export default function DraftPost() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { mutate: createPost, isPending } = useCreatePost();
  const params = useLocalSearchParams<{
    photoUri?: string;
    lat?: string;
    lng?: string;
    accuracy_m?: string;
  }>();
  const photoUri = Array.isArray(params.photoUri)
    ? params.photoUri[0]
    : params.photoUri;
  const latParam = Array.isArray(params.lat) ? params.lat[0] : params.lat;
  const lngParam = Array.isArray(params.lng) ? params.lng[0] : params.lng;
  const accuracyParam = Array.isArray(params.accuracy_m)
    ? params.accuracy_m[0]
    : params.accuracy_m;
  const lat = latParam ? Number(latParam) : 0;
  const lng = lngParam ? Number(lngParam) : 0;
  const accuracy_m = accuracyParam ? Number(accuracyParam) : 0;
  const safeLat = Number.isFinite(lat) ? lat : 0;
  const safeLng = Number.isFinite(lng) ? lng : 0;
  const safeAccuracy = Number.isFinite(accuracy_m) ? accuracy_m : 0;

  if (!photoUri) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.message}>No photo found. Please take a photo again.</Text>
        <Button onPress={() => router.back()}>Go Back</Button>
      </SafeAreaView>
    );
  }

  const buildPayload = useCallback(
    (isDraft: boolean, visibility: PostVisibility): CreatePostRequest => ({
      photo: photoUri,
      visibility,
      taken_at: new Date().toISOString(),
      is_draft: isDraft,
      lat: safeLat,
      lng: safeLng,
      accuracy_m: safeAccuracy,
    }),
    [photoUri, safeLat, safeLng, safeAccuracy],
  );

  const handleSaveDraft = useCallback(() => {
    const payload = buildPayload(true, visibilityKeys[0]);
    createPost(payload, {
      onSuccess: () => {
        router.back();
      },
    });
  }, [buildPayload, createPost]);

  const handlePostPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleConfirmPost = useCallback((visibilityIndex: number) => {
    const visibility = visibilityKeys[visibilityIndex] ?? visibilityKeys[0];
    const payload = buildPayload(false, visibility);
    createPost(payload, {
      onSuccess: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
        bottomSheetModalRef.current?.dismiss();
        useCreatePost();
        router.back();
      },
    });
  }, [buildPayload, createPost]);

  const handleConfirmDismiss = useCallback(() => {}, []);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.preview}>
          <Image source={{ uri: photoUri }} style={styles.image} />
        </View>
        <View style={globalStyle.bottomBar}>
          <Button variant="secondary" onPress={handleSaveDraft} disabled={isPending}>
            Save Draft
          </Button>
          <Button onPress={handlePostPress} disabled={isPending}>
            Post
          </Button>
        </View>
      </SafeAreaView>

      <ConfirmPost
        ref={bottomSheetModalRef}
        onConfirm={handleConfirmPost}
        onDismiss={handleConfirmDismiss}
        isPending={isPending}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  preview: {
    flex: 1,
    backgroundColor: '#000000',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  actions: {
    padding: 16,
    gap: 12,
    paddingBottom: 24,
  },
  message: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    padding: 24,
  },
});
