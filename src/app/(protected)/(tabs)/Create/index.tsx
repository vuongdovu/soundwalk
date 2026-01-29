import CreateCamera from '@/components/ui/complex/create/CreateCamera';
import { router } from 'expo-router';

export default function CreatePage() {
  function handleCapture(
    photoUri: string,
    location: { lat: number; lng: number; accuracy_m: number } | null
  ) {
    const params: Record<string, string> = { photoUri };
    if (location) {
      params.lat = `${location.lat}`;
      params.lng = `${location.lng}`;
      params.accuracy_m = `${location.accuracy_m}`;
    }
    router.push({
      pathname: '/Create/draftPost',
      params,
    });
  }

  return <CreateCamera onCapture={handleCapture} />;
}
