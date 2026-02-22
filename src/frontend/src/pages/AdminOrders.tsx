import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAllOrders } from '../hooks/useAllOrders';
import { useOrdersByStatus } from '../hooks/useOrdersByStatus';
import { useLanguage } from '../contexts/LanguageContext';
import { OrderStatus } from '../backend';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { Loader2, Package, ChevronRight } from 'lucide-react';

export default function AdminOrders() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  const { data: allOrders, isLoading: loadingAll } = useAllOrders();
  const { data: pendingOrders } = useOrdersByStatus(OrderStatus.pending);
  const { data: processingOrders } = useOrdersByStatus(OrderStatus.processing);
  const { data: shippedOrders } = useOrdersByStatus(OrderStatus.shipped);
  const { data: deliveredOrders } = useOrdersByStatus(OrderStatus.delivered);

  const currency = language === 'ne' ? 'रू' : '₹';

  const displayOrders = statusFilter === 'all' ? allOrders :
    statusFilter === OrderStatus.pending ? pendingOrders :
    statusFilter === OrderStatus.processing ? processingOrders :
    statusFilter === OrderStatus.shipped ? shippedOrders :
    deliveredOrders;

  const statusOptions: Array<{ value: OrderStatus | 'all'; label: string }> = [
    { value: 'all', label: t('allOrders') },
    { value: OrderStatus.pending, label: t('pending') },
    { value: OrderStatus.processing, label: t('processing') },
    { value: OrderStatus.shipped, label: t('shipped') },
    { value: OrderStatus.delivered, label: t('delivered') },
  ];

  if (loadingAll) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold">{t('manageOrders')}</h1>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setStatusFilter(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all min-h-[44px] ${
                statusFilter === option.value
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted hover:bg-muted/80 text-foreground'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {!displayOrders || displayOrders.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <Package className="h-16 w-16 text-muted-foreground/30 mx-auto" />
            <p className="text-muted-foreground text-lg">{t('noOrders')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => navigate({ to: '/admin/order/$orderId', params: { orderId: order.id } })}
                className="bg-card rounded-xl shadow-soft p-4 sm:p-6 hover:shadow-elegant transition-all cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-sm font-bold">{order.id}</span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t('customerName')}: {order.shippingDetails.name}
                    </p>
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
