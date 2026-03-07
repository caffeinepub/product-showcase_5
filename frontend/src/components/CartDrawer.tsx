import { useNavigate } from '@tanstack/react-router';
import { useCart } from '../hooks/useCart';
import { useRemoveFromCart } from '../hooks/useRemoveFromCart';
import { useUpdateCartQuantity } from '../hooks/useUpdateCartQuantity';
import { useLanguage } from '../contexts/LanguageContext';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const navigate = useNavigate();
  const { data: cart, isLoading } = useCart();
  const removeFromCart = useRemoveFromCart();
  const updateQuantity = useUpdateCartQuantity();
  const { t, language } = useLanguage();

  const total = cart?.reduce((sum, item) => sum + Number(item.product.price) * Number(item.quantity), 0) || 0;
  const currency = language === 'ne' ? 'रू' : '₹';

  const handleCheckout = () => {
    onClose();
    navigate({ to: '/checkout' });
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-card shadow-2xl z-50 flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">{t('cart')}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-accent transition-colors min-h-[44px] min-w-[44px]"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">{t('loading')}</div>
          ) : !cart || cart.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto" />
              <p className="text-muted-foreground">{t('emptyCart')}</p>
              <Button onClick={onClose}>{t('startShopping')}</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-4 bg-background rounded-lg p-3">
                  <img
                    src={item.product.image.getDirectURL()}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm line-clamp-2">{item.product.name}</h3>
                    <p className="text-sm text-primary font-bold mt-1">
                      {currency}{Number(item.product.price).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => {
                          const newQty = Number(item.quantity) - 1;
                          if (newQty > 0) {
                            updateQuantity.mutate({ productId: item.product.id, quantity: BigInt(newQty) });
                          }
                        }}
                        disabled={updateQuantity.isPending}
                        className="p-1 rounded bg-muted hover:bg-muted/80 transition-colors min-h-[32px] min-w-[32px]"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-medium w-8 text-center">{Number(item.quantity)}</span>
                      <button
                        onClick={() => {
                          const newQty = Number(item.quantity) + 1;
                          if (newQty <= Number(item.product.stock)) {
                            updateQuantity.mutate({ productId: item.product.id, quantity: BigInt(newQty) });
                          }
                        }}
                        disabled={updateQuantity.isPending || Number(item.quantity) >= Number(item.product.stock)}
                        className="p-1 rounded bg-muted hover:bg-muted/80 transition-colors disabled:opacity-50 min-h-[32px] min-w-[32px]"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeFromCart.mutate(item.product.id)}
                        disabled={removeFromCart.isPending}
                        className="ml-auto p-1 rounded text-destructive hover:bg-destructive/10 transition-colors min-h-[32px] min-w-[32px]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart && cart.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex items-center justify-between text-lg font-bold">
              <span>{t('cartTotal')}</span>
              <span className="text-primary">{currency}{total.toLocaleString()}</span>
            </div>
            <Button
              onClick={handleCheckout}
              className="w-full min-h-[48px]"
              size="lg"
            >
              {t('proceedToCheckout')}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
