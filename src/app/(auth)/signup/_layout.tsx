// import { Stack } from "expo-router";
// import { StatusBar } from "expo-status-bar";

// export default function AuthLayout() {
//     return (
//         <>
//             <StatusBar />
//             <Stack
//                 screenOptions={{
//                     headerShown: false,
//                     animation: "slide_from_right",
//                     animationDuration: 200,
//                     gestureEnabled: false, // Disable swipe back gestures
//                 }}
//             >
//                 <Stack.Screen name="signup" />
//             </Stack>

//         </>
//     );
// }

import { Stack } from 'expo-router'

const StackLayout = () => {
    return <Stack screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
    }}/>
}


export default StackLayout