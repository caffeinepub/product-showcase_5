import { useParams, useNavigate } from '@tanstack/react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package } from 'lucide-react';

export default function OrderConfirmation() {
  const { orderId } = useParams({ from: '/order-confirmation/$orderId' });
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-2xl mx-auto text-center space-y-6 sm:space-y-8">
        <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-green-500/10 animate-scale-in">
          <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-500" />
        </div>

        <div className="space-y-3 sm:space-y-4">
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-green-600">
            {t('orderPlaced')}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">{t('orderConfirmation')}</p>
        </div>

        <div className="bg-card rounded-xl shadow-soft p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <span className="text-muted-foreground">{t('orderId')}</span>
            <span className="font-mono font-bold text-sm sm:text-base">{orderId}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <span className="text-muted-foreground">{t('estimatedDelivery')}</span>
            <span className="font-semibold">{t('businessDays')}</span>
          </div>
          <div className="bg-muted rounded-lg p-4 text-left">
            <p className="text-sm text-muted-foreground">{t('deliveryNote')}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
          <Button
            onClick={() => navigate({ to: '/order/$orderId', params: { orderId } })}
            variant="outline"
            className="flex-1 min-h-[48px]"
          >
            <Package className="h-4 w-4 mr-2" />
            {t('viewOrderDetails')}
          </Button>
          <Button
            onClick={() => navigate({ to: '/' })}
            className="flex-1 min-h-[48px]"
          >
            {t('continueShopping')}
          </Button>
        </div>
      </div>
    </div>
  );
}
