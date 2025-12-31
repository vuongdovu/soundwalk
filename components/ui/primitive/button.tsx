import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

type Variant = "primary" | "secondary" | "ghost" | "profile";
type Size = "sm" | "md";

type ButtonProps = Omit<PressableProps, "style"> & {
  variant?: Variant;
  size?: Size;
  textStyle?: StyleProp<TextStyle>;
  style?: PressableProps["style"];
};

const variantStyles: Record<Variant, ViewStyle> = {
  primary: {
    backgroundColor: "#2563EB",
    shadowColor: "#1D4ED8",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  secondary: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderWidth: 1,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  profile: {
    flex: 1,
    width: "100%",
    alignItems: "flex-start",
    borderRadius: 12,
    borderColor: "#E2E8F0",
    borderWidth: 1,
    backgroundColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
};

const sizeStyles: Record<Size, ViewStyle> = {
  sm: { paddingVertical: 8, paddingHorizontal: 12 },
  md: { paddingVertical: 12, paddingHorizontal: 16 },
};

const textVariantStyles: Record<Variant, TextStyle> = {
  primary: { color: "#FFFFFF" },
  secondary: { color: "#0F172A" },
  ghost: { color: "#0F172A" },
  profile: { color: "#0F172A" },
};

const sizeTextStyles: Record<Size, TextStyle> = {
  sm: { fontSize: 14 },
  md: { fontSize: 16 },
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  disabled,
  style,
  textStyle,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      {...props}
      disabled={disabled}
      style={(state) => {
        const userStyle = typeof style === "function" ? style(state) : style;
        return [
          styles.base,
          sizeStyles[size],
          variantStyles[variant],
          state.pressed && styles.pressed,
          disabled && styles.disabled,
          userStyle,
        ];
      }}
    >
      {typeof children === "string" || typeof children === "number" ? (
        <Text
          style={[
            styles.textBase,
            sizeTextStyles[size],
            textVariantStyles[variant],
            textStyle,
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
  },
  pressed: {
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.6,
  },
  textBase: {
    fontWeight: "600",
  },
});
