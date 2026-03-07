import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

interface UpdateStockParams {
  productId: string;
  stock: bigint;
}

export function useUpdateStock() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, stock }: UpdateStockParams) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateStock(productId, stock);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['lowStockProducts'] });
    },
  });
}
