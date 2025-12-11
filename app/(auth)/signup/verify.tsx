import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import HeaderBackButton from '@/components/ui/headerbuttons/headerBackButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { selectSession } from '@/state/selectors/sessionSelectors';
import { useDispatch } from 'react-redux';
import { setSession } from '@/state/slices/sessionSlice';

export default function VerifyScreen() {
  const dispatch = useDispatch();

  const [phone, setPhone] = useState('');
  
  // depending on what backend return you will set the session in redux or not,
  // or take you to onboarding
  const handleSubmit = () => {
    dispatch(setSession({token: phone}))
    router.push("/(auth)/onboarding/account")
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBackButton />
      <View style={styles.container}>
        <Text style={styles.title}>Verify your phone</Text>
        <Text style={styles.subtitle}>Enter your number to sign in</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone number</Text>
          <View style={styles.inputRow}>
            <Text style={styles.prefix}>+1</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="(555) 123-4567"
              placeholderTextColor="#94A3B8"
              style={styles.input}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} activeOpacity={0.9} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Send code</Text>
        </TouchableOpacity>
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
  prefix: {
    color: '#EAF2FF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
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
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
