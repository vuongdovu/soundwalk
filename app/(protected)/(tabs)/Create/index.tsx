import { useCreatePost } from '@/api/posts/RQuery';
import type { CreatePostRequest } from '@/api/posts/type';
import { Button } from '@/components/ui/primitive/button';
import { usePermissions } from '@/context/PermissionContext';
import { CameraType, CameraView } from 'expo-camera';
import { PermissionStatus } from 'expo-modules-core';
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CreatePage() {
  const [facing, setFacing] = useState<CameraType>('back');
  const { permissions, checkPermission, requestPermission } = usePermissions();
  const { mutate: createPost, isPending } = useCreatePost();
  const cameraRef = useRef<CameraView | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const cameraStatus = permissions.camera;
  const hasCameraPermission = cameraStatus === PermissionStatus.GRANTED;
console.log(permissions)
  useEffect(() => {
    checkPermission('camera');
  }, []);

  if (!hasCameraPermission) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={() => requestPermission('camera')}>
          grant permission
        </Button>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function handleTakePicture() {
    if (!cameraRef.current || !cameraReady || isPending) return;

    try {
      const picture = await cameraRef.current.takePictureAsync();
      const payload: CreatePostRequest = {
        photo: picture.uri,
        visibility: "public",
        taken_at: new Date().toISOString(),
        is_draft: false,
        lat: 0,
        lng: 0,
        accuracy_m: 0,
      };
      createPost(payload);
    } catch (error) {
      console.error("Failed to take picture", error);
    }
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        onCameraReady={() => setCameraReady(true)}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.captureButton]}
          onPress={handleTakePicture}
          disabled={!cameraReady || isPending}
        >
          <Text style={styles.text}>Take Photo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 64,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    paddingHorizontal: 64,
    gap: 16,
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  captureButton: {
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
