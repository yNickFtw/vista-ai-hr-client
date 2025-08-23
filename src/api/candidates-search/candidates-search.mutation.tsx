import { useFetchWithAuth } from "@/hooks/use-fetch-with-auth"
import { useMutation } from "@tanstack/react-query";

export const useCandidateSearchMutation = () => {

    const api = useFetchWithAuth();

    const useSearchCandidateByQueryMutation = () => {
        return useMutation({
            mutationFn: (query: string) => api.post('/candidates-search', { query }),
            onSuccess: (data) => {
                return data;
            },
            onError: (error) => {
                console.log(error);
            },
        })
    }

  return {
    useSearchCandidateByQueryMutation
  }
}
