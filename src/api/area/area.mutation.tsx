import { useFetchWithAuth } from '@/hooks/use-fetch-with-auth'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner';

export const useAreaMutation = () => {
  
    const api = useFetchWithAuth();
    const queryClient = useQueryClient();

    const useSetUserAreaMutation = () => {
        return useMutation({
            mutationFn: async (areaId: string) => {
                const response = await api.post('/areas/user', {
                    areaId: areaId
                })
                return response.data
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['user-area'] });
                toast.success('Área definida com sucesso');
            },
            onError: (error: any) => {
                toast.error(error.response.data.message);
            }
        })
    }
  
    return {
        useSetUserAreaMutation
    }
}
