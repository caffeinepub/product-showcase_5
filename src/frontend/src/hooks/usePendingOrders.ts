import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function usePendingOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['pendingOrdersCount'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPendingOrdersCount();
    },
    enabled: !!actor && !isFetching,
    refetchOnMount: true,
  });
}
