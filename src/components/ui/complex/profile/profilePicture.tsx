import { Image, StyleSheet, TouchableOpacity } from "react-native";

type ProfilePictureProps = {
  profilePictureUrl?: string;
};

export default function ProfilePicture({ profilePictureUrl }: ProfilePictureProps) {
  const uri = profilePictureUrl?.trim();

  return (
    <TouchableOpacity>
      <Image source={uri ? { uri } : require("@/assets/images/default-profile.png")} style={styles.image} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  image: { width: 120, height: 120, borderRadius: 60 },
});
