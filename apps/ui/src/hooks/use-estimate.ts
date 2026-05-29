import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Api, UpdateEstimateInput } from '../api/types';

const QUERY_KEY = ['estimate'];

export function useEstimate(api: Api) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => api.getEstimate(),
    refetchOnWindowFocus: true,
  });

  const update = useMutation({
    mutationFn: (input: UpdateEstimateInput) => api.updateEstimate(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  const finalise = useMutation({
    mutationFn: () => api.finaliseEstimate(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  return {
    estimate: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    isUpdating: update.isPending,
    isFinalising: finalise.isPending,
    update: update.mutateAsync,
    finalise: finalise.mutateAsync,
  };
}
