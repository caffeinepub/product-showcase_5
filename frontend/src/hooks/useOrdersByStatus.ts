import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type Order, OrderStatus } from '../backend';

export function useOrdersByStatus(status: OrderStatus) {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['orders', 'status', status],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrdersByStatus(status);
    },
    enabled: !!actor && !isFetching,
  });
}
