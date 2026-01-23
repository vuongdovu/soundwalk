import { ClusterParams, CreatePostRequest, PostParams } from "./type";

const base = () => "/api/v1/user-post/";
const data = (data: CreatePostRequest) => "/api/v1/user-post/";
const postById = (postId: string) => `/api/v1/user-post/${postId}/`;

const serializePostParams = (params?: PostParams) => {
  if (!params) return undefined;
  const entries = Object.entries(params).filter(([, value]) => value !== undefined);
  if (entries.length === 0) return undefined;
  return Object.fromEntries(entries.map(([key, value]) => [key, String(value)]));
};

const listPost = (params?: PostParams) => {
  const serialized = serializePostParams(params);
  if (!serialized) return "/api/v1/user-post/";
  const qs = new URLSearchParams(serialized).toString();
  return `/api/v1/user-post/?${qs}`;
};

const listClusterPost = (params: ClusterParams) => {
  const serialized = serializePostParams(params);
  if (!serialized) return "/api/v1/user-post/cluster/";
  const qs = new URLSearchParams(serialized).toString();
  return `/api/v1/user-post/cluster/?${qs}`;
}

export const PostEndpoints = {
  createPost: data,
  listPost: listPost,
  deletePost: postById,
  updatePost: postById,
  postRetrieve: postById,
  partialUpdate: postById,
  listClusterPost: listClusterPost, 
};
