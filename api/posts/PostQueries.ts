import { apiClient } from "../apiClient";
import { PostEndpoints } from "./endpoints";
import { CreatePostRequest, PostListResponse, PostParams, PostReponse } from "./type";

function guessImageType(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext === "png") return "image/png";
  if (ext === "heic") return "image/heic";
  return "image/jpeg";
}

function buildPostFormData(data: CreatePostRequest) {
  const formData = new FormData();
  const filename = data.photo.split("/").pop() ?? "photo.jpg";
  formData.append("photo", {
    uri: data.photo,
    name: filename,
    type: guessImageType(filename),
  } as any);
  formData.append("visibility", data.visibility);
  formData.append("taken_at", data.taken_at);
  formData.append("is_draft", String(data.is_draft));
  formData.append("lat", String(data.lat));
  formData.append("lng", String(data.lng));
  formData.append("accuracy_m", String(data.accuracy_m));
  return formData;
}

interface PostService {
  createPost: (data: CreatePostRequest) => Promise<PostReponse>;
  listPost: (params?: PostParams) => Promise<PostListResponse>;
  deletePost: (postId: string) => Promise<PostReponse>;
  updatePost: (postId: string) => Promise<PostReponse>;
  postRetrieve: (postId: string) => Promise<PostReponse>;
  partialUpdate: (postId: string) => Promise<PostReponse>;
}

const postService: PostService = {
  createPost: (data) =>
    apiClient<PostReponse>(PostEndpoints.createPost(data), {
      method: "POST",
      credentials: "include",
      body: buildPostFormData(data),
    }),
  listPost: (params) =>
    apiClient<PostListResponse>(PostEndpoints.listPost(params), {
      method: "GET",
      credentials: "include",
    }),
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
