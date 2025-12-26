import { HeaderButton } from "./HeaderButtons";
import { router } from "expo-router";

export default function HeaderBackButton() {
    return( 
        <HeaderButton
          imageProps={{ systemName: "chevron.backward" }}
          onPress={() => {router.back()}}
        />
    )
}
