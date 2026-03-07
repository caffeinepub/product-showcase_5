import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type ExternalBlob, type ProductCategory } from '../backend';

interface UpdateProductParams {
  id: string;
  name: string;
  description: string;
  price: bigint;
  image: ExternalBlob;
  whatsappNumber: string;
  category: ProductCategory;
  stock: bigint;
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
        params.whatsappNumber,
        params.category,
        params.stock
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
