import HeaderBackButton from '@/components/ui/complex/header/headerBackButton';
import { usePermissions } from '@/context/PermissionContext';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfilePictureOnboarding() {
  const permission = usePermissions();
  const [hasPhoto, setHasPhoto] = useState(false);

  const handleTakePhoto = async () => {
    const granted = await permission.ensurePermission('camera', {
      openSettingsOnDeny: true,
    });
    if (granted) {
      setHasPhoto(true);
    }
  };

  const handleUpload = () => {
    setHasPhoto(true);
  };

  const handleNext = () => {
    router.push('/onboarding/location');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View pointerEvents="none" style={styles.glowTop} />
      <View pointerEvents="none" style={styles.glowBottom} />
      <View style={styles.container}>
        <HeaderBackButton />
        <View style={styles.header}>
          <Text style={styles.kicker}>Step 2 of 4</Text>
          <Text style={styles.title}>Add a profile photo</Text>
          <Text style={styles.subtitle}>
            A clear photo helps friends spot you faster.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={[styles.avatar, hasPhoto && styles.avatarReady]}>
            <View style={styles.avatarInner} />
          </View>
          <Text style={styles.avatarText}>
            {hasPhoto ? 'Photo ready' : 'Tap to add a photo'}
          </Text>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryAction]}
              activeOpacity={0.9}
              onPress={handleTakePhoto}
            >
              <Text style={styles.actionButtonText}>Take photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryAction]}
              activeOpacity={0.9}
              onPress={handleUpload}
            >
              <Text style={styles.secondaryActionText}>Upload</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.button} activeOpacity={0.9} onPress={handleNext}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.link} activeOpacity={0.9} onPress={handleNext}>
          <Text style={styles.linkText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B1726',
  },
  glowTop: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#2563EB',
    opacity: 0.2,
    top: -80,
    right: -60,
  },
  glowBottom: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#0EA5E9',
    opacity: 0.18,
    bottom: -140,
    left: -90,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 24,
  },
  header: {
    gap: 8,
  },
  kicker: {
    color: '#7FB2FF',
    fontSize: 12,
    letterSpacing: 1,
    fontFamily: 'Montserrat-SemiBold',
  },
  title: {
    fontSize: 26,
    color: '#EAF2FF',
    fontFamily: 'Montserrat-Bold',
  },
  subtitle: {
    fontSize: 15,
    color: '#C5D5ED',
    lineHeight: 20,
    fontFamily: 'Montserrat-Medium',
  },
  card: {
    backgroundColor: '#0F2438',
    borderColor: '#1E3A5F',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: '#132A40',
    borderColor: '#1E3A5F',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarReady: {
    borderColor: '#4F8EF7',
    shadowColor: '#4F8EF7',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  avatarInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4F8EF7',
  },
  avatarText: {
    fontSize: 14,
    color: '#C5D5ED',
    fontFamily: 'Montserrat-Medium',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryAction: {
    backgroundColor: '#4F8EF7',
  },
  secondaryAction: {
    backgroundColor: '#12263A',
    borderColor: '#1E3A5F',
    borderWidth: 1,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
  },
  secondaryActionText: {
    color: '#C5D5ED',
    fontSize: 14,
    fontFamily: 'Montserrat-SemiBold',
  },
  button: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: '#4F8EF7',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  },
  link: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  linkText: {
    color: '#9FB9FF',
    fontSize: 14,
    fontFamily: 'Montserrat-SemiBold',
  },
});
