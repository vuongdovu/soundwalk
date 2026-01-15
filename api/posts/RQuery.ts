import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import postService from './PostQueries';
import { CreatePostRequest, PostListResponse, PostParams } from './type';

const DEFAULT_POST_PARAMS: PostParams = { is_draft: false };

export function useCurrentUserProfilePost(params?: PostParams) {
  const resolvedParams = params ?? DEFAULT_POST_PARAMS;
  return useQuery<PostListResponse>({
    queryKey: ['userPosts', resolvedParams],
    queryFn: async () => postService.listPost(resolvedParams),
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

export function usePost(postId?: string) {
  return useQuery({
    queryKey: ['userPost', postId],
    queryFn: async () => postService.postRetrieve(postId ?? ''),
    enabled: Boolean(postId),
  });
}
