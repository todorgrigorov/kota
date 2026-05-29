import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Api, UpdateEstimateInput } from '../api/types';
import type { Plan } from '../types';

export interface UpdateEstimateParams {
  plan: Plan;
  selections: UpdateEstimateInput['selections'];
}

const QUERY_KEY = ['estimate'];

export function useEstimate(api: Api) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => api.getEstimate(),
    refetchOnWindowFocus: true,
  });

  const update = useMutation({
    mutationFn: ({ plan, selections }: UpdateEstimateParams) => {
      const readonlySelections = Object.fromEntries(
        plan.options
          .filter((o) => o.strategy.control === 'readonly')
          .map((o) => [o.code, o.values[0]]),
      );
      return api.updateEstimate({
        plan_id: plan.id,
        selections: { ...readonlySelections, ...selections },
      });
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: QUERY_KEY });
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
