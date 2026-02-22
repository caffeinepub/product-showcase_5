import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';
import { useLanguage } from '../contexts/LanguageContext';

export function useAddToCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addToCart(productId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success(t('itemAddedToCart'));
    },
    onError: (error: any) => {
      toast.error(error.message || t('error'));
    },
  });
}
