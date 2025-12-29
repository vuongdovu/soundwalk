import HeaderBackButton from '@/components/ui/complex/header/headerBackButton';
import { Button } from '@/components/ui/primitive/button';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCallback } from 'react';

export default function AccountOnboardingScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isReady = useMemo(() => !!name.trim() && !!email.trim() && password.length >= 6, [
    name,
    email,
    password,
  ]);

  const handleNext = () => {
    
  }

  return (
    <SafeAreaView style={styles.safeArea}>
        <HeaderBackButton />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.kicker}>Step 1 of 2</Text>
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>
            Tell us who you are so we can personalize your experience.
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Full name"
            placeholder="Jane Doe"
            value={name}
            onChangeText={setName}
            autoComplete="name"
            textContentType="name"
            returnKeyType="next"
          />
          <Input
            label="Email"
            placeholder="name@email.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, !isReady && styles.buttonDisabled]}
          activeOpacity={0.9}
          disabled={!isReady}
          onPress={() => {router.push("/Main")}}
        >
          <Text style={styles.buttonText}>Create account</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          By continuing you agree to our Terms and acknowledge our Privacy Policy.
        </Text>

        <Button onClick={() => {handleNext()}>
          Next
        </Button>

      </View>
    </SafeAreaView>
  );
}

type InputProps = React.ComponentProps<typeof TextInput> & { label: string };

function Input({ label, ...props }: InputProps) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        placeholderTextColor="#94A3B8"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0C1B2A',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 24,
  },
  header: {
    gap: 8,
  },
  kicker: {
    color: '#7FB2FF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#EAF2FF',
  },
  subtitle: {
    fontSize: 15,
    color: '#C5D5ED',
    lineHeight: 20,
  },
  form: {
    gap: 14,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: '#A7B8D6',
  },
  input: {
    backgroundColor: '#12263A',
    borderColor: '#1E3A5F',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: '#EAF2FF',
    fontSize: 16,
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
    fontWeight: '700',
  },
  footerText: {
    color: '#7A8CA8',
    fontSize: 13,
    lineHeight: 18,
  },
});
