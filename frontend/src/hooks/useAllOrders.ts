import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type Order } from '../backend';

export function useAllOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['orders', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });
}
