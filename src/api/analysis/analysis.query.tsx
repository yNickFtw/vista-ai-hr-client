import { useFetchWithAuth } from '@/hooks/use-fetch-with-auth'
import { useQuery } from '@tanstack/react-query'

export const useAnalysisQuery = () => {
  
    const api = useFetchWithAuth();

    const useListAllAnalysisQuery = (page: number, limit: number) => {
        return useQuery({
            queryKey: ['analysis', page, limit],
            queryFn: async () => {
                const response = await api.get(`/analysis/list-all?page=${page}&limit=${limit}`);
                return response.data;
            },
        })
    }

    const useGetAnalysisByIdQuery = (id: string) => {
        return useQuery({
            queryKey: ['analysis', id],
            queryFn: async () => {
                const response = await api.get(`/analysis/get-by-id/${id}`);
                return response.data;
            },
        })
    }
  
    return {
        useListAllAnalysisQuery,
        useGetAnalysisByIdQuery
    }
}
