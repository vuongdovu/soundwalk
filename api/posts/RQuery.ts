import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import postService from './PostQueries';
import { CreatePostRequest } from './type';

export function useCurrentUserProfile() {
    return useQuery({
    queryKey: ['userPosts'],
    queryFn: async () => postService.listPost(),
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostRequest) => postService.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });
}
