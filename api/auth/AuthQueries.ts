import { apiClient } from "../apiClient";
import { AuthEndpoints } from "./endpoints";
import { AuthResponse, UserResponse } from "./type";

interface AuthService {
    me: () => Promise<UserResponse>;
    login: (email: string, password: string) => Promise<UserResponse>;
    logout: (refresh: string) => Promise<void>;
    register: (email: string, password1: string, password2: string) => Promise<AuthResponse>;
    google: (token: string) => Promise<UserResponse>;
}

const authService: AuthService = {
  me: () =>
    apiClient<UserResponse>(AuthEndpoints.me(), { method: "GET", credentials: "include" }),
  login: (email, password) =>
    apiClient<UserResponse>(AuthEndpoints.login(), {
      method: "POST",
      body: { email, password },
    }),
  logout: (refresh) =>
    apiClient<void>(AuthEndpoints.logout(), {
      method: "POST",
      body: {refresh}
    }),
  register: (email, password1, password2) =>
    apiClient<AuthResponse>(AuthEndpoints.register(), {
      method: "POST",
      body: { email, password1, password2 },
    }),
  google: (accessToken) => 
    apiClient<UserResponse>(AuthEndpoints.google(), {
      method: "POST",
      body: { access_token: accessToken },
    }),
};

export default authService;