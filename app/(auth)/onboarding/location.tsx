import { Button } from "@/components/ui/primitive/button";
import { usePermissions } from "@/context/PermissionContext";
import { View } from "react-native";

export default function LocationPermission() {
    const permission = usePermissions();



    return(
        <View>
            <Button
                onClick={() => {permission.ensurePermission("location")}}
            >
                Enable Location
            </Button>
        </View>
    );
}