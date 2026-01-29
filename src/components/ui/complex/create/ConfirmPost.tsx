import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

import { HalfSheetModal } from '@/components/ui/primitive/halfSheetModal';
import { visibilityFilters } from '@/constants/filters';
import { PillSelector } from '../../primitive/pillSelector';
type ConfirmPostProps = {
  onConfirm: (visibilityIndex: number) => void;
  onDismiss?: () => void;
  isPending?: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
};

const THUMB_SIZE = 52;
const TRACK_PADDING = 4;
const CONFIRM_THRESHOLD = 0.85;
const options = Object.values(visibilityFilters);

export const ConfirmPost = React.forwardRef<BottomSheetModal, ConfirmPostProps>(
  (
    {
      onConfirm,
      onDismiss,
      isPending = false,
      title = 'Ready to post?',
      description = 'Slide to confirm posting this photo.',
      confirmLabel = 'Slide to post',
    },
    ref,
  ) => {
    const translateX = useSharedValue(0);
    const maxTranslateX = useSharedValue(0);
    const startX = useSharedValue(0);
    const isLocked = useSharedValue(false);
    const [selected, setSelected] = useState(0);

    const handleTrackLayout = useCallback(
      (event: { nativeEvent: { layout: { width: number } } }) => {
        const width = event.nativeEvent.layout.width;
        const maxValue = Math.max(width - THUMB_SIZE - TRACK_PADDING * 2, 0);
        maxTranslateX.value = maxValue;
        if (translateX.value > maxValue) {
          translateX.value = maxValue;
        }
      },
      [maxTranslateX, translateX],
    );

    const resetSlider = useCallback(() => {
      isLocked.value = false;
      translateX.value = 0;
    }, [isLocked, translateX]);

    const handleDismiss = useCallback(() => {
      resetSlider();
      onDismiss?.();
    }, [onDismiss, resetSlider]);

    const handleConfirm = useCallback(() => {
      if (isPending) {
        return;
      }
      onConfirm(selected);
    }, [isPending, onConfirm, selected]);

    const panGesture = Gesture.Pan()
      .enabled(!isPending)
      .onBegin(() => {
        startX.value = translateX.value;
      })
      .onUpdate((event) => {
        if (isLocked.value) {
          return;
        }
        const nextValue = Math.min(
          Math.max(startX.value + event.translationX, 0),
          maxTranslateX.value,
        );
        translateX.value = nextValue;
      })
      .onEnd(() => {
        if (isLocked.value || maxTranslateX.value <= 0) {
          return;
        }
        if (translateX.value >= maxTranslateX.value * CONFIRM_THRESHOLD) {
          isLocked.value = true;
          translateX.value = withTiming(maxTranslateX.value);
          runOnJS(handleConfirm)();
          return;
        }
        translateX.value = withTiming(0);
      });

    const thumbStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
    }));

    const fillStyle = useAnimatedStyle(() => ({
      width: translateX.value + THUMB_SIZE * 0.5,
    }));

    return (
      <HalfSheetModal ref={ref} onDismiss={handleDismiss}>
        <View style={styles.container}>
          <View style={styles.textBlock}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
          <PillSelector 
            items={options}
            selectedIndex={selected}
            onChange={(index) => setSelected(index)}
            // containerStyle={globalStyle.rightBorder}
          />
          <View style={styles.sliderTrack} onLayout={handleTrackLayout}>
            <Animated.View style={[styles.sliderFill, fillStyle]} />
            <Text style={styles.sliderLabel}>
              {isPending ? 'Posting...' : confirmLabel}
            </Text>
            <GestureDetector gesture={panGesture}>
              <Animated.View style={[styles.sliderThumb, thumbStyle]}>
                <Text style={styles.thumbText}>{isPending ? '' : '>'}</Text>
              </Animated.View>
            </GestureDetector>
          </View>
        </View>
      </HalfSheetModal>
    );
  },
);

ConfirmPost.displayName = 'ConfirmPost';

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  textBlock: {
    gap: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
  },
  description: {
    fontSize: 14,
    color: '#475569',
  },
  sliderTrack: {
    height: 56,
    borderRadius: 999,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    padding: TRACK_PADDING,
    overflow: 'hidden',
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#C7D2FE',
  },
  sliderLabel: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  sliderThumb: {
    position: 'absolute',
    left: TRACK_PADDING,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 999,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
