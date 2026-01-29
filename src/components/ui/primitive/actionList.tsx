import ProfileButton from "@/components/ui/complex/profile/profileButton";
import type { Href } from "expo-router";
import { router } from "expo-router";
import { StyleSheet, type StyleProp, View, type ViewStyle } from "react-native";

export type Action = { name: string; page: Href };

type ActionListProps = {
  actions: Action[];
  style?: StyleProp<ViewStyle>;
};

export default function ActionList({ actions, style }: ActionListProps) {
  return (
    <View style={[styles.list, style]}>
      {actions.map((action) => (
        <ProfileButton
          key={`${action.name}-${String(action.page)}`}
          name={action.name}
          onPress={() => {
            router.push(action.page);
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
  },
});
