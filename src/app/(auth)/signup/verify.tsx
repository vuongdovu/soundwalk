import HeaderBackButton from '@/components/ui/complex/header/headerBackButton';
import {
  getAuth,
  signInWithPhoneNumber,
} from '@react-native-firebase/auth';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, UIManager, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VerifyScreen() {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<any>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [phoneSubmitting, setPhoneSubmitting] = useState(false);
  const [codeSubmitting, setCodeSubmitting] = useState(false);

  useEffect(() => {
    if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const handleSendCode = async () => {
    setFeedback(null);
    if (!phoneNumber) {
      setFeedback("Enter your phone number.");
      return;
    }

    setPhoneSubmitting(true);
    try {
      const confirmation = await signInWithPhoneNumber(getAuth(), phoneNumber);
      setConfirm(confirmation);
      setFeedback("Verification code sent.");
    } catch (error: any) {
      const message = error instanceof Error ? error.message : "Unable to send code.";
      setFeedback(message);
    } finally {
      setPhoneSubmitting(false);
    }
  };

  const handleConfirmCode = async () => {
    if (!confirm) return;
    if (!code) {
      setFeedback("Enter the verification code.");
      return;
    }

    setCodeSubmitting(true);
    try {
      await confirm.confirm(code);
      setFeedback("Phone verified.");
      router.push("/onboarding/account");
    } catch (error: unknown) {
      console.log(error)
      const message = error instanceof Error ? error.message : "Invalid code.";
      setFeedback(message);
    } finally {
      setCodeSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBackButton />
      <View style={styles.container}>
        <Text style={styles.title}>Verify your phone</Text>
        <Text style={styles.subtitle}>Enter your phone number to get a code.</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone number</Text>
          <View style={styles.inputRow}>
            <TextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              placeholder="+1 650-555-3434"
              placeholderTextColor="#94A3B8"
              style={styles.input}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, phoneSubmitting && styles.buttonDisabled]}
          activeOpacity={0.9}
          onPress={handleSendCode}
          disabled={phoneSubmitting}
        >
          <Text style={styles.buttonText}>
            {phoneSubmitting ? "Sending code..." : "Send code"}
          </Text>
        </TouchableOpacity>

        {confirm && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Verification code</Text>
              <View style={styles.inputRow}>
                <TextInput
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  placeholder="Enter code"
                  placeholderTextColor="#94A3B8"
                  style={styles.input}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, codeSubmitting && styles.buttonDisabled]}
              activeOpacity={0.9}
              onPress={handleConfirmCode}
              disabled={codeSubmitting}
            >
              <Text style={styles.buttonText}>
                {codeSubmitting ? "Confirming..." : "Confirm code"}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {feedback && <Text style={styles.authMessage}>{feedback}</Text>}
      </View>
    </SafeAreaView>
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
    justifyContent: 'center',
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#EAF2FF',
  },
  subtitle: {
    fontSize: 15,
    color: '#C5D5ED',
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: '#A7B8D6',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#12263A',
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },
  input: {
    flex: 1,
    color: '#EAF2FF',
    fontSize: 16,
    paddingVertical: 14,
  },
  button: {
    marginTop: 8,
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
    opacity: 0.8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  authMessage: {
    color: '#F59E0B',
    fontSize: 14,
    marginTop: 8,
  },
  divider: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  sectionTitle: {
    marginTop: 16,
    fontSize: 14,
    color: '#C5D5ED',
    fontWeight: '600',
  },
});
