import React, { useCallback, useMemo } from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

type HalfSheetModalProps = {
  children: React.ReactNode;
  snapPoints?: Array<number | string>;
  onChange?: (index: number) => void;
  onDismiss?: () => void;
  enablePanDownToClose?: boolean;
  enableDynamicSizing?: boolean;
  closeOnBackdropPress?: boolean;
  sheetStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

export const HalfSheetModal = React.forwardRef<BottomSheetModal, HalfSheetModalProps>(
  (
    {
      children,
      snapPoints,
      onChange,
      onDismiss,
      enablePanDownToClose = true,
      enableDynamicSizing = false,
      closeOnBackdropPress = true,
      sheetStyle,
      contentStyle,
    },
    ref,
  ) => {
    const memoSnapPoints = useMemo(() => snapPoints ?? ['50%'], [snapPoints]);
    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior={closeOnBackdropPress ? 'close' : 'none'}
        />
      ),
      [closeOnBackdropPress],
    );

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={memoSnapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={enablePanDownToClose}
        enableDynamicSizing={enableDynamicSizing}
        onChange={onChange}
        onDismiss={onDismiss}
        backgroundStyle={[styles.sheet, sheetStyle]}
        handleIndicatorStyle={styles.handle}
      >
        <BottomSheetView style={[styles.content, contentStyle]}>
          {children}
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

HalfSheetModal.displayName = 'HalfSheetModal';

const styles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  handle: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  content: {
    padding: 16,
  },
});
