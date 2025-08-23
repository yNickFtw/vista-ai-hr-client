import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useFetchWithAuth } from '@/hooks/use-fetch-with-auth'

export const useUserMutation = () => {

    const api = useFetchWithAuth()
    
    const useRequestUserSummaryMutation = () => {
        return useMutation({
            mutationFn: async () => {
                const response = await api.post('/users/summary/request');
                return response.data;
            },
            onSuccess: () => {
                toast.success('Solicitação de avaliação enviada com sucesso');
            },
            onError: (error: any) => {
                toast.error(error.response.data.message);
            }
        })
    }
  
    return {
        useRequestUserSummaryMutation
    }
}
