import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useTotalOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['totalOrders'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getTotalOrders();
    },
    enabled: !!actor && !isFetching,
    refetchOnMount: true,
  });
}
