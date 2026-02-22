import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type Product } from '../backend';

export function useLowStockProducts(threshold: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', 'lowStock', threshold.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLowStockProducts(threshold);
    },
    enabled: !!actor && !isFetching,
  });
}
