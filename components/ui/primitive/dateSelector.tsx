import { useMemo } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useThemeColor } from '@/hooks/use-theme-color';

export type DateRange = {
  startDate: Date;
  endDate: Date;
};

export type DateSelectorProps = {
  value: Date;
  weekStartsOn?: number;
  onChange: (range: DateRange) => void;
  disabled?: boolean;
  showTodayButton?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

const DAYS_IN_WEEK = 7;

function normalizeWeekStart(weekStartsOn: number) {
  const normalized = Math.trunc(weekStartsOn);
  return ((normalized % 7) + 7) % 7;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

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

function formatShortDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${month}/${day}/${year}`;
}

export default function DateSelector({
  value,
  weekStartsOn = 0,
  onChange,
  disabled = false,
  showTodayButton = true,
  containerStyle,
  labelStyle,
}: DateSelectorProps) {
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'tabIconDefault');
  const tintColor = useThemeColor({}, 'tint');

  const normalizedWeekStart = normalizeWeekStart(weekStartsOn);
  const range = useMemo(
    () => getWeekRange(value, normalizedWeekStart),
    [value, normalizedWeekStart],
  );

  const label = `${formatShortDate(range.startDate)} - ${formatShortDate(
    range.endDate,
  )}`;

  const handleShift = (direction: -1 | 1) => {
    if (disabled) {
      return;
    }
    const nextAnchor = addDays(range.startDate, direction * DAYS_IN_WEEK);
    onChange(getWeekRange(nextAnchor, normalizedWeekStart));
  };

  const handleToday = () => {
    if (disabled) {
      return;
    }
    onChange(getWeekRange(new Date(), normalizedWeekStart));
  };

  return (
    <View style={[styles.container, { borderColor }, containerStyle]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Previous week"
        onPress={() => handleShift(-1)}
        disabled={disabled}
        style={({ pressed }) => [
          styles.arrowButton,
          pressed && !disabled ? styles.pressed : null,
        ]}
      >
        <MaterialIcons name="chevron-left" size={20} color={tintColor} />
      </Pressable>
      <Text style={[styles.label, { color: textColor }, labelStyle]}>
        {label}
      </Text>
      <View style={styles.controls}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next week"
          onPress={() => handleShift(1)}
          disabled={disabled}
          style={({ pressed }) => [
            styles.arrowButton,
            pressed && !disabled ? styles.pressed : null,
          ]}
        >
          <MaterialIcons name="chevron-right" size={20} color={tintColor} />
        </Pressable>
        {showTodayButton ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go to current week"
            onPress={handleToday}
            disabled={disabled}
            style={({ pressed }) => [
              styles.todayButton,
              pressed && !disabled ? styles.pressed : null,
              disabled ? styles.disabled : null,
            ]}
          >
            <Text style={[styles.todayText, { color: tintColor }]}>Today</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  arrowButton: {
    padding: 6,
    borderRadius: 999,
  },
  todayButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  todayText: {
    fontSize: 12,
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.6,
  },
  disabled: {
    opacity: 0.5,
  },
});
