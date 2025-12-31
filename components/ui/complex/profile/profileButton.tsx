import { Button } from "../../primitive/button";

type ProfileButtonProps = {
  name: string;
  onPress: () => void;
};

export default function ProfileButton({ name, onPress }: ProfileButtonProps) {
  return (
    <Button variant="profile" onPress={onPress}>
      {name}
    </Button>
  );
}
