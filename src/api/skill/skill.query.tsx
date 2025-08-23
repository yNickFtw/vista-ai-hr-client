import { useFetchWithAuth } from '@/hooks/use-fetch-with-auth';
import { useQuery } from '@tanstack/react-query';

export const useSkillQueries = () => {
  
    const api = useFetchWithAuth();
  
    const useListSkillsQuery = (page: number = 1, limit: number = 10, search?: string) => {
        return useQuery({
            queryKey: ['skills', page, limit, search],
            queryFn: async () => {
                const response = await api.get('/skills', {
                    params: {
                        page,
                        limit,
                        search
                    }
                });
                return response.data;
            }
        })
    }

    const useListSkillsByUserQuery = () => {
        return useQuery({
            queryKey: ['use-skills'],
            queryFn: async () => {
                const response = await api.get('/skills/user');
                return response.data;
            }
        })
    }

    return {
        useListSkillsQuery,
        useListSkillsByUserQuery
    }
}
