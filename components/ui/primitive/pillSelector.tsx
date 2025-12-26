import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

type PillSelectorProps = {
  items: string[];
  selectedIndex?: number;
  defaultIndex?: number;
  onChange?: (index: number, value: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  pillStyle?: StyleProp<ViewStyle>;
  selectedPillStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  selectedTextStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
};

export function PillSelector({
  items,
  selectedIndex,
  defaultIndex = 0,
  onChange,
  containerStyle,
  pillStyle,
  selectedPillStyle,
  textStyle,
  selectedTextStyle,
  disabled = false,
}: PillSelectorProps) {
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'tabIconDefault');
  const textColor = useThemeColor({}, 'text');
  const selectedTextColor = useThemeColor(
    { light: '#FFFFFF', dark: '#0F1724' },
    'background'
  );

  const [internalIndex, setInternalIndex] = React.useState(() => {
    if (items.length === 0) {
      return -1;
    }
    const clamped = Math.min(Math.max(defaultIndex, 0), items.length - 1);
    return clamped;
  });

  React.useEffect(() => {
    if (selectedIndex !== undefined) {
      return;
    }
    if (items.length === 0) {
      setInternalIndex(-1);
      return;
    }
    if (internalIndex < 0 || internalIndex >= items.length) {
      setInternalIndex(0);
    }
  }, [items, internalIndex, selectedIndex]);

  if (items.length === 0) {
    return null;
  }

  const activeIndex =
    selectedIndex !== undefined ? selectedIndex : internalIndex;

  return (
    <View style={[styles.container, containerStyle]}>
      {items.map((item, index) => {
        const isSelected = index === activeIndex;
        const handlePress = () => {
          if (disabled) {
            return;
          }
          if (selectedIndex === undefined) {
            setInternalIndex(index);
          }
          onChange?.(index, item);
        };

        return (
          <Pressable
            key={`${item}-${index}`}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            onPress={handlePress}
            style={({ pressed }) => [
              styles.pill,
              {
                borderColor: isSelected ? tintColor : borderColor,
                backgroundColor: isSelected ? tintColor : 'transparent',
                opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
              },
              pillStyle,
              isSelected ? styles.pillSelected : null,
              isSelected ? selectedPillStyle : null,
            ]}
          >
            <Text
              style={[
                styles.pillText,
                { color: isSelected ? selectedTextColor : textColor },
                textStyle,
                isSelected ? selectedTextStyle : null,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export const pillSelector = PillSelector;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  pillSelected: {
    borderWidth: 1,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
