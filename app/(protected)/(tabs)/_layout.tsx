import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  Icon,
  Label,
  NativeTabs,
  VectorIcon
} from 'expo-router/unstable-native-tabs';
import React from 'react';
import {
  ColorValue,
  DynamicColorIOS,
  ImageSourcePropType,
  Platform,
} from 'react-native';

import { Colors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { isLiquidGlassAvailable } from 'expo-glass-effect';

type VectorIconFamily = {
  getImageSource: (
    name: string,
    size: number,
    color: ColorValue
  ) => Promise<ImageSourcePropType>;
};

// Ensure the native tab navigator opens on the Main tab
export const unstable_settings = {
  initialRouteName: 'Main',
};

export default function TabLayout() {
  const tintColor = useThemeColor({}, 'tint');
  const inactiveTintColor = useThemeColor({}, 'tabIconDefault');
  const labelSelectedStyle = Platform.OS === 'ios' ? { color: tintColor } : undefined;
  
  return (
    <NativeTabs
      badgeBackgroundColor={tintColor}
      labelStyle={{
        color:
          Platform.OS === 'ios' && isLiquidGlassAvailable()
            ? DynamicColorIOS({
                light: Colors.light.text,
                dark: Colors.dark.text,
              })
            : inactiveTintColor,
      }}
      iconColor={
        Platform.OS === 'ios' && isLiquidGlassAvailable()
          ? DynamicColorIOS({
              light: Colors.light.text,
              dark: Colors.dark.text,
            })
          : inactiveTintColor
      }
      tintColor={
        Platform.OS === 'ios'
          ? DynamicColorIOS({
              light: Colors.light.tint,
              dark: Colors.dark.tint,
            })
          : tintColor
      }
      labelVisibilityMode="labeled"
      indicatorColor={`${tintColor}25`}
      disableTransparentOnScrollEdge
    >
      <NativeTabs.Trigger name="Main">
        {Platform.select({
          ios: <Icon sf="house" selectedColor={tintColor} />,
          android: (
            <Icon
              src={
                <VectorIcon
                  family={MaterialCommunityIcons as VectorIconFamily}
                  name="home-outline"
                />
              }
              selectedColor={tintColor}
            />
          ),
        })}
        <Label selectedStyle={labelSelectedStyle}>Home</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="Explore">
        {Platform.select({
          ios: <Icon sf="paperplane" selectedColor={tintColor} />,
          android: (
            <Icon
              src={
                <VectorIcon
                  family={MaterialCommunityIcons as VectorIconFamily}
                  name="compass-outline"
                />
              }
              selectedColor={tintColor}
            />
          ),
        })}
        <Label selectedStyle={labelSelectedStyle}>Explore</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
