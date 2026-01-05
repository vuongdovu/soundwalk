import { useCameraPermissions } from 'expo-camera';
import { useLocationPermissions } from 'expo-maps';
import { PermissionStatus } from 'expo-modules-core';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Alert, AppState, Linking } from 'react-native';

export type PermissionType = 'location' | 'camera' | 'microphone';

type PermissionState = {
  [key in PermissionType]?: PermissionStatus;
};

interface PermissionContextType {
    permissions: PermissionState;
    requestPermission: (type: PermissionType) => Promise<PermissionStatus>;
    checkPermission: (type: PermissionType) => Promise<PermissionStatus>;
    ensurePermission: (
        type: PermissionType,
        opts?: { openSettingsOnDeny?: boolean }
    ) => Promise<boolean>;
    requestMany: (types: PermissionType[]) => Promise<Record<PermissionType, PermissionStatus>>;
}

type ConsentRecord = {
  accepted?: boolean;
  dontAskAgain?: boolean;
  ts?: number;
};

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export function PermissionProvider({ children }: { children: React.ReactNode }) {
    const [permissions, setPermissions] = useState<PermissionState>({});
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [locationPermission, requestLocationPermission] = useLocationPermissions();

    const checkPermission = useCallback(async (type: PermissionType) => {
        try {
            if (type === 'camera') {
                const status = cameraPermission?.status ?? PermissionStatus.UNDETERMINED;
                setPermissions((prev) => ({ ...prev, camera: status }));
                return status;
            }
            if (type === 'location') {
                const status = locationPermission?.status ?? PermissionStatus.UNDETERMINED;
                setPermissions((prev) => ({ ...prev, location: status }));
                return status;
            }
        return PermissionStatus.UNDETERMINED;
        } catch (error) {
            console.error(`Error checking ${type} permission:`, error);
        }
        return PermissionStatus.UNDETERMINED;
    }, [cameraPermission, locationPermission]);

    const requestPermission = useCallback(async (type: PermissionType) => {
        try {
            if (type === 'camera') {
                const { status } = await requestCameraPermission();
                setPermissions((prev) => ({ ...prev, camera: status }));
                return status;
            }
        return PermissionStatus.UNDETERMINED;
        } catch (error) {
            console.error(`Error requesting ${type} permission:`, error);
        }
        return PermissionStatus.UNDETERMINED;
    }, []);
    
    const ensurePermission = useCallback(async (
        type: PermissionType,
        opts?: { openSettingsOnDeny?: boolean }
    ) => {
        const openSettingsOnDeny = opts?.openSettingsOnDeny ?? false;

        const current = await checkPermission(type);
        console.log(`[Permissions] Current status for ${type}:`, current);

        if (current === PermissionStatus.GRANTED) return true;

        const asked = await requestPermission(type);
        if (asked === PermissionStatus.GRANTED) return true;

        if (openSettingsOnDeny) {
            Alert.alert(
                `Permission Required for ${type}`,
                `Please enable this ${type} permission in Settings to continue.`,
                [
                    {
                        text: 'Cancel',
                        onPress: () => {},
                    },
                    {
                        text: 'Open Settings',
                        onPress: () => {
                            Linking.openSettings();
                        }
                    }
                ]
            );
        }
        return false;
    }, [checkPermission, requestPermission]);

    const requestMany = useCallback(async (types: PermissionType[]) => {
        const results = {} as Record<PermissionType, PermissionStatus>;
        for (const t of types) {
        results[t] = await requestPermission(t);
        }
        return results;
    }, [requestPermission]);

    // Initial check on mount
  useEffect(() => {
    checkPermission('camera');
  }, [checkPermission]);

  // Refresh when coming back to foreground
  useEffect(() => {
    const sub = AppState.addEventListener('change', s => {
      if (s !== 'active') return;;
      checkPermission('camera');
    });
    return () => sub.remove();
  }, [checkPermission]);

  const value = useMemo(
    () => ({
      permissions,
      requestPermission,
      checkPermission,
      ensurePermission,
      requestMany,
    }),
    [
      permissions,
      requestPermission,
      checkPermission,
      ensurePermission,
      requestMany,
    ]
  );

return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) throw new Error('usePermissions must be used within a PermissionProvider');
  return context;
};

//   Prominent Disclosure Modal (pre-permission)
    //   <Modal visible={disclosureVisible} transparent animationType="fade" onRequestClose={() => {}}>
    //     <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 }}>
    //       <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 20 }}>
    //         <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 8 }}>
    //           Allow background location?
    //         </Text>

    //         <Text style={{ marginBottom: 8 }}>
    //           Spot Social uses your location <Text style={{ fontWeight: '700' }}>even when the app is closed</Text> to
    //           show friends you’re at events and keep live rosters accurate.
    //         </Text>
    //         <Text style={{ marginBottom: 8 }}>
    //           We <Text style={{ fontWeight: '700' }}>do not</Text> use your location for advertising.
    //         </Text>
    //         <Text style={{ marginBottom: 16 }}>
    //           You can change this anytime in Settings.{' '}
    //           <Text
    //             style={{ color: '#2563eb', textDecorationLine: 'underline' }}
    //             onPress={() => Linking.openURL('https://spotsocial.app/privacy')}
    //           >
    //             Privacy Policy
    //           </Text>
    //         </Text>

    //         {Platform.OS === 'android' && (
    //           <Text style={{ fontSize: 12, color: '#4b5563', marginBottom: 12 }}>
    //             On Android, choose <Text style={{ fontWeight: '700' }}>"Allow all the time"</Text> to enable background updates.
    //           </Text>
    //         )}

    //         <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
    //           {/* Don't ask again */}
    //           <Pressable
    //             disabled={disclosureBusy}
    //             onPress={resolveDisclosureDontAskAgain}
    //             style={{ paddingVertical: 10, paddingHorizontal: 12, marginRight: 8 }}
    //           >
    //             <Text>Don’t ask again</Text>
    //           </Pressable>

    //           {/* Decline for now */}
    //           <Pressable
    //             disabled={disclosureBusy}
    //             onPress={() => resolveDisclosure(false)}
    //             style={{ paddingVertical: 10, paddingHorizontal: 12, marginRight: 8 }}
    //           >
    //             <Text>Not now</Text>
    //           </Pressable>

    //           {/* Accept */}
    //           <Pressable
    //             disabled={disclosureBusy}
    //             onPress={async () => {
    //               setDisclosureBusy(true);
    //               // We resolve(true) here; the actual OS dialogs are shown next by requestPermission('locationBg')
    //               await resolveDisclosure(true);
    //             }}
    //             style={{
    //               paddingVertical: 10,
    //               paddingHorizontal: 16,
    //               backgroundColor: '#111827',
    //               borderRadius: 8,
    //               opacity: disclosureBusy ? 0.7 : 1,
    //             }}
    //           >
    //             <Text style={{ color: 'white' }}>{disclosureBusy ? '...' : 'Allow & Continue'}</Text>
    //           </Pressable>
    //         </View>
    //       </View>
    //     </View>
    //   </Modal>