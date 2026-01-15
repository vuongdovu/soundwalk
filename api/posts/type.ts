import { PaginatedResponse } from "../apiTypes";
export type PostVisibility = "PU" | "FR" | "PR";

export type PostReponse = {
    id?: string
    photo: string
    visibility: PostVisibility
    taken_at: string
    is_draft: boolean
    lat: number
    lng: number
    accuracy_m: number
}

export type PostListResponse = PaginatedResponse<PostReponse> | PostReponse[]

export type CreatePostRequest = {
    photo: string
    visibility: PostVisibility
    taken_at: string
    is_draft: boolean
    lat: number
    lng: number
    accuracy_m: number
}

export type PostParams = {
    is_draft?: boolean
    visibility?: PostVisibility
    lat?: number
    lng?: number
    start_date?: string
    end_date?: string
}
