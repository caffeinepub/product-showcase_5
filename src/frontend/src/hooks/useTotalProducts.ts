import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useTotalProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['totalProducts'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getTotalProducts();
    },
    enabled: !!actor && !isFetching,
    refetchOnMount: true,
  });
}
