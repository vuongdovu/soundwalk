import { StyleSheet, View } from "react-native";

export function HeaderMain({children}: {children: React.ReactNode}) {
    return (
        <View style={style.container}>
            {children}
        </View>  
    );
}

const style = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    }
})
