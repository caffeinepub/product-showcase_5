import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type ExternalBlob, type ProductCategory } from '../backend';

interface CreateProductParams {
  name: string;
  description: string;
  price: bigint;
  image: ExternalBlob;
  whatsappNumber: string;
  category: ProductCategory;
  stock: bigint;
}

export function useCreateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateProductParams) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProduct(
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
