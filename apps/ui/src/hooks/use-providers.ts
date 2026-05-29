import { useQuery } from '@tanstack/react-query';
import type { Api } from '../api/types';

export function useProviders(api: Api) {
  const query = useQuery({
    queryKey: ['providers'],
    queryFn: () => api.getProviders(),
  });

  return {
    providers: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
