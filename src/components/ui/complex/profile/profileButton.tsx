import { Button } from "../../primitive/button";
import { StyleSheet } from "react-native";

type ProfileButtonProps = {
  name: string;
  onPress: () => void;
};

export default function ProfileButton({ name, onPress }: ProfileButtonProps) {
  return (
    <Button variant="profile" onPress={onPress} style={styles.button}>
      {name}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 0,
  },
});
