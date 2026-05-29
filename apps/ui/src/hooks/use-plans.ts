import { useQuery } from '@tanstack/react-query';
import type { Api } from '../api/types';

export function usePlans(api: Api, providerId: string | null) {
  const query = useQuery({
    queryKey: ['plans', providerId],
    queryFn: () => api.getPlans(providerId!),
    enabled: providerId !== null,
  });

  return {
    plans: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
