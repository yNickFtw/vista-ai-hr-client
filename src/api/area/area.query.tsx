import { useFetchWithAuth } from '@/hooks/use-fetch-with-auth';
import { useQuery } from '@tanstack/react-query'
import type { AreasResponse, Area } from '@/types/area.types';

export const useAreaQuery = () => {
  
    const api = useFetchWithAuth();

    const useListAreasQuery = (page: number, limit: number, search?: string) => {
        return useQuery<AreasResponse>({
            queryKey: ['areas', page, limit, search],
            queryFn: async () => {
                const response = await api.get('/areas', {
                    params: {
                        page,
                        limit,
                        search
                    }
                })
                return response.data;
            }
        })
    }
    
    const useGetUserAreaQuery = () => {
        return useQuery<Area | null>({
            queryKey: ['user-area'],
            queryFn: async () => {
                const response = await api.get('/areas/user');
                return response.data;
            }
        })
    }

    return {
        useListAreasQuery,
        useGetUserAreaQuery
    }
}
