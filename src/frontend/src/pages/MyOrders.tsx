import { useNavigate } from '@tanstack/react-router';
import { useUserOrders } from '../hooks/useUserOrders';
import { useLanguage } from '../contexts/LanguageContext';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { Button } from '@/components/ui/button';
import { Loader2, Package, ChevronRight } from 'lucide-react';

export default function MyOrders() {
  const navigate = useNavigate();
  const { data: orders, isLoading } = useUserOrders();
  const { t, language } = useLanguage();
  const currency = language === 'ne' ? 'रू' : '₹';

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 sm:mb-8">{t('myOrdersTitle')}</h1>

        {!orders || orders.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <Package className="h-16 w-16 text-muted-foreground/30 mx-auto" />
            <p className="text-muted-foreground text-lg">{t('noOrders')}</p>
            <Button onClick={() => navigate({ to: '/' })}>{t('startShopping')}</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => navigate({ to: '/order/$orderId', params: { orderId: order.id } })}
                className="bg-card rounded-xl shadow-soft p-4 sm:p-6 hover:shadow-elegant transition-all cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold">{order.id}</span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t('items')}: {order.items.length}
                    </p>
                    <p className="text-lg font-bold text-primary">
                      {currency}{Number(order.total).toLocaleString()}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground self-center sm:self-auto" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
