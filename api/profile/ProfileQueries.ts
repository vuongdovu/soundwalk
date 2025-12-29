import { apiClient } from "../apiClient";
import { ProfileEndpoints } from "./endpoints";
import { Profile } from "./type";

interface ProfileService {
    currentUserProfile: () => Promise<Profile>;
}

const profileService: ProfileService = {
    currentUserProfile: () =>
        apiClient<Profile>(ProfileEndpoints.getCurrentUserProfile(), { method: "GET"}),
};

export default profileService;