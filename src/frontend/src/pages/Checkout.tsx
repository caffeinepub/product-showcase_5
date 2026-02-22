import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCart } from '../hooks/useCart';
import { useCheckout } from '../hooks/useCheckout';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, MapPin } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const { data: cart, isLoading: cartLoading } = useCart();
  const checkout = useCheckout();
  const { t, language } = useLanguage();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  const total = cart?.reduce((sum, item) => sum + Number(item.product.price) * Number(item.quantity), 0) || 0;
  const currency = language === 'ne' ? 'रू' : '₹';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const orderId = await checkout.mutateAsync({
        shippingDetails: { name, phone, address, city },
      });
      navigate({ to: '/order-confirmation/$orderId', params: { orderId } });
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };

  if (cartLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground text-lg mb-4">{t('emptyCart')}</p>
        <Button onClick={() => navigate({ to: '/' })}>{t('startShopping')}</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 sm:mb-8">{t('checkout')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Shipping Form */}
          <div className="bg-card rounded-xl shadow-soft p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <img src="/assets/generated/nepal-pin.dim_48x48.png" alt="Nepal" className="h-6 w-6" />
              <h2 className="text-lg sm:text-xl font-bold">{t('shippingDetails')}</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('fullName')} *</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder={t('fullName')}
                  className="min-h-[48px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t('phoneNumber')} *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder={t('phoneNumber')}
                  className="min-h-[48px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">{t('deliveryAddress')} *</Label>
                <Textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder={t('deliveryAddress')}
                  rows={3}
                  className="min-h-[96px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">{t('city')} *</Label>
                <Input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  placeholder={t('city')}
                  className="min-h-[48px]"
                />
              </div>

              <div className="pt-4 space-y-3">
                <div className="bg-muted rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{t('paymentMethod')}</h3>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{t('cashOnDelivery')}</p>
                      <p className="text-sm text-muted-foreground">{t('codDescription')}</p>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full min-h-[48px]"
                  size="lg"
                  disabled={checkout.isPending}
                >
                  {checkout.isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      {t('placingOrder')}
                    </>
                  ) : (
                    t('placeOrder')
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-card rounded-xl shadow-soft p-4 sm:p-6 h-fit">
            <h2 className="text-lg sm:text-xl font-bold mb-4">{t('orderSummary')}</h2>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-3 sm:gap-4">
                  <img
                    src={item.product.image.getDirectURL()}
                    alt={item.product.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm line-clamp-2">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('quantity')}: {Number(item.quantity)}
                    </p>
                    <p className="text-sm font-bold text-primary mt-1">
                      {currency}{(Number(item.product.price) * Number(item.quantity)).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}

              <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between text-lg sm:text-xl font-bold">
                  <span>{t('total')}</span>
                  <span className="text-primary">{currency}{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
