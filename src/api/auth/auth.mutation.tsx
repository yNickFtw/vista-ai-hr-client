import { useFetchWithAuth } from '@/hooks/use-fetch-with-auth'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth.store'

export const useAuthMutation = () => {
  
    const api = useFetchWithAuth();
    const { setIsAuth } = useAuthStore();

    const useRegisterMutation = () => {
        return useMutation({
            mutationFn: async (data: { name: string, email: string, password: string }) => {
                return (await api.post<{ accessToken: string }>("/auth/register", data)).data;
            },

            onSuccess: (data) => {
                setIsAuth(true);
                localStorage.setItem('accessToken', data.accessToken);
                
                toast.success("Usuário cadastrado com sucesso");
            },
            onError: (error: any) => {
                toast.error(error.response.data.message);
            },
        })
    }

    const useLoginMutation = () => {
        return useMutation({
            mutationFn: async (data: { email: string, password: string }) => {
                return (await api.post<{ accessToken: string }>("/auth/login", data)).data;
            },

            onSuccess: (data) => {
                setIsAuth(true);
                localStorage.setItem('accessToken', data.accessToken);
                
                toast.success("Usuário logado com sucesso");
            },
            onError: (error: any) => {
                console.log(error);
                toast.error(error.response.data.message);
            },
        })
    }

    return {
        useRegisterMutation,
        useLoginMutation,
    }
}
