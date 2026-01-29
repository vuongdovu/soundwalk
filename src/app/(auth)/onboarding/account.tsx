import HeaderBackButton from '@/components/ui/complex/header/headerBackButton';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AccountOnboardingScreen() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');

  const isReady = fullName.trim().length > 0 && username.trim().length > 0;

  const handleNext = () => {
    router.push('/onboarding/profilePicture');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View pointerEvents="none" style={styles.glowTop} />
      <View pointerEvents="none" style={styles.glowBottom} />
      <View style={styles.container}>
        <HeaderBackButton />
        <View style={styles.header}>
          <Text style={styles.kicker}>Step 1 of 4</Text>
          <Text style={styles.title}>Account basics</Text>
          <Text style={styles.subtitle}>
            Set up your profile so people recognize you on Soundwalk.
          </Text>
        </View>

        <View style={styles.card}>
          <Input
            label="Full name"
            placeholder="Jane Doe"
            value={fullName}
            onChangeText={setFullName}
            autoComplete="name"
            textContentType="name"
            returnKeyType="next"
          />
          <Input
            label="Username"
            placeholder="janedoe"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
          />
          <Input
            label="Bio (optional)"
            placeholder="Tell people what you are into"
            value={bio}
            onChangeText={setBio}
            multiline
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, !isReady && styles.buttonDisabled]}
          activeOpacity={0.9}
          disabled={!isReady}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          You can update your profile details anytime in Settings.
        </Text>
      </View>
    </SafeAreaView>
  );
}

type InputProps = React.ComponentProps<typeof TextInput> & { label: string };

function Input({ label, multiline, style, ...props }: InputProps) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        multiline={multiline}
        placeholderTextColor="#94A3B8"
        style={[styles.input, multiline && styles.inputMultiline, style]}
      />
    </View>
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
    gap: 14,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    color: '#A7B8D6',
    fontFamily: 'Montserrat-SemiBold',
  },
  input: {
    backgroundColor: '#132A40',
    borderColor: '#1E3A5F',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#EAF2FF',
    fontSize: 15,
    fontFamily: 'Montserrat-Medium',
  },
  inputMultiline: {
    minHeight: 88,
    textAlignVertical: 'top',
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
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  },
  footerText: {
    color: '#7A8CA8',
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Montserrat-Medium',
  },
});
