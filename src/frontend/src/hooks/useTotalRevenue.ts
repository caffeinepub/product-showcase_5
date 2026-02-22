import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useTotalRevenue() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['totalRevenue'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getTotalRevenue();
    },
    enabled: !!actor && !isFetching,
    refetchOnMount: true,
  });
}
