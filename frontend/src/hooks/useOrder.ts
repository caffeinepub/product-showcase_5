import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type Order } from '../backend';

export function useOrder(orderId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Order>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getOrder(orderId);
    },
    enabled: !!actor && !isFetching && !!orderId,
  });
}
