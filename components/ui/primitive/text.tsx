import { StyleSheet, Text, type TextProps } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

type SWTextProps = TextProps & {
  children: React.ReactNode;
  lightColor?: string;
  darkColor?: string;
  color?: string;
};

export function SWText({
  children,
  style,
  lightColor,
  darkColor,
  color,
  ...props
}: SWTextProps) {
  const themedColor = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text style={[styles.text, style, { color: color ?? themedColor }]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {},
});
