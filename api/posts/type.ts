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
    count: number
}

export type ClusterInfo = {
    count: number,
    h3_index: string,
    lat: number,
    lng: number
}

export type PostClusterResponse = { 
    clusters: ClusterInfo[]; 
    resolution: number 
};

export type PostPageResponse = PaginatedResponse<PostReponse> | PostReponse[];

export type CreatePostRequest = {
    photo: string
    visibility: PostVisibility
    taken_at: string
    is_draft: boolean
    lat: number
    lng: number
    accuracy_m: number
}

export type ClusterParams =  
PostParams & {
    h3_index: string
}

export type PostParams = {
    is_draft?: boolean
    visibility?: PostVisibility
    lat?: number
    lng?: number
    start_date?: string
    end_date?: string
    resolution?: number
    page?: number
}
