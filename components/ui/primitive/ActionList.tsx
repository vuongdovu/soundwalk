import ProfileButton from "@/components/ui/complex/profile/profileButton";
import { globalStyle } from "@/constants/styles";
import type { Href } from "expo-router";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

type Action = { name: string; page: Href };

type ActionListProps = {
  actions: Action[];
};

export default function ActionList({ actions }: ActionListProps) {
  return (
    <SafeAreaView style={globalStyle.safeArea}>
      {actions.map((action) => (
        <ProfileButton
          key={`${action.name}-${String(action.page)}`}
          name={action.name}
          onPress={() => {
            router.push(action.page);
          }}
        />
      ))}
    </SafeAreaView>
  );
}
