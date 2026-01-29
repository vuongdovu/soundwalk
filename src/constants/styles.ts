import { StyleSheet } from "react-native";

export const globalStyle = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    leftBorder: {
        marginLeft: 16,
    },
    rightBorder: {
        marginRight: 16,
    },
    bottomBar: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingBottom: 70,
        gap: 12,
    },
})