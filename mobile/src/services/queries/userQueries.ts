import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { User, ApiResponse } from '@/types';

/**
 * Fetch the current authenticated user's profile from the API
 */
export const useUserProfile = () => {
  return useQuery<User, Error>({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<User>>('/auth/me');
      return response.data.data;
    },
    // Only fetch if a token is present (we mock this or handle it dynamically)
    retry: 1,
  });
};

/**
 * Update the user's profile information
 */
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, Partial<User>>({
    mutationFn: async (updatedFields) => {
      const response = await api.put<ApiResponse<User>>('/user/profile', updatedFields);
      return response.data.data;
    },
    onSuccess: (data) => {
      // Invalidate the cache to trigger a reload of the profile
      queryClient.setQueryData(['userProfile'], data);
    },
  });
};
