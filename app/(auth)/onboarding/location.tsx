import { Button } from "@/components/ui/primitive/button";
import { usePermissions } from "@/context/PermissionContext";
import { View } from "react-native";

export default function LocationPermission() {
    const permission = usePermissions();



    return(
        <View>
            <Button
                onPress={() => {permission.ensurePermission("location")}}
            >
                Enable Location
            </Button>
        </View>
    );
}
