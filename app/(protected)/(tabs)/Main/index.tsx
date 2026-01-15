import { useCurrentUserProfilePost } from '@/api/posts/RQuery';
import type { PostReponse, PostVisibility } from '@/api/posts/type';
import { HeaderMain } from '@/components/ui/complex/header/headerMain';
import { PillSelector } from '@/components/ui/primitive/pillSelector';
import { SWText } from '@/components/ui/primitive/text';
import { visibilityFilters } from '@/constants/filters';
import { globalStyle } from '@/constants/styles';
import { AppleMaps } from 'expo-maps';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const visibilityEntries = Object.entries(visibilityFilters) as [
    PostVisibility,
    string,
  ][];
  const options = visibilityEntries.map(([, icon]) => icon);
  const visibilityByIndex = visibilityEntries.map(([value]) => value);
  const [selected, setSelected] = useState(0);
  const [visibility, setVisibility] = useState<PostVisibility>('PU');
  const { data: postData } = useCurrentUserProfilePost({
    visibility: visibility,
    is_draft: false,
  });

  const posts = useMemo<PostReponse[]>(() => {
    if (!postData) return [];
    if (Array.isArray(postData)) return postData;
    return postData.results;
  }, [postData]);

  const markers = useMemo<AppleMaps.Marker[]>(() => {
    return posts.reduce<AppleMaps.Marker[]>((acc, post, index) => {
      const latitude = Number(post.lat);
      const longitude = Number(post.lng);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return acc;
      }
      const markerId = post.id ? String(post.id) : undefined;
      acc.push({
        id: markerId,
        coordinates: { latitude, longitude },
        title: post.taken_at,
      });
      return acc;
    }, []);
  }, [posts]);

  const handleMarkerClick = useCallback((marker: AppleMaps.Marker) => {
    if (!marker.id) return;
    router.push({
      pathname: '/Main/[postId]',
      params: { postId: marker.id },
    });
  }, []);

  return (
  <SafeAreaView style={[globalStyle.safeArea]}>
    <HeaderMain>
      <SWText style={globalStyle.leftBorder}>Sound Walk</SWText>
      <PillSelector 
        items={options}
        selectedIndex={selected}
        onChange={(index) => {
          setSelected(index);
          setVisibility(visibilityByIndex[index] ?? 'PU');
        }}
        containerStyle={globalStyle.rightBorder}
      />
    </HeaderMain>
    <AppleMaps.View
      style={{flex: 1}}
      markers={markers}
      onMarkerClick={handleMarkerClick}
    />
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
 
});
