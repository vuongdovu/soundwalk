import { Image, StyleSheet } from "react-native";

type ProfilePictureProps = {
  profilePictureUrl?: string;
};

export default function ProfilePicture({ profilePictureUrl }: ProfilePictureProps) {
  const uri = profilePictureUrl?.trim();

  return <Image source={uri ? { uri } : require("@/assets/images/default-profile.png")} style={styles.image} />
}

const styles = StyleSheet.create({
  image: { width: 120, height: 120, borderRadius: 60 },
});
