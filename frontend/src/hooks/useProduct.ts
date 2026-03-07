import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type Product } from '../backend';

export function useProduct(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getProduct(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}
