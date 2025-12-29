import { globalStyle } from "@/constants/styles";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Action = { name: string, page: string }

type actionListProps = {
    actions: Action[]

}

export default function ActionList({actions}: actionListProps) {
    return(
    <SafeAreaView style={globalStyle.safeArea}>
      <ScrollView>

      </ScrollView>
    </SafeAreaView>
        
    );
}