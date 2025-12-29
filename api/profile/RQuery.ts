import { useQuery } from '@tanstack/react-query';
import profileService from './ProfileQueries';

export function useCurrentUserProfile() {
    return useQuery({
    queryKey: ['currentUserProfile'],
    queryFn: async () => profileService.currentUserProfile(),
  });
}