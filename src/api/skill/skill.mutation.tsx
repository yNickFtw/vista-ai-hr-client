import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFetchWithAuth } from "@/hooks/use-fetch-with-auth";
import { toast } from "sonner";

export const useSkillMutation = () => {
    const api = useFetchWithAuth();

    const queryClient = useQueryClient();

    const useAddSkillMutation = () => {
        return useMutation({
            mutationFn: async (skillId: string) => {
                const response = await api.post(`/skills/user`, { skillId });
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['use-skills'] });
                toast.success('Competência adicionada com sucesso');
            },
            onError: (error: any) => {
                toast.error(error.response.data.message);
            }
        });
    }

    const useRemoveSkillMutation = () => {
        return useMutation({
            mutationFn: async (skillId: string) => {
                const response = await api.delete(`/skills/user/${skillId}`);
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['use-skills'] });
                toast.success('Competência removida com sucesso');
            },
            onError: (error: any) => {
                toast.error(error.response.data.message);
            }
        });
    }

    return {
        useAddSkillMutation,
        useRemoveSkillMutation
    }
}
