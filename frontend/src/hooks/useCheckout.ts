import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type ShippingDetails } from '../backend';

export function useCheckout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ shippingDetails }: { shippingDetails: ShippingDetails }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.checkout(shippingDetails);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
