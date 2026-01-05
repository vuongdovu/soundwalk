
export type PostReponse = {
    photo: string
    visibility: string
    taken_at: string
    is_draft: boolean
    lat: number
    lng: number
    accuracy_m: number
}

export type CreatePostRequest = {
    photo: string
    visibility: string
    taken_at: string
    is_draft: boolean
    lat: number
    lng: number
    accuracy_m: number
}