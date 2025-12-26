export type AuthResponse = {
  access: string;
  resfresh: string;
};

export type UserResponse = {
    date_joined: string;
    email: string;
    email_verified: boolean;
    full_name: string;
    id: string;
    linked_providers: string[];
    profile_completed: boolean;
    username: string;
    access: string;
    refresh: string;
};