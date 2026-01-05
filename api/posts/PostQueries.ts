import { apiClient } from "../apiClient";
import { PostEndpoints } from "./endpoints";
import { CreatePostRequest, PostReponse } from "./type";

interface PostService {
    createPost: (data: CreatePostRequest) => Promise<PostReponse>;
    listPost: () => Promise<PostReponse>;
    deletePost: (postId: string) => Promise<PostReponse>;
    updatePost: (postId: string) => Promise<PostReponse>;
    postRetrieve: (postId: string) => Promise<PostReponse>;
    partialUpdate: (postId: string) => Promise<PostReponse>;
}

const postService: PostService = {
  createPost: (data) =>
    apiClient<PostReponse>(PostEndpoints.createPost(data), { method: "POST", credentials: "include", body: JSON.stringify(data) }),
  listPost: () =>
    apiClient<PostReponse>(PostEndpoints.listPost(), { method: "GET", credentials: "include" }),
  deletePost: (postId) =>
    apiClient<PostReponse>(PostEndpoints.deletePost(postId), { method: "DELETE", credentials: "include" }),
  updatePost: (postId) =>
    apiClient<PostReponse>(PostEndpoints.updatePost(postId), { method: "PUT", credentials: "include" }),
  postRetrieve: (postId) =>
    apiClient<PostReponse>(PostEndpoints.postRetrieve(postId), { method: "GET", credentials: "include" }) ,
  partialUpdate: (postId) =>
    apiClient<PostReponse>(PostEndpoints.partialUpdate(postId), { method: "PATCH", credentials: "include" }),
};

export default postService;