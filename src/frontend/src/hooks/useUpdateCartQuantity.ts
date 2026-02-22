import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useUpdateCartQuantity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCartQuantity(productId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}
