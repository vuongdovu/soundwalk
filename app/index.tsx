import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect the root path to the main tab
  return <Redirect href="/(auth)/signup" />;
}
