import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import postService from './PostQueries';
import { ClusterParams, ClusterPostListResponse, CreatePostRequest, PostListResponse, PostParams } from './type';

const DEFAULT_POST_PARAMS: PostParams = { is_draft: false };

export function useCurrentUserProfilePost(params?: PostParams) {
  const resolvedParams = params ?? DEFAULT_POST_PARAMS;
  return useQuery<PostListResponse>({
    queryKey: ['userPosts', resolvedParams],
    queryFn: async () => postService.listPost(resolvedParams),
  });
}

export function useInfiniteClusterPost(params?: ClusterParams) {
  return useInfiniteQuery<ClusterPostListResponse>({
    queryKey: ['clusterPosts', params],
    enabled: Boolean(params?.h3_index),
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      if (!params?.h3_index) {
        throw new Error('h3_index is required to load cluster posts');
      }
      const page = typeof pageParam === 'number' ? pageParam : 1;
      return postService.listClusterPost({ ...params, page });
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage || Array.isArray(lastPage)) return undefined;
      if (!lastPage.next) return undefined;
      const match = lastPage.next.match(/[?&]page=(\d+)/);
      return match ? Number(match[1]) : undefined;
    },
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
