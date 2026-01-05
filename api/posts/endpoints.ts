import { CreatePostRequest } from "./type";

const base = () => "/api/v1/user-post/";
const data = (data: CreatePostRequest) => "/api/v1/user-post/";
const postById = (postId: string) => `/api/v1/user-post/${postId}/`;

export const PostEndpoints = {
  createPost: data,
  listPost: base,
  deletePost: postById,
  updatePost: postById,
  postRetrieve: postById,
  partialUpdate: postById
};