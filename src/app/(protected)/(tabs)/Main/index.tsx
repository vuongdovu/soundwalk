import { useCurrentUserProfilePost } from '@/api/posts/RQuery';
import type { ClusterInfo, PostReponse, PostVisibility } from '@/api/posts/type';
import { HeaderMain } from '@/components/ui/complex/header/headerMain';
import DateSelector from '@/components/ui/primitive/dateSelector';
import { PillSelector } from '@/components/ui/primitive/pillSelector';
import { SWText } from '@/components/ui/primitive/text';
import { visibilityFilters } from '@/constants/filters';
import { globalStyle } from '@/constants/styles';
import { AppleMaps } from 'expo-maps';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type DateRange = {
  startDate: Date;
  endDate: Date;
};

const WEEK_STARTS_ON = 0;

function getWeekRange(anchor: Date, weekStartsOn: number): DateRange {
  const start = new Date(anchor);
  const day = start.getDay();
  const offset = (day - weekStartsOn + 7) % 7;
  start.setDate(start.getDate() - offset);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { startDate: start, endDate: end };
}

export default function HomeScreen() {
  const visibilityEntries = Object.entries(visibilityFilters) as [
    PostVisibility,
    string,
  ][];
  const options = visibilityEntries.map(([, icon]) => icon);
  const visibilityByIndex = visibilityEntries.map(([value]) => value);
  const [selected, setSelected] = useState(0);
  const [visibility, setVisibility] = useState<PostVisibility>('PU');
  const [resolution, setResolution] = useState<number>(6);
  const [dateRange, setDateRange] = useState<DateRange>(() =>
    getWeekRange(new Date(), WEEK_STARTS_ON),
  );

  const { data: postData } = useCurrentUserProfilePost({
    visibility: visibility,
    is_draft: false,
    start_date: dateRange.startDate.toISOString(),
    end_date: dateRange.endDate.toISOString(),
    resolution: resolution
  });

  function getResolution(zoom?: number) {
    if (typeof zoom !== 'number' || Number.isNaN(zoom)) return resolution;
    if (zoom >= 0 && zoom < 5) return 4; //state
    if (zoom >= 5 && zoom < 10) return 6; //city
    if (zoom >= 10 && zoom < 15) return 9; //address
    if (zoom >= 15 && zoom < 21) return 0; //exact coords
    return resolution;
  }

  const items = useMemo<Array<PostReponse | ClusterInfo>>(() => {
    if (!postData) return [];
    if (Array.isArray(postData)) return postData;
    if ('results' in postData) return postData.results;
    if ('clusters' in postData) return postData.clusters;
    return [];
  }, [postData]);

  const markers = useMemo<AppleMaps.Marker[]>(() => {
    return items.reduce<AppleMaps.Marker[]>((acc, item) => {
      const latitude = Number(item.lat);
      const longitude = Number(item.lng);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return acc;
      }
      const isCluster = 'h3_index' in item;
      const markerId = isCluster
        ? String(item.h3_index)
        : item.id
          ? String(item.id)
          : undefined;
      acc.push({
        id: markerId,
        coordinates: { latitude, longitude },
        title: isCluster ? String(item.count) : item.taken_at,
      });
      return acc;
    }, []);
  }, [items]);

  const handleMarkerClick = useCallback((marker: AppleMaps.Marker) => {
    if (!marker.id) return;
    if (resolution > 0) {
      router.push({
        pathname: '/Main/cluster/[clusterId]',
        params: { clusterId: marker.id, resolution: resolution },
      });
      return;
    } 

    router.push({
      pathname: '/Main/post/[postId]',
      params: { postId: marker.id },
    });
  }, [resolution]);

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
    <View style={styles.mapContainer}>
      <AppleMaps.View
        onCameraMove={({ zoom }) => {
          const nextResolution = getResolution(zoom);
          setResolution(nextResolution);
        }}
        style={styles.map}
        markers={markers}
        onMarkerClick={handleMarkerClick}
      />
      <View style={styles.dateOverlay}>
        <DateSelector
          value={dateRange.startDate}
          weekStartsOn={WEEK_STARTS_ON}
          onChange={setDateRange}
        />
      </View>
    </View>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  dateOverlay: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 72,
    zIndex: 1,
  },
});
