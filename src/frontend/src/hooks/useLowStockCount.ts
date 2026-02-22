import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useLowStockCount(threshold: bigint = BigInt(10)) {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['lowStockCount', threshold.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getLowStockCount(threshold);
    },
    enabled: !!actor && !isFetching,
    refetchOnMount: true,
  });
}
