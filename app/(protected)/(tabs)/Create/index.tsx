import { useCreatePost } from '@/api/posts/RQuery';
import type { CreatePostRequest } from '@/api/posts/type';
import CreateCamera from '@/components/ui/complex/create/CreateCamera';

export default function CreatePage() {
  const { mutate: createPost, isPending } = useCreatePost();

  function handleCapture(photoUri: string) {
    const payload: CreatePostRequest = {
      photo: photoUri,
      visibility: 'public',
      taken_at: new Date().toISOString(),
      is_draft: false,
      lat: 0,
      lng: 0,
      accuracy_m: 0,
    };
    createPost(payload);
  }

  return <CreateCamera onCapture={handleCapture} isBusy={isPending} />;
}
