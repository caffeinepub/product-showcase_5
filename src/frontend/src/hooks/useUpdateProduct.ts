import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type ExternalBlob } from '../backend';

interface UpdateProductParams {
  id: string;
  name: string;
  description: string;
  price: bigint;
  image: ExternalBlob;
  whatsappNumber: string;
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UpdateProductParams) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProduct(
        params.id,
        params.name,
        params.description,
        params.price,
        params.image,
        params.whatsappNumber
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
  });
}
