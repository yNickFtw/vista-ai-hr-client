import { useFetchWithAuth } from '@/hooks/use-fetch-with-auth'
import type { Experience } from '@/types/user.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useExperienceMutation = () => {
  
    const api = useFetchWithAuth();

    const queryClient = useQueryClient();
  
    const useCreateExperience = () => {
        return useMutation({
            mutationFn: async (experience: Partial<Experience>) => {
                return (await api.post('/experiences/create', experience)).data
            },

            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['me'] })
            },

            onError: (error: any) => {
                toast.error(error.response.data.message)
            }
        })
    }

    return {
        useCreateExperience
    }
}
