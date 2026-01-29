import { Button } from '@/components/ui/primitive/button';
import { PillSelector } from '@/components/ui/primitive/pillSelector';
import { globalStyle } from '@/constants/styles';
import { usePermissions } from '@/context/PermissionContext';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { PermissionStatus } from 'expo-modules-core';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Camera,
    useCameraDevice,
    type CameraPosition,
    type PhysicalCameraDeviceType,
} from 'react-native-vision-camera';

const ULTRA_WIDE: PhysicalCameraDeviceType = 'ultra-wide-angle-camera';
const WIDE: PhysicalCameraDeviceType = 'wide-angle-camera';
const TELEPHOTO: PhysicalCameraDeviceType = 'telephoto-camera';

type CreateCameraProps = {
  onCapture: (
    photoUri: string,
    location: { lat: number; lng: number; accuracy_m: number } | null
  ) => void;
  isBusy?: boolean;
};

export default function CreateCamera({ onCapture, isBusy = false }: CreateCameraProps) {
  const [facing, setFacing] = useState<CameraPosition>('back');
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [zoom, setZoom] = useState(1);
  const { permissions, checkPermission, requestPermission, ensurePermission } = usePermissions();
  const cameraRef = useRef<Camera>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const zoomStartRef = useRef(0);
  const multiTouchRef = useRef(false);
  const backMultiDevice = useCameraDevice('back', {
    physicalDevices: [ULTRA_WIDE, WIDE, TELEPHOTO],
  });
  const backWideDevice = useCameraDevice('back', {
    physicalDevices: [WIDE],
  });
  const frontDevice = useCameraDevice('front');
  const device = facing === 'back' ? backMultiDevice ?? backWideDevice : frontDevice;
  const cameraStatus = permissions.camera;
  const hasCameraPermission = cameraStatus === PermissionStatus.GRANTED;
  const canZoomOut = device ? device.minZoom < device.neutralZoom : false;
  const zoomLabel = device ? `${zoom.toFixed(1)}x` : '1.0x';
  const neutralZoom = device?.neutralZoom ?? 1;
  const minZoom = device?.minZoom ?? 1;
  const isAtMinZoom = canZoomOut && Math.abs(zoom - minZoom) <= 0.08;
  const isAtNeutralZoom = Math.abs(zoom - neutralZoom) <= 0.08;
  const isAtFiveZoom = zoom >= 4.9;
  const zoomPills = canZoomOut
    ? ['.5x', '1x', zoom > 5 ? zoomLabel : '5x']
    : ['1x', zoom > 5 ? zoomLabel : '5x'];
  const zoomPillIndex = canZoomOut
    ? isAtMinZoom
      ? 0
      : isAtFiveZoom
        ? 2
        : 1
    : isAtFiveZoom
      ? 1
      : 0;

  useEffect(() => {
    checkPermission('camera');
  }, [checkPermission]);

  useEffect(() => {
    if (!device) return;
    setCameraReady(false);
    setZoom(device.neutralZoom);
  }, [device?.id]);

  if (!hasCameraPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={() => requestPermission('camera')}>
          grant permission
        </Button>
      </View>
    );
  }

  function toggleCameraFacing() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  function setZoomPreset(preset: '0.5' | '1' | '5') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    if (!device) return;
    if (preset === '0.5' && canZoomOut) {
      setZoom(device.minZoom);
      return;
    }
    if (preset === '5') {
      setZoom(Math.min(Math.min(device.maxZoom, 100), 5));
      return;
    }
    setZoom(device.neutralZoom);
  }

  function handleZoomPillChange(index: number) {
    if (canZoomOut) {
      if (index === 0) {
        setZoomPreset('0.5');
        return;
      }
      if (index === 2) {
        setZoomPreset('5');
        return;
      }
      setZoomPreset('1');
      return;
    }
    if (index === 1) {
      setZoomPreset('5');
      return;
    }
    setZoomPreset('1');
  }

  function toggleFlash() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    setFlash((current) => (current === 'off' ? 'on' : 'off'));
  }

  const pinchGesture = Gesture.Pinch()
    .onBegin(() => {
      zoomStartRef.current = zoom;
    })
    .onUpdate((event) => {
      if (!device) return;
      const nextZoom = Math.min(
        Math.min(device.maxZoom, 100),
        Math.max(device.minZoom, zoomStartRef.current * event.scale)
      );
      setZoom(nextZoom);
    })
    .runOnJS(true);

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .maxDelay(100)
    .maxDistance(12)
    .onTouchesDown((event) => {
      if (event.numberOfTouches > 1) {
        multiTouchRef.current = true;
      }
    })
    .onEnd(() => {
      if (multiTouchRef.current) {
        return;
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
      toggleCameraFacing();
    })
    .onFinalize(() => {
      multiTouchRef.current = false;
    })
    .runOnJS(true);

  const cameraGesture = Gesture.Simultaneous(pinchGesture, doubleTapGesture);

  async function getLocationSnapshot() {
    try {
      const hasPermission = await ensurePermission('location');
      if (!hasPermission) return null;
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.LocationAccuracy.Balanced,
      });
      return {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy_m: position.coords.accuracy ?? 0,
      };
    } catch (error) {
      console.warn('Failed to get location', error);
      return null;
    }
  }

  async function handleTakePicture() {
    if (!cameraRef.current || !cameraReady || isBusy) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    try {
      const locationPromise = getLocationSnapshot();
      const picture = await cameraRef.current.takePhoto({ flash });
      const photoUri = picture.path.startsWith('file://')
        ? picture.path
        : `file://${picture.path}`;
      const location = await locationPromise;
      onCapture(photoUri, location);
    } catch (error) {
      console.error('Failed to take picture', error);
    }
  }

  return (
    <View style={styles.root}>
      <GestureDetector gesture={cameraGesture}>
        <View style={styles.cameraLayer}>
          {device && (
            <Camera
              ref={cameraRef}
              style={styles.camera}
              device={device}
              zoom={zoom}
              isActive={hasCameraPermission}
              photo={true}
              onInitialized={() => setCameraReady(true)}
            />
          )}
        </View>
      </GestureDetector>
      <SafeAreaView pointerEvents="box-none" style={styles.overlay}>
        <View style={styles.topBar}>
          <View style={styles.topRightActions}>
            <TouchableOpacity style={styles.iconButton} onPress={toggleFlash}>
              <Ionicons
                name={flash === 'off' ? 'flash-off' : 'flash'}
                size={20}
                color="#FFFFFF"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={toggleCameraFacing}>
              <Ionicons name="camera-reverse" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={globalStyle.bottomBar}>
          <PillSelector
            items={zoomPills}
            selectedIndex={zoomPillIndex}
            onChange={(index) => handleZoomPillChange(index)}
            containerStyle={styles.zoomRow}
            pillStyle={styles.zoomPill}
            selectedPillStyle={styles.zoomPillSelected}
            textStyle={styles.zoomPillText}
            selectedTextStyle={styles.zoomPillTextSelected}
          />
          <TouchableOpacity
            style={styles.shutterButton}
            onPress={handleTakePicture}
            disabled={!cameraReady || isBusy}
          >
            <View style={styles.shutterInner} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
  cameraLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  topRightActions: {
    flexDirection: 'column',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  zoomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  zoomPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  zoomPillSelected: {
    borderColor: 'rgba(255, 255, 255, 0.9)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  zoomPillText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  zoomPillTextSelected: {
    color: '#000000',
  },
  shutterButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  message: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 16,
  },
});
