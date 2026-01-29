import HeaderBackButton from '@/components/ui/complex/header/headerBackButton';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationsOnboarding() {
  const handleContinue = () => {
    router.replace('/Main');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View pointerEvents="none" style={styles.glowTop} />
      <View pointerEvents="none" style={styles.glowBottom} />
      <View style={styles.container}>
        <HeaderBackButton />
        <View style={styles.header}>
          <Text style={styles.kicker}>Step 4 of 4</Text>
          <Text style={styles.title}>Stay in the loop</Text>
          <Text style={styles.subtitle}>
            Turn on notifications so you never miss a walk invite or update.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.bell}>
            <View style={styles.bellCore} />
          </View>
          <Text style={styles.cardTitle}>We will notify you about</Text>
          <Text style={styles.cardText}>
            - Friend invites and check-ins{'\n'}
            - Event reminders and last minute changes{'\n'}
            - Safety alerts on your route
          </Text>
        </View>

        <TouchableOpacity style={styles.button} activeOpacity={0.9} onPress={handleContinue}>
          <Text style={styles.buttonText}>Enable notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.9}
          onPress={handleContinue}
        >
          <Text style={styles.secondaryButtonText}>Not now</Text>
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
    gap: 12,
  },
  bell: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#132A40',
    borderColor: '#1E3A5F',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellCore: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4F8EF7',
  },
  cardTitle: {
    fontSize: 16,
    color: '#EAF2FF',
    fontFamily: 'Montserrat-SemiBold',
  },
  cardText: {
    fontSize: 14,
    color: '#C5D5ED',
    lineHeight: 20,
    fontFamily: 'Montserrat-Medium',
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
  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: '#12263A',
    borderColor: '#1E3A5F',
    borderWidth: 1,
  },
  secondaryButtonText: {
    color: '#C5D5ED',
    fontSize: 15,
    fontFamily: 'Montserrat-SemiBold',
  },
});
