import { useFetchWithAuth } from '@/hooks/use-fetch-with-auth'
import { useAuthStore } from '@/stores/auth.store';
import { useQuery } from '@tanstack/react-query'
import type { User } from '@/types/user.types'

export const useUserQuery = () => {
  
    const { isAuth } = useAuthStore();

    const api = useFetchWithAuth();

    const useGetLoggedUser = () => {
        return useQuery({
            queryKey: ['me'],
            queryFn: async (): Promise<User> => {
                const response = await api.get('/users/me');
                return response.data;
            },
            enabled: isAuth
        })
    }
  
    return {
        useGetLoggedUser
    }
}
