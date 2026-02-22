import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useAddToCart } from '../hooks/useAddToCart';
import { useLanguage } from '../contexts/LanguageContext';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AddToCartButtonProps {
  productId: string;
  stock: bigint;
}

export default function AddToCartButton({ productId, stock }: AddToCartButtonProps) {
  const { identity } = useInternetIdentity();
  const addToCart = useAddToCart();
  const { t } = useLanguage();
  const [quantity] = useState(1);

  const isAuthenticated = !!identity;
  const isOutOfStock = Number(stock) === 0;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert(t('login'));
      return;
    }
    addToCart.mutate({ productId, quantity: BigInt(quantity) });
  };

  if (isOutOfStock) {
    return (
      <Button disabled className="w-full min-h-[44px]" variant="secondary">
        {t('outOfStock')}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={addToCart.isPending}
      className="w-full min-h-[44px]"
    >
      {addToCart.isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          {t('loading')}
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4 mr-2" />
          {t('addToCart')}
        </>
      )}
    </Button>
  );
}
